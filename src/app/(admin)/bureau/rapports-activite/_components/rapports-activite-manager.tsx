"use client"

import { useCallback, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { activityReportsPublicQueryKey } from "@/app/(public)/notre-association/_hooks/use-activity-reports-public"
import {
  deleteActivityReportAction,
  saveActivityReportsBatchAction,
  setActivityReportPublishedAction,
  updateActivityReportAction,
} from "../_actions/activity-reports-actions"
import type { BureauActivityReportRow } from "../_types/bureau-activity-report-row"
import { RapportsActiviteEditDialog } from "./rapports-activite-edit-dialog"
import { RapportsActiviteListCard } from "./rapports-activite-list-card"
import { RapportsActiviteUploadCard, type UploadRow } from "./rapports-activite-upload-card"

interface RapportsActiviteManagerProps {
  reports: BureauActivityReportRow[]
}

/** Clé stable SSR/client pour la première ligne du formulaire (évite hydration mismatch avec random UUID). */
const UPLOAD_FORM_INITIAL_ROW_KEY = "upload-form-initial-row"

function createEmptyRow(year: number, rowKey?: string): UploadRow {
  return { key: rowKey ?? crypto.randomUUID(), year, label: "", file: null }
}

/** Une seule ligne vide — nouvelle clé à chaque reset pour remonter les champs (dont le fichier). */
function createDefaultUploadRows(): UploadRow[] {
  return [createEmptyRow(new Date().getFullYear(), UPLOAD_FORM_INITIAL_ROW_KEY)]
}

function createResetUploadRows(): UploadRow[] {
  return [createEmptyRow(new Date().getFullYear())]
}

function isUploadRowComplete(row: UploadRow): boolean {
  if (!Number.isFinite(row.year) || row.year < 2000 || row.year > 2100) return false
  if (row.label.trim().length === 0) return false
  if (row.file === null) return false
  return true
}

/**
 * Panneau bureau : liste des rapports publiés + formulaire d’envoi multi-années.
 */
export function RapportsActiviteManager({ reports }: RapportsActiviteManagerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadFormResetKey, setUploadFormResetKey] = useState(0)
  const [rows, setRows] = useState<UploadRow[]>(createDefaultUploadRows)
  const [deleteTarget, setDeleteTarget] = useState<BureauActivityReportRow | null>(null)
  const [editTarget, setEditTarget] = useState<BureauActivityReportRow | null>(null)
  const [busyVisibilityId, setBusyVisibilityId] = useState<string | null>(null)

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => b.year - a.year),
    [reports],
  )

  const lastRow = rows[rows.length - 1]
  const canAddAnotherRow = lastRow ? isUploadRowComplete(lastRow) : false

  const displayTitle = useCallback((r: BureauActivityReportRow) => {
    const t = r.label?.trim()
    return t && t.length > 0 ? t : `Rapport d'activités ${r.year}`
  }, [])

  const handleAddRow = useCallback(() => {
    const last = rows[rows.length - 1]
    if (!last || !isUploadRowComplete(last)) {
      setFormError(
        "Complétez la ligne en cours (année entre 2000 et 2100, titre affiché et fichier) avant d’ajouter une autre année.",
      )
      return
    }
    setFormError(null)
    setRows((prev) => {
      const minYear = prev.length > 0 ? Math.min(...prev.map((p) => p.year)) : new Date().getFullYear()
      return [...prev, createEmptyRow(Math.max(2000, minYear - 1))]
    })
  }, [rows])

  const handleRemoveRow = useCallback((key: string) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.key !== key)))
  }, [])

  const handleChangeRow = useCallback((key: string, patch: Partial<UploadRow>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  }, [])

  const resetUploadForm = useCallback(() => {
    setFormError(null)
    setUploadFormResetKey((k) => k + 1)
    setRows(createResetUploadRows())
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setFormError(null)

      const hasIncomplete = rows.some((r) => !isUploadRowComplete(r))
      if (hasIncomplete) {
        setFormError(
          "Chaque ligne doit avoir une année valide (2000–2100), un titre affiché et un fichier.",
        )
        return
      }

      const years = rows.map((r) => r.year)
      if (new Set(years).size !== years.length) {
        setFormError("Deux lignes utilisent la même année : corrigez avant d’envoyer.")
        return
      }

      const metadata = rows.map((r) => ({
        year: r.year,
        label: r.label.trim(),
      }))

      const fd = new FormData()
      fd.set("metadata", JSON.stringify(metadata))
      rows.forEach((r) => {
        if (r.file) fd.append("files", r.file)
      })

      startTransition(async () => {
        const result = await saveActivityReportsBatchAction(fd)
        if (!result.success) {
          setFormError(result.error)
          return
        }
        toast.success(result.message)
        await queryClient.invalidateQueries({ queryKey: activityReportsPublicQueryKey })
        resetUploadForm()
        router.refresh()
      })
    },
    [queryClient, resetUploadForm, router, rows],
  )

  const handlePublishedChange = useCallback(
    async (id: string, isPublished: boolean) => {
      setBusyVisibilityId(id)
      try {
        const result = await setActivityReportPublishedAction({ id, isPublished })
        if (!result.success) {
          toast.error(result.error)
          return
        }
        toast.success(result.message)
        await queryClient.invalidateQueries({ queryKey: activityReportsPublicQueryKey })
        router.refresh()
      } finally {
        setBusyVisibilityId(null)
      }
    },
    [queryClient, router],
  )

  const handleEditSubmit = useCallback(
    (payload: { id: string; year: number; label: string; file: File | null }) => {
      const fd = new FormData()
      fd.set(
        "metadata",
        JSON.stringify({
          id: payload.id,
          year: payload.year,
          label: payload.label,
        }),
      )
      if (payload.file) {
        fd.set("file", payload.file)
      }

      startTransition(async () => {
        const result = await updateActivityReportAction(fd)
        if (!result.success) {
          toast.error(result.error)
          return
        }
        toast.success(result.message)
        setEditTarget(null)
        await queryClient.invalidateQueries({ queryKey: activityReportsPublicQueryKey })
        router.refresh()
      })
    },
    [queryClient, router],
  )

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setDeleteTarget(null)
    startTransition(async () => {
      const result = await deleteActivityReportAction(id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(result.message)
      await queryClient.invalidateQueries({ queryKey: activityReportsPublicQueryKey })
      router.refresh()
    })
  }, [deleteTarget, queryClient, router])

  return (
    <>
      <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-2">
        <RapportsActiviteUploadCard
          formResetKey={uploadFormResetKey}
          rows={rows}
          formError={formError}
          isPending={isPending}
          canAddAnotherRow={canAddAnotherRow}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onChangeRow={handleChangeRow}
          onSubmit={handleSubmit}
        />
        <RapportsActiviteListCard
          reports={sortedReports}
          displayTitle={displayTitle}
          busyVisibilityId={busyVisibilityId}
          onPublishedChange={handlePublishedChange}
          onRequestEdit={setEditTarget}
          onRequestDelete={setDeleteTarget}
        />
      </div>

      <RapportsActiviteEditDialog
        report={editTarget}
        open={editTarget !== null}
        isPending={isPending}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        onSubmit={handleEditSubmit}
      />

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce rapport ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Le rapport ${deleteTarget.year} (${displayTitle(deleteTarget)}) sera retiré du site.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

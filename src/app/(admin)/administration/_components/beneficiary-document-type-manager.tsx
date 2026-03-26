"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  createBeneficiaryDocumentTypeAction,
  deleteBeneficiaryDocumentTypeAction,
  updateBeneficiaryDocumentTypeAction,
} from "../_actions/manage-beneficiary-document-types"
import type { BeneficiaryDocumentTypeRow } from "../_schemas/beneficiary-document-type.schema"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BeneficiaryDocumentTypeManagerProps {
  className?: string
  initialRows: BeneficiaryDocumentTypeRow[]
}

/**
 * Gestion des libellés « documents fournis » pour la Demande bénéficiaire.
 */
export function BeneficiaryDocumentTypeManager({
  className,
  initialRows,
}: BeneficiaryDocumentTypeManagerProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<BeneficiaryDocumentTypeRow | null>(null)

  const [label, setLabel] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [requiresOtherDetail, setRequiresOtherDetail] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openCreate = useCallback(() => {
    setFormError(null)
    setEditing(null)
    const maxOrder = initialRows.reduce((m, r) => Math.max(m, r.sortOrder), -1)
    setLabel("")
    setSortOrder(maxOrder + 1)
    setRequiresOtherDetail(false)
    setIsActive(true)
    setDialogOpen(true)
  }, [initialRows])

  const openEdit = useCallback((row: BeneficiaryDocumentTypeRow) => {
    setFormError(null)
    setEditing(row)
    setLabel(row.label)
    setSortOrder(row.sortOrder)
    setRequiresOtherDetail(row.requiresOtherDetail)
    setIsActive(row.isActive)
    setDialogOpen(true)
  }, [])

  const handleSave = useCallback(() => {
    setFormError(null)
    startTransition(async () => {
      if (editing) {
        const res = await updateBeneficiaryDocumentTypeAction({
          id: editing.id,
          label,
          sortOrder,
          requiresOtherDetail,
          isActive,
        })
        if (!res.success) {
          setFormError(res.error)
          return
        }
      } else {
        const res = await createBeneficiaryDocumentTypeAction({
          label,
          sortOrder,
          requiresOtherDetail,
          isActive,
        })
        if (!res.success) {
          setFormError(res.error)
          return
        }
      }
      setDialogOpen(false)
      router.refresh()
    })
  }, [editing, label, sortOrder, requiresOtherDetail, isActive, router])

  const handleDelete = useCallback(() => {
    if (!deleteId) return
    const id = deleteId
    setFormError(null)
    startTransition(async () => {
      const res = await deleteBeneficiaryDocumentTypeAction({ id })
      if (!res.success) {
        setFormError(res.error)
        return
      }
      setDeleteId(null)
      router.refresh()
    })
  }, [deleteId, router])

  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Le code technique (colonne Code) est fixé à la création et stocké dans les fiches. Les
          types actifs apparaissent à l’étape Dossier. « Précision obligatoire » exige un texte
          libre (ex. « Autre document »).
        </p>
        <Button
          type="button"
          onClick={openCreate}
          disabled={pending}
          className="h-11 w-full shrink-0 gap-2 bg-sky-600 text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30 sm:h-10 sm:w-auto"
        >
          <Plus className="size-4" aria-hidden />
          Ajouter un document
        </Button>
      </div>

      {formError && (
        <p
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {formError}
        </p>
      )}

      <div className="relative w-full overflow-x-auto rounded-lg border border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Code</TableHead>
              <TableHead className="min-w-[180px]">Libellé</TableHead>
              <TableHead className="w-24 text-right">Ordre</TableHead>
              <TableHead className="min-w-[100px]">Précision</TableHead>
              <TableHead className="w-24">Actif</TableHead>
              <TableHead className="w-24 text-right">Fiches</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialRows.map((r) => {
              const deleteBlocked = r.usageCount > 0 || r.code === "OTHER"
              return (
                <TableRow key={r.id}>
                  <TableCell className="align-top font-mono text-xs break-all">{r.code}</TableCell>
                  <TableCell className="align-top font-medium break-words">{r.label}</TableCell>
                  <TableCell className="align-top text-right tabular-nums">{r.sortOrder}</TableCell>
                  <TableCell className="align-top text-sm text-muted-foreground">
                    {requiresOtherDetailLabel(r.requiresOtherDetail)}
                  </TableCell>
                  <TableCell className="align-top text-sm">{r.isActive ? "Oui" : "Non"}</TableCell>
                  <TableCell className="align-top text-right tabular-nums">{r.usageCount}</TableCell>
                  <TableCell className="align-top text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 transition-colors hover:bg-sky-100/90 hover:text-sky-800 dark:hover:bg-sky-950/50 dark:hover:text-sky-200"
                        onClick={() => openEdit(r)}
                        disabled={pending}
                        aria-label={`Modifier ${r.label}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(r.id)}
                        disabled={pending || deleteBlocked}
                        aria-label={`Supprimer ${r.label}`}
                        title={
                          r.code === "OTHER"
                            ? "Type système non supprimable"
                            : r.usageCount > 0
                              ? "Impossible : document coché sur des fiches"
                              : "Supprimer"
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le document" : "Nouveau document"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Le code technique ne change pas ; seuls le libellé, l’ordre et les options sont modifiables."
                : "Un code stable (ex. EXTRAIT_NAISSANCE) sera créé automatiquement à partir du libellé."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="bdoc-label">Libellé</Label>
              <Input
                id="bdoc-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-11"
                placeholder="Ex. Extrait de naissance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bdoc-order">Ordre d&apos;affichage</Label>
              <Input
                id="bdoc-order"
                type="number"
                inputMode="numeric"
                min={0}
                max={9999}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number.parseInt(e.target.value, 10) || 0)}
                className="h-11"
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/80 p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Précision obligatoire</p>
                <p className="text-xs text-muted-foreground">Champ texte supplémentaire au formulaire</p>
              </div>
              <Switch
                checked={requiresOtherDetail}
                onCheckedChange={setRequiresOtherDetail}
                aria-label="Exiger une précision pour ce document"
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/80 p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Actif</p>
                <p className="text-xs text-muted-foreground">Types inactifs masqués du formulaire</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Document actif" />
            </div>
          </div>
          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={pending || label.trim().length < 2}
              className="gap-2 bg-sky-600 text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30"
            >
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Seuls les documents sans fiche associée peuvent être
              supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function requiresOtherDetailLabel(v: boolean): string {
  return v ? "Oui" : "Non"
}

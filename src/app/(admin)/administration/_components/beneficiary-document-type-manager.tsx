"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  beneficiarySuiviFormDialogContentClassName,
  beneficiarySuiviFormDialogFooterClassName,
  beneficiarySuiviTableIconEditClassName,
  beneficiaryTrackingCardClassName,
  beneficiaryTrackingTableBodyRowClassName,
  beneficiaryTrackingTableHeaderRowClassName,
  beneficiaryTrackingTableShellClassName,
} from "./beneficiary-suivi-form-classes"
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
import { Card, CardContent } from "@/components/ui/card"
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

interface DocumentTypeRowActionsProps {
  row: BeneficiaryDocumentTypeRow
  pending: boolean
  onEdit: (row: BeneficiaryDocumentTypeRow) => void
  onDeleteRequest: (id: string) => void
  layout?: "inline" | "footer"
}

function requiresOtherDetailLabel(v: boolean): string {
  return v ? "Oui" : "Non"
}

/**
 * Boutons modifier / supprimer (même logique que le tableau desktop).
 */
function DocumentTypeRowActions({
  row,
  pending,
  onEdit,
  onDeleteRequest,
  layout = "inline",
}: DocumentTypeRowActionsProps) {
  const deleteBlocked = row.usageCount > 0 || row.code === "OTHER"
  const wrap =
    layout === "footer"
      ? "flex w-full items-center justify-end gap-2 border-t border-border/60 pt-3"
      : "flex justify-end gap-1"

  return (
    <div className={wrap}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-9", beneficiarySuiviTableIconEditClassName)}
        onClick={() => onEdit(row)}
        disabled={pending}
        aria-label={`Modifier ${row.label}`}
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 text-destructive hover:text-destructive"
        onClick={() => onDeleteRequest(row.id)}
        disabled={pending || deleteBlocked}
        aria-label={`Supprimer ${row.label}`}
        title={
          row.code === "OTHER"
            ? "Type système non supprimable"
            : row.usageCount > 0
              ? "Impossible : document coché sur des fiches"
              : "Supprimer"
        }
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
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

      <ul className="grid gap-3 md:hidden" aria-label="Documents fournis, affichage compact">
        {initialRows.map((r) => (
          <li key={r.id}>
            <Card className={cn(beneficiaryTrackingCardClassName, "gap-0 py-0 shadow-sm")}>
              <CardContent className="space-y-3 p-4">
                <p className="text-base font-semibold leading-snug break-words text-foreground">
                  {r.label}
                </p>
                <p className="font-mono text-xs break-all text-muted-foreground">{r.code}</p>
                <dl className="grid grid-cols-[minmax(0,auto)_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Ordre</dt>
                  <dd className="tabular-nums text-foreground">{r.sortOrder}</dd>
                  <dt className="text-muted-foreground">Précision</dt>
                  <dd className="text-muted-foreground">
                    {requiresOtherDetailLabel(r.requiresOtherDetail)}
                  </dd>
                  <dt className="text-muted-foreground">Actif</dt>
                  <dd className="text-foreground">{r.isActive ? "Oui" : "Non"}</dd>
                  <dt className="text-muted-foreground">Demandes</dt>
                  <dd className="tabular-nums text-right text-foreground">{r.usageCount}</dd>
                </dl>
                <DocumentTypeRowActions
                  row={r}
                  pending={pending}
                  onEdit={openEdit}
                  onDeleteRequest={setDeleteId}
                  layout="footer"
                />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div
        className={cn("relative hidden w-full md:block", beneficiaryTrackingTableShellClassName)}
      >
        <Table>
          <TableHeader>
            <TableRow className={beneficiaryTrackingTableHeaderRowClassName}>
              <TableHead className="min-w-[100px]">Code</TableHead>
              <TableHead className="min-w-[180px]">Libellé</TableHead>
              <TableHead className="w-24 text-left">Ordre</TableHead>
              <TableHead className="min-w-[100px]">Précision</TableHead>
              <TableHead className="w-24">Actif</TableHead>
              <TableHead className="w-24 text-right">Demandes</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialRows.map((r) => (
              <TableRow key={r.id} className={beneficiaryTrackingTableBodyRowClassName}>
                <TableCell className="align-top font-mono text-xs break-all">{r.code}</TableCell>
                <TableCell className="align-top font-medium break-words">{r.label}</TableCell>
                <TableCell className="align-top text-left tabular-nums">{r.sortOrder}</TableCell>
                <TableCell className="align-top text-sm text-muted-foreground">
                  {requiresOtherDetailLabel(r.requiresOtherDetail)}
                </TableCell>
                <TableCell className="align-top text-sm">{r.isActive ? "Oui" : "Non"}</TableCell>
                <TableCell className="align-top text-right tabular-nums">{r.usageCount}</TableCell>
                <TableCell className="align-top text-right">
                  <DocumentTypeRowActions
                    row={r}
                    pending={pending}
                    onEdit={openEdit}
                    onDeleteRequest={setDeleteId}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={beneficiarySuiviFormDialogContentClassName}>
          <DialogHeader className="space-y-2 pr-10 text-left sm:pr-12">
            <DialogTitle>{editing ? "Modifier le document" : "Nouveau document"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Le code technique ne change pas ; seuls le libellé, l’ordre et les options sont modifiables."
                : "Un code stable (ex. EXTRAIT_NAISSANCE) sera créé automatiquement à partir du libellé."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid min-w-0 gap-4 py-2">
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
            <div className="flex flex-col gap-3 rounded-lg border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium">Précision obligatoire</p>
                <p className="text-xs text-muted-foreground">Champ texte supplémentaire au formulaire</p>
              </div>
              <Switch
                checked={requiresOtherDetail}
                onCheckedChange={setRequiresOtherDetail}
                aria-label="Exiger une précision pour ce document"
                className="shrink-0 self-end sm:self-auto"
              />
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium">Actif</p>
                <p className="text-xs text-muted-foreground">Types inactifs masqués du formulaire</p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                aria-label="Document actif"
                className="shrink-0 self-end sm:self-auto"
              />
            </div>
          </div>
          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}
          <DialogFooter className={beneficiarySuiviFormDialogFooterClassName}>
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

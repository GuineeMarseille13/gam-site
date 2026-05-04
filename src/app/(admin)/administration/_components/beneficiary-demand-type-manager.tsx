"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"

import { cn } from "@/helpers/utils"
import {
  beneficiarySuiviFormDialogContentClassName,
  beneficiarySuiviFormDialogFooterClassName,
  beneficiarySuiviPrimaryButtonClassName,
  beneficiarySuiviTableIconEditClassName,
  beneficiaryTrackingCardClassName,
  beneficiaryTrackingTableShellClassName,
  beneficiaryTrackingTableBodyRowClassName,
  beneficiaryTrackingTableHeaderRowClassName,
} from "./beneficiary-suivi-form-classes"
import {
  createBeneficiaryDemandTypeAction,
  deleteBeneficiaryDemandTypeAction,
  updateBeneficiaryDemandTypeAction,
} from "../_actions/manage-beneficiary-demand-types"
import type { BeneficiaryDemandTypeRow } from "../_schemas/beneficiary-demand-type.schema"
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

interface BeneficiaryDemandTypeManagerProps {
  className?: string
  initialRows: BeneficiaryDemandTypeRow[]
}

interface DemandTypeRowActionsProps {
  row: BeneficiaryDemandTypeRow
  pending: boolean
  onEdit: (row: BeneficiaryDemandTypeRow) => void
  onDeleteRequest: (id: string) => void
  layout?: "inline" | "footer"
}

/**
 * Boutons modifier / supprimer (même logique que le tableau desktop).
 */
function DemandTypeRowActions({
  row,
  pending,
  onEdit,
  onDeleteRequest,
  layout = "inline",
}: DemandTypeRowActionsProps) {
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
        disabled={pending || row.usageCount > 0}
        aria-label={`Supprimer ${row.label}`}
        title={
          row.usageCount > 0 ? "Impossible : types utilisés par des fiches" : "Supprimer"
        }
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}

/**
 * Gestion des libellés « type de demande » pour la Demande bénéficiaire.
 */
export function BeneficiaryDemandTypeManager({
  className,
  initialRows,
}: BeneficiaryDemandTypeManagerProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<BeneficiaryDemandTypeRow | null>(null)

  const [label, setLabel] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [requiresDetail, setRequiresDetail] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const openCreate = useCallback(() => {
    setFormError(null)
    setEditing(null)
    const maxOrder = initialRows.reduce((m, r) => Math.max(m, r.sortOrder), -1)
    setLabel("")
    setSortOrder(maxOrder + 1)
    setRequiresDetail(false)
    setIsActive(true)
    setDialogOpen(true)
  }, [initialRows])

  const openEdit = useCallback((row: BeneficiaryDemandTypeRow) => {
    setFormError(null)
    setEditing(row)
    setLabel(row.label)
    setSortOrder(row.sortOrder)
    setRequiresDetail(row.requiresDetail)
    setIsActive(row.isActive)
    setDialogOpen(true)
  }, [])

  const handleSave = useCallback(() => {
    setFormError(null)
    startTransition(async () => {
      if (editing) {
        const res = await updateBeneficiaryDemandTypeAction({
          id: editing.id,
          label,
          sortOrder,
          requiresDetail,
          isActive,
        })
        if (!res.success) {
          setFormError(res.error)
          return
        }
      } else {
        const res = await createBeneficiaryDemandTypeAction({
          label,
          sortOrder,
          requiresDetail,
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
  }, [editing, label, sortOrder, requiresDetail, isActive, router])

  const handleDelete = useCallback(() => {
    if (!deleteId) return
    const id = deleteId
    setFormError(null)
    startTransition(async () => {
      const res = await deleteBeneficiaryDemandTypeAction({ id })
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
          Les types actifs apparaissent dans le formulaire Demande bénéficiaire. « Précision obligatoire »
          affiche
          un champ texte supplémentaire (ex. « Autre »).
        </p>
        <Button
          type="button"
          onClick={openCreate}
          disabled={pending}
          className={cn(
            "h-11 w-full shrink-0 gap-2 sm:h-10 sm:w-auto",
            beneficiarySuiviPrimaryButtonClassName,
          )}
        >
          <Plus className="size-4" aria-hidden />
          Ajouter un type
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

      <ul className="grid gap-3 md:hidden" aria-label="Types de demande, affichage compact">
        {initialRows.map((r) => (
          <li key={r.id}>
            <Card className={cn(beneficiaryTrackingCardClassName, "gap-0 py-0 shadow-sm")}>
              <CardContent className="space-y-3 p-4">
                <p className="text-base font-semibold leading-snug break-words text-foreground">
                  {r.label}
                </p>
                <dl className="grid grid-cols-[minmax(0,auto)_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Ordre</dt>
                  <dd className="tabular-nums text-foreground">{r.sortOrder}</dd>
                  <dt className="text-muted-foreground">Précision</dt>
                  <dd className="text-muted-foreground">{r.requiresDetail ? "Oui" : "Non"}</dd>
                  <dt className="text-muted-foreground">Actif</dt>
                  <dd className="text-foreground">{r.isActive ? "Oui" : "Non"}</dd>
                  <dt className="text-muted-foreground">Demandes</dt>
                  <dd className="tabular-nums text-right text-foreground">{r.usageCount}</dd>
                </dl>
                <DemandTypeRowActions
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
              <TableHead className="min-w-[180px]">Libellé</TableHead>
              <TableHead className="w-24 text-left">Ordre</TableHead>
              <TableHead className="min-w-[120px]">Précision</TableHead>
              <TableHead className="w-24">Actif</TableHead>
              <TableHead className="w-24 text-right">Demandes</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialRows.map((r) => (
              <TableRow key={r.id} className={beneficiaryTrackingTableBodyRowClassName}>
                <TableCell className="align-top font-medium break-words">{r.label}</TableCell>
                <TableCell className="align-top text-left tabular-nums">{r.sortOrder}</TableCell>
                <TableCell className="align-top text-sm text-muted-foreground">
                  {r.requiresDetail ? "Oui" : "Non"}
                </TableCell>
                <TableCell className="align-top text-sm">{r.isActive ? "Oui" : "Non"}</TableCell>
                <TableCell className="align-top text-right tabular-nums">{r.usageCount}</TableCell>
                <TableCell className="align-top text-right">
                  <DemandTypeRowActions
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
            <DialogTitle>{editing ? "Modifier le type" : "Nouveau type"}</DialogTitle>
            <DialogDescription>
              Libellé affiché dans le formulaire Demande bénéficiaire. L&apos;ordre détermine la liste
              déroulante.
            </DialogDescription>
          </DialogHeader>
          <div className="grid min-w-0 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="bdt-label">Libellé</Label>
              <Input
                id="bdt-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="h-11"
                placeholder="Ex. Demande passport"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bdt-order">Ordre d&apos;affichage</Label>
              <Input
                id="bdt-order"
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
                checked={requiresDetail}
                onCheckedChange={setRequiresDetail}
                aria-label="Exiger une précision"
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
                aria-label="Type actif"
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
              className={cn("gap-2", beneficiarySuiviPrimaryButtonClassName)}
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
            <AlertDialogTitle>Supprimer ce type ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Seuls les types sans fiche associée peuvent être
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

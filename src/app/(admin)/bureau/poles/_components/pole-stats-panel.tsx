"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"

import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { DetailsPoleStat } from "../_schemas/details-pole-stat.schema"
import {
  detailsPoleStatUpsertSchema,
  type DetailsPoleStatUpsertInput,
} from "../_schemas/details-pole-stat-form.schema"
import { usePoleStats } from "../_hooks/use-pole-stats"
import {
  useCreatePoleStat,
  useDeletePoleStat,
  useUpdatePoleStat,
} from "../_hooks/use-pole-stat-mutations"

interface PoleStatsPanelProps {
  poleSlug: BureauPoleContentSlug
}

type FormErrors = Partial<Record<keyof DetailsPoleStatUpsertInput, string>>

function buildDefaultForm(): DetailsPoleStatUpsertInput {
  return { label: "", value: 0, unit: null, helperText: null, order: 0, isActive: true }
}

function getNextOrder(stats: DetailsPoleStat[]): number {
  if (stats.length === 0) return 0
  const max = Math.max(...stats.map((s) => s.order))
  return Number.isFinite(max) ? max + 1 : 0
}

function buildFormFromStat(stat: DetailsPoleStat): DetailsPoleStatUpsertInput {
  return {
    label: stat.label,
    value: stat.value,
    unit: stat.unit ?? null,
    helperText: stat.helperText ?? null,
    order: stat.order,
    isActive: stat.isActive,
  }
}

function normalizeErrors(input: DetailsPoleStatUpsertInput): FormErrors {
  const parsed = detailsPoleStatUpsertSchema.safeParse(input)
  if (parsed.success) return {}

  const flat = parsed.error.flatten().fieldErrors
  return {
    label: flat.label?.[0],
    value: flat.value?.[0],
    unit: flat.unit?.[0],
    helperText: flat.helperText?.[0],
    order: flat.order?.[0],
    isActive: flat.isActive?.[0],
  }
}

/**
 * Composant: PoleStatsPanel
 * Rôle: CRUD des stats dynamiques d’un pôle (dashboard Bureau).
 */
export function PoleStatsPanel({ poleSlug }: PoleStatsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<DetailsPoleStat | null>(null)
  const [form, setForm] = useState<DetailsPoleStatUpsertInput>(() => buildDefaultForm())
  const [errors, setErrors] = useState<FormErrors>({})

  const { data, isLoading, error } = usePoleStats(poleSlug)
  const createMutation = useCreatePoleStat(poleSlug)
  const updateMutation = useUpdatePoleStat(poleSlug)
  const deleteMutation = useDeletePoleStat(poleSlug)

  const isSaving = createMutation.isPending || updateMutation.isPending

  const stats = useMemo(() => data ?? [], [data])

  const handleOpenCreate = useCallback(() => {
    setEditing(null)
    setForm({ ...buildDefaultForm(), order: getNextOrder(stats) })
    setErrors({})
    setIsDialogOpen(true)
  }, [stats])

  const handleOpenEdit = useCallback((stat: DetailsPoleStat) => {
    setEditing(stat)
    setForm(buildFormFromStat(stat))
    setErrors({})
    setIsDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    const nextErrors = normalizeErrors(form)
    const hasErrors = Object.values(nextErrors).some(Boolean)
    if (hasErrors) {
      setErrors(nextErrors)
      return
    }

    try {
      if (!editing) {
        await createMutation.mutateAsync(form)
        toast.success("Statistique créée.", { description: "La carte est maintenant disponible." })
      } else {
        await updateMutation.mutateAsync({ statId: editing.id, payload: form })
        toast.success("Statistique mise à jour.", {
          description: "Les modifications ont été enregistrées.",
        })
      }

      setIsDialogOpen(false)
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message.trim() !== ""
          ? error.message
          : "Réessayez dans un instant."
      toast.error("Enregistrement impossible.", { description: message })
    }
  }, [createMutation, editing, form, updateMutation])

  const handleDelete = useCallback(
    async (statId: string) => {
      try {
        await deleteMutation.mutateAsync(statId)
        toast.success("Statistique supprimée.")
      } catch {
        toast.error("Suppression impossible.", { description: "Réessayez dans un instant." })
      }
    },
    [deleteMutation],
  )

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Chargement des statistiques…</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm text-destructive">
          Impossible de charger les statistiques. Réessayez.
        </p>
      </Card>
    )
  }

  return (
    <section className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Cartes statistiques</h2>
          <p className="text-sm text-muted-foreground">
            Ajoutez, réordonnez et activez les chiffres affichés sur la page publique.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={handleOpenCreate}
              className="w-full justify-center gap-2 rounded-xl bg-amber-500 text-white shadow-md transition-shadow hover:bg-amber-600 hover:shadow-lg sm:w-auto"
            >
              <IconPlus className="size-4" />
              Ajouter une stat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier la stat" : "Nouvelle stat"}</DialogTitle>
              <DialogDescription>
                Renseignez la valeur, le libellé et l’ordre d’affichage.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stat-label">Libellé</Label>
                <Input
                  id="stat-label"
                  value={form.label}
                  onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
                  placeholder="Ex: Permanences administratives"
                />
                {errors.label ? <p className="text-xs text-destructive">{errors.label}</p> : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="stat-value">Valeur</Label>
                  <Input
                    id="stat-value"
                    inputMode="numeric"
                    value={String(form.value)}
                    onChange={(e) => setForm((s) => ({ ...s, value: Number(e.target.value) }))}
                  />
                  {errors.value ? <p className="text-xs text-destructive">{errors.value}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stat-unit">Unité (optionnel)</Label>
                  <Input
                    id="stat-unit"
                    value={form.unit ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                    placeholder="Ex: % / € / personnes"
                  />
                  {errors.unit ? <p className="text-xs text-destructive">{errors.unit}</p> : null}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stat-helper">Texte d’aide (optionnel)</Label>
                <Input
                  id="stat-helper"
                  value={form.helperText ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, helperText: e.target.value }))}
                  placeholder="Ex: Plateforme EKADI"
                />
                {errors.helperText ? (
                  <p className="text-xs text-destructive">{errors.helperText}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="stat-order">Ordre</Label>
                  <Input
                    id="stat-order"
                    inputMode="numeric"
                    value={String(form.order)}
                    onChange={(e) => setForm((s) => ({ ...s, order: Number(e.target.value) }))}
                  />
                  {errors.order ? <p className="text-xs text-destructive">{errors.order}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Actif</p>
                    <p className="text-xs text-muted-foreground">Visible sur la page publique</p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm((s) => ({ ...s, isActive: checked }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-3">
              <Button type="button" variant="outline" className="rounded-xl" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                disabled={isSaving}
                onClick={handleSubmit}
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {stats.length === 0 ? (
        <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Aucune statistique pour le moment. Ajoutez votre première carte.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.id}
              className="rounded-2xl border-border/60 p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-foreground line-clamp-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground tabular-nums">
                    {stat.value}
                    {stat.unit ? (
                      <span className="ml-1 text-base font-semibold text-muted-foreground">
                        {stat.unit}
                      </span>
                    ) : null}
                  </p>
                  {stat.helperText ? (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {stat.helperText}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">Ordre {stat.order}</span>
                  <span
                    className={
                      stat.isActive
                        ? "text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        : "text-xs font-medium text-muted-foreground"
                    }
                  >
                    {stat.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full justify-center gap-2 rounded-xl sm:w-auto"
                  onClick={() => handleOpenEdit(stat)}
                >
                  <IconPencil className="size-4" />
                  Modifier
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-10 w-full justify-center gap-2 rounded-xl sm:w-auto"
                      disabled={deleteMutation.isPending}
                    >
                      <IconTrash className="size-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer cette statistique ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est définitive. La carte ne sera plus affichée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(stat.id)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}


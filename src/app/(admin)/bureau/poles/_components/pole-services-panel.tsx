"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { IconPlus } from "@tabler/icons-react"

import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import type { DetailsPoleService } from "../_schemas/details-pole-service.schema"
import type { DetailsPoleServiceUpsertInput } from "../_schemas/details-pole-service-form.schema"
import { usePoleServices } from "../_hooks/use-pole-services"
import {
  useCreatePoleService,
  useDeletePoleService,
  useUpdatePoleService,
} from "../_hooks/use-pole-service-mutations"
import { PoleServiceCard } from "./pole-service-card"
import { PoleServiceEditor } from "./pole-service-editor"

interface PoleServicesPanelProps {
  poleSlug: EditablePolePublicSlug
}

function buildDefaultForm(): DetailsPoleServiceUpsertInput {
  return {
    title: "",
    description: "",
    icon: null,
    order: 0,
    isActive: true,
  }
}

function getNextOrder(services: DetailsPoleService[]): number {
  if (services.length === 0) return 0
  const max = Math.max(...services.map((s) => s.order))
  return Number.isFinite(max) ? max + 1 : 0
}

function buildFormFromService(service: DetailsPoleService): DetailsPoleServiceUpsertInput {
  return {
    title: service.title,
    description: service.description,
    icon: service.icon ?? null,
    order: service.order,
    isActive: service.isActive,
  }
}

async function persistService(args: {
  editing: DetailsPoleService | null
  payload: DetailsPoleServiceUpsertInput
  createMutation: ReturnType<typeof useCreatePoleService>
  updateMutation: ReturnType<typeof useUpdatePoleService>
}): Promise<void> {
  const { editing, payload, createMutation, updateMutation } = args

  if (!editing) {
    await createMutation.mutateAsync(payload)
    toast.success("Service créé.", { description: "La carte est maintenant disponible." })
    return
  }

  await updateMutation.mutateAsync({ serviceId: editing.id, payload })
  toast.success("Service mis à jour.", { description: "Les modifications ont été enregistrées." })
}

/**
 * Composant: PoleServicesPanel
 * Rôle: CRUD des services dynamiques d’un pôle (dashboard Bureau).
 */
export function PoleServicesPanel({ poleSlug }: PoleServicesPanelProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editing, setEditing] = useState<DetailsPoleService | null>(null)
  const [editorInitialValue, setEditorInitialValue] = useState<DetailsPoleServiceUpsertInput>(() =>
    buildDefaultForm(),
  )

  const { data, isLoading, error } = usePoleServices(poleSlug)
  const createMutation = useCreatePoleService(poleSlug)
  const updateMutation = useUpdatePoleService(poleSlug)
  const deleteMutation = useDeletePoleService(poleSlug)

  const isSaving = createMutation.isPending || updateMutation.isPending
  const services = useMemo(() => data ?? [], [data])

  const handleOpenCreate = useCallback(() => {
    setEditing(null)
    setEditorInitialValue({ ...buildDefaultForm(), order: getNextOrder(services) })
    setIsEditorOpen(true)
  }, [services])

  const handleOpenEdit = useCallback((service: DetailsPoleService) => {
    setEditing(service)
    setEditorInitialValue(buildFormFromService(service))
    setIsEditorOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (serviceId: string) => {
      try {
        await deleteMutation.mutateAsync(serviceId)
        toast.success("Service supprimé.")
      } catch {
        toast.error("Suppression impossible.", { description: "Réessayez dans un instant." })
      }
    },
    [deleteMutation],
  )

  const handleEditorSubmit = useCallback(
    async (payload: DetailsPoleServiceUpsertInput) => {
      try {
        await persistService({ editing, payload, createMutation, updateMutation })
      } catch (error: unknown) {
        const message =
          error instanceof Error && error.message.trim() !== ""
            ? error.message
            : "Réessayez dans un instant."
        toast.error("Enregistrement impossible.", { description: message })
        throw error
      }
    },
    [createMutation, editing, updateMutation],
  )

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Chargement des services…</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm text-destructive">Impossible de charger les services. Réessayez.</p>
      </Card>
    )
  }

  return (
    <section className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <Card className="rounded-2xl border-border/60 bg-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Cartes services</h2>
            <p className="text-sm text-muted-foreground">
              Ajoutez, réordonnez et activez les services affichés sur la page publique.
            </p>
          </div>

          <PoleServiceEditor
            trigger={
              <Button
                type="button"
                onClick={handleOpenCreate}
                className="h-11 w-full justify-center gap-2 rounded-xl bg-amber-500 text-white shadow-md transition-shadow hover:bg-amber-600 hover:shadow-lg sm:w-auto"
              >
                <IconPlus className="size-4" />
                Ajouter un service
              </Button>
            }
            initialValue={editorInitialValue}
            editing={editing}
            isSaving={isSaving}
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
            onOpen={() => void 0}
            onSubmit={handleEditorSubmit}
          />
        </div>

        {services.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border/70 p-6">
            <p className="text-sm text-muted-foreground">
              Aucun service pour le moment. Ajoutez votre première carte.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((service) => (
              <PoleServiceCard
                key={service.id}
                service={service}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </Card>
    </section>
  )
}


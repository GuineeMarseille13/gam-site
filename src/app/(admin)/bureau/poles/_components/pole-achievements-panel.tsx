"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { IconPlus } from "@tabler/icons-react"

import { resolveBureauPoleAchievementsUi } from "@/config/bureau-pole-achievements-ui"
import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import type { DetailsPoleAchievement } from "../_schemas/details-pole-achievement.schema"
import type { DetailsPoleAchievementUpsertInput } from "../_schemas/details-pole-achievement-form.schema"
import { usePoleAchievements } from "../_hooks/use-pole-achievements"
import {
  useCreatePoleAchievement,
  useDeletePoleAchievement,
  useUpdatePoleAchievement,
} from "../_hooks/use-pole-achievement-mutations"
import { PoleAchievementCard } from "./pole-achievement-card"
import { PoleAchievementEditor } from "./pole-achievement-editor"

interface PoleAchievementsPanelProps {
  poleSlug: EditablePolePublicSlug
}

function buildDefaultForm(): DetailsPoleAchievementUpsertInput {
  return {
    title: "",
    description: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  }
}

function getNextOrder(achievements: DetailsPoleAchievement[]): number {
  if (achievements.length === 0) return 0
  const max = Math.max(...achievements.map((a) => a.order))
  return Number.isFinite(max) ? max + 1 : 0
}

function buildFormFromAchievement(
  achievement: DetailsPoleAchievement,
): DetailsPoleAchievementUpsertInput {
  return {
    title: achievement.title,
    description: achievement.description,
    imageUrl: achievement.imageUrl,
    order: achievement.order,
    isActive: achievement.isActive,
  }
}

/**
 * Composant: PoleAchievementsPanel
 * Rôle: CRUD des cartes « Nos réalisations » d’un pôle (dashboard Bureau).
 */
export function PoleAchievementsPanel({ poleSlug }: PoleAchievementsPanelProps) {
  const ui = useMemo(() => resolveBureauPoleAchievementsUi(poleSlug), [poleSlug])

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editing, setEditing] = useState<DetailsPoleAchievement | null>(null)
  const [editorInitialValue, setEditorInitialValue] =
    useState<DetailsPoleAchievementUpsertInput>(() => buildDefaultForm())

  const { data, isLoading, error } = usePoleAchievements(poleSlug)
  const createMutation = useCreatePoleAchievement(poleSlug)
  const updateMutation = useUpdatePoleAchievement(poleSlug)
  const deleteMutation = useDeletePoleAchievement(poleSlug)

  const isSaving = createMutation.isPending || updateMutation.isPending
  const achievements = useMemo(() => data ?? [], [data])

  const handleOpenCreate = useCallback(() => {
    setEditing(null)
    setEditorInitialValue({ ...buildDefaultForm(), order: getNextOrder(achievements) })
    setIsEditorOpen(true)
  }, [achievements])

  const handleOpenEdit = useCallback((achievement: DetailsPoleAchievement) => {
    setEditing(achievement)
    setEditorInitialValue(buildFormFromAchievement(achievement))
    setIsEditorOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (achievementId: string) => {
      try {
        await deleteMutation.mutateAsync(achievementId)
        toast.success(ui.toasts.deletedTitle)
      } catch {
        toast.error("Suppression impossible.", { description: "Réessayez dans un instant." })
      }
    },
    [deleteMutation, ui.toasts.deletedTitle],
  )

  const handleEditorSubmit = useCallback(
    async (payload: DetailsPoleAchievementUpsertInput) => {
      try {
        if (!editing) {
          await createMutation.mutateAsync(payload)
          toast.success(ui.toasts.createdTitle, {
            description: ui.toasts.createdDescription,
          })
        } else {
          await updateMutation.mutateAsync({ achievementId: editing.id, payload })
          toast.success(ui.toasts.updatedTitle, {
            description: ui.toasts.updatedDescription,
          })
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error && error.message.trim() !== ""
            ? error.message
            : "Réessayez dans un instant."
        toast.error("Enregistrement impossible.", { description: message })
        throw error
      }
    },
    [createMutation, editing, ui.toasts, updateMutation],
  )

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">{ui.panel.loadingMessage}</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm text-destructive">{ui.panel.errorMessage}</p>
      </Card>
    )
  }

  return (
    <section className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <Card className="rounded-2xl border-border/60 bg-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{ui.panel.title}</h2>
            <p className="text-sm text-muted-foreground">{ui.panel.description}</p>
          </div>

          <PoleAchievementEditor
            poleSlug={poleSlug}
            ui={ui.editor}
            trigger={
              <Button
                type="button"
                onClick={handleOpenCreate}
                className="h-11 w-full justify-center gap-2 rounded-xl bg-amber-500 text-white shadow-md transition-shadow hover:bg-amber-600 hover:shadow-lg sm:w-auto"
              >
                <IconPlus className="size-4" />
                {ui.panel.addButton}
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

        {achievements.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border/70 p-6">
            <p className="text-sm text-muted-foreground">{ui.panel.emptyMessage}</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <PoleAchievementCard
                key={achievement.id}
                achievement={achievement}
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

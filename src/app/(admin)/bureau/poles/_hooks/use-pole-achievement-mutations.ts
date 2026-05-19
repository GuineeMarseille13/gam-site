import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import type { DetailsPoleAchievement } from "../_schemas/details-pole-achievement.schema"
import type { DetailsPoleAchievementUpsertInput } from "../_schemas/details-pole-achievement-form.schema"
import { poleAchievementsKeys } from "../_services/pole-achievements-query-keys"
import { createPoleAchievement } from "../_services/create-pole-achievement"
import { updatePoleAchievement } from "../_services/update-pole-achievement"
import { deletePoleAchievement } from "../_services/delete-pole-achievement"

/**
 * Hook: useCreatePoleAchievement
 * Rôle: Créer une réalisation + invalidation.
 */
export function useCreatePoleAchievement(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DetailsPoleAchievementUpsertInput) =>
      createPoleAchievement(poleSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poleAchievementsKeys.byPole(poleSlug) })
    },
  })
}

/**
 * Hook: useUpdatePoleAchievement
 * Rôle: Mettre à jour une réalisation + invalidation.
 */
export function useUpdatePoleAchievement(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: {
      achievementId: string
      payload: DetailsPoleAchievementUpsertInput
    }) => updatePoleAchievement(poleSlug, args.achievementId, args.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poleAchievementsKeys.byPole(poleSlug) })
    },
  })
}

/**
 * Hook: useDeletePoleAchievement
 * Rôle: Supprimer une réalisation + optimistic update.
 */
export function useDeletePoleAchievement(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (achievementId: string) => deletePoleAchievement(poleSlug, achievementId),
    onMutate: async (achievementId: string) => {
      await queryClient.cancelQueries({ queryKey: poleAchievementsKeys.byPole(poleSlug) })
      const previous = queryClient.getQueryData<DetailsPoleAchievement[]>(
        poleAchievementsKeys.byPole(poleSlug),
      )
      queryClient.setQueryData<DetailsPoleAchievement[]>(
        poleAchievementsKeys.byPole(poleSlug),
        (old = []) => old.filter((a) => a.id !== achievementId),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(poleAchievementsKeys.byPole(poleSlug), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: poleAchievementsKeys.byPole(poleSlug) })
    },
  })
}

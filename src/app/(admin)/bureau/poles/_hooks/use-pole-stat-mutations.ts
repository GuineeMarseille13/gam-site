import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import type { DetailsPoleStat } from "../_schemas/details-pole-stat.schema"
import type { DetailsPoleStatUpsertInput } from "../_schemas/details-pole-stat-form.schema"
import { poleStatsKeys } from "../_services/pole-stats-query-keys"
import { createPoleStat } from "../_services/create-pole-stat"
import { updatePoleStat } from "../_services/update-pole-stat"
import { deletePoleStat } from "../_services/delete-pole-stat"

/**
 * Hook: useCreatePoleStat
 * Rôle: Créer une stat + invalidation.
 */
export function useCreatePoleStat(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DetailsPoleStatUpsertInput) =>
      createPoleStat(poleSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poleStatsKeys.byPole(poleSlug) })
    },
  })
}

/**
 * Hook: useUpdatePoleStat
 * Rôle: Mettre à jour une stat + invalidation.
 */
export function useUpdatePoleStat(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: { statId: string; payload: DetailsPoleStatUpsertInput }) =>
      updatePoleStat(poleSlug, args.statId, args.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poleStatsKeys.byPole(poleSlug) })
    },
  })
}

/**
 * Hook: useDeletePoleStat
 * Rôle: Supprimer une stat + optimistic update.
 */
export function useDeletePoleStat(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statId: string) => deletePoleStat(poleSlug, statId),
    onMutate: async (statId: string) => {
      await queryClient.cancelQueries({ queryKey: poleStatsKeys.byPole(poleSlug) })
      const previous = queryClient.getQueryData<DetailsPoleStat[]>(
        poleStatsKeys.byPole(poleSlug),
      )
      queryClient.setQueryData<DetailsPoleStat[]>(
        poleStatsKeys.byPole(poleSlug),
        (old = []) => old.filter((s) => s.id !== statId),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(poleStatsKeys.byPole(poleSlug), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: poleStatsKeys.byPole(poleSlug) })
    },
  })
}


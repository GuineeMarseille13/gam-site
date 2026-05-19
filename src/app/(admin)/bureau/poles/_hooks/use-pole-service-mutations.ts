import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

import type { DetailsPoleService } from "../_schemas/details-pole-service.schema"
import type { DetailsPoleServiceUpsertInput } from "../_schemas/details-pole-service-form.schema"
import { poleServicesKeys } from "../_services/pole-services-query-keys"
import { createPoleService } from "../_services/create-pole-service"
import { updatePoleService } from "../_services/update-pole-service"
import { deletePoleService } from "../_services/delete-pole-service"

/**
 * Hook: useCreatePoleService
 * Rôle: Créer un service + invalidation.
 */
export function useCreatePoleService(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DetailsPoleServiceUpsertInput) =>
      createPoleService(poleSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poleServicesKeys.byPole(poleSlug) })
    },
  })
}

/**
 * Hook: useUpdatePoleService
 * Rôle: Mettre à jour un service + invalidation.
 */
export function useUpdatePoleService(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (args: { serviceId: string; payload: DetailsPoleServiceUpsertInput }) =>
      updatePoleService(poleSlug, args.serviceId, args.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poleServicesKeys.byPole(poleSlug) })
    },
  })
}

/**
 * Hook: useDeletePoleService
 * Rôle: Supprimer un service + optimistic update.
 */
export function useDeletePoleService(poleSlug: EditablePolePublicSlug) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceId: string) => deletePoleService(poleSlug, serviceId),
    onMutate: async (serviceId: string) => {
      await queryClient.cancelQueries({ queryKey: poleServicesKeys.byPole(poleSlug) })
      const previous = queryClient.getQueryData<DetailsPoleService[]>(
        poleServicesKeys.byPole(poleSlug),
      )
      queryClient.setQueryData<DetailsPoleService[]>(
        poleServicesKeys.byPole(poleSlug),
        (old = []) => old.filter((s) => s.id !== serviceId),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(poleServicesKeys.byPole(poleSlug), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: poleServicesKeys.byPole(poleSlug) })
    },
  })
}


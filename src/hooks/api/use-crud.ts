/**
 * Hook générique CRUD pour toutes les ressources
 * Utilise React Query pour la gestion du cache et des états
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiDelete, apiGetPaginated, type ApiOptions, type PaginatedResult } from '@/lib/api/client'

/**
 * Options pour le hook CRUD
 */
export interface UseCrudOptions<T> {
  endpoint: string
  queryKey: (string | number | boolean | null | undefined)[]
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}

/**
 * Hook générique pour les opérations CRUD
 */
export function useCrud<T = any>(options: UseCrudOptions<T>) {
  const { endpoint, queryKey, enabled = true, staleTime = 5 * 60 * 1000, gcTime = 10 * 60 * 1000 } = options

  // GET - Récupérer tous les enregistrements
  const useGetAll = (apiOptions?: ApiOptions, queryOptions?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery<T[], Error>({
      queryKey: [...queryKey, 'all', apiOptions],
      queryFn: () => apiGet<T[]>(endpoint, apiOptions),
      enabled,
      staleTime,
      gcTime,
      ...queryOptions,
    })
  }

  // GET - Récupérer un enregistrement par ID
  const useGetById = (
    id: string | null | undefined,
    apiOptions?: Omit<ApiOptions, 'id'>,
    queryOptions?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<T, Error>({
      queryKey: [...queryKey, 'byId', id, apiOptions],
      queryFn: () => apiGet<T>(endpoint, { ...apiOptions, id: id! }),
      enabled: enabled && !!id,
      staleTime,
      gcTime,
      ...queryOptions,
    })
  }

  // GET - Récupérer avec pagination
  const useGetPaginated = (
    page: number = 1,
    limit: number = 10,
    apiOptions?: Omit<ApiOptions, 'page' | 'limit'>,
    queryOptions?: Omit<UseQueryOptions<PaginatedResult<T>, Error>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<PaginatedResult<T>, Error>({
      queryKey: [...queryKey, 'paginated', page, limit, apiOptions],
      queryFn: () => apiGetPaginated<T>(endpoint, page, limit, apiOptions),
      enabled,
      staleTime,
      gcTime,
      ...queryOptions,
    })
  }

  // POST - Créer
  const useCreate = (mutationOptions?: Omit<UseMutationOptions<T, Error, any>, 'mutationFn'>) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: any) => apiPost<T>(endpoint, data),
      onSuccess: (data, variables, context) => {
        // Invalider les queries pour rafraîchir les données
        queryClient.invalidateQueries({ queryKey })
        //mutationOptions?.onSuccess?.(data, variables, undefined, context)
      },
      ...mutationOptions,
    })
  }

  // PUT - Mettre à jour
  const useUpdate = (mutationOptions?: Omit<UseMutationOptions<T, Error, { id: string; data: Partial<any> }>, 'mutationFn'>) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => apiPut<T>(endpoint, id, data),
      onSuccess: (data, variables, context) => {
        // Invalider les queries et mettre à jour le cache
        queryClient.invalidateQueries({ queryKey })
        queryClient.setQueryData([...queryKey, 'byId', variables.id], data)
        //mutationOptions?.onSuccess?.(data, variables, context)
      },
      ...mutationOptions,
    })
  }

  // DELETE - Supprimer
  const useDelete = (mutationOptions?: Omit<UseMutationOptions<T, Error, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => apiDelete<T>(endpoint, id),
      onSuccess: (data, variables, context) => {
        // Invalider les queries et supprimer du cache
        queryClient.invalidateQueries({ queryKey })
        queryClient.removeQueries({ queryKey: [...queryKey, 'byId', variables] })
        //mutationOptions?.onSuccess?.(data, variables, context)
      },
      ...mutationOptions,
    })
  }

  return {
    useGetAll,
    useGetById,
    useGetPaginated,
    useCreate,
    useUpdate,
    useDelete,
  }
}
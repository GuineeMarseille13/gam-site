/**
 * Fabrique de hooks CRUD (ce n’est pas un hook React : ne pas préfixer `use`).
 * Retourne des fonctions `useGetAll`, etc. qui appellent useQuery/useMutation à l’usage.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiDelete, apiGetPaginated, type ApiOptions, type PaginatedResult } from '@/lib/api/client'

/**
 * Options pour le hook CRUD
 */
export interface UseCrudOptions {
  endpoint: string
  queryKey: (string | number | boolean | null | undefined)[]
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}

/**
 * Crée un jeu de hooks CRUD pour un endpoint donné.
 */
export function createCrudResources<T = unknown>(options: UseCrudOptions) {
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
  const useCreate = (mutationOptions?: Omit<UseMutationOptions<T, Error, unknown>, 'mutationFn'>) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: unknown) => apiPost<T>(endpoint, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey })
      },
      ...mutationOptions,
    })
  }

  // PUT - Mettre à jour
  const useUpdate = (mutationOptions?: Omit<UseMutationOptions<T, Error, { id: string; data: Partial<T> }>, 'mutationFn'>) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => apiPut<T>(endpoint, id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey })
        queryClient.setQueryData([...queryKey, 'byId', variables.id], data)
      },
      ...mutationOptions,
    })
  }

  // DELETE - Supprimer
  const useDelete = (mutationOptions?: Omit<UseMutationOptions<T, Error, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => apiDelete<T>(endpoint, id),
      onSuccess: (_result, variables) => {
        queryClient.invalidateQueries({ queryKey })
        queryClient.removeQueries({ queryKey: [...queryKey, 'byId', variables] })
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
/**
 * Client API réutilisable pour toutes les routes
 * Fournit des fonctions fetch typées et optimisées
 */

const API_BASE_URL = '/api'

/**
 * Options pour les requêtes API
 */
export interface ApiOptions {
  id?: string
  params?: Record<string, string | number | boolean | null | undefined>
  include?: Record<string, boolean>
  select?: Record<string, boolean>
  where?: Record<string, any>
  orderBy?: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>
  page?: number
  limit?: number
  take?: number
  skip?: number
}

/**
 * Construit l'URL avec les paramètres de requête
 */
function buildUrl(endpoint: string, options?: ApiOptions): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin)
  
  if (options) {
    if (options.id) {
      url.searchParams.set('id', String(options.id))
    }
    
    if (options.include) {
      url.searchParams.set('include', JSON.stringify(options.include))
    }
    
    if (options.select) {
      url.searchParams.set('select', JSON.stringify(options.select))
    }
    
    if (options.where) {
      url.searchParams.set('where', JSON.stringify(options.where))
    }
    
    if (options.orderBy) {
      url.searchParams.set('orderBy', JSON.stringify(options.orderBy))
    }
    
    if (options.page && options.limit) {
      url.searchParams.set('page', String(options.page))
      url.searchParams.set('limit', String(options.limit))
    }
    
    if (options.take) {
      url.searchParams.set('take', String(options.take))
    }
    
    if (options.skip) {
      url.searchParams.set('skip', String(options.skip))
    }
    
    // Paramètres personnalisés
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      })
    }
  }
  
  return url.toString()
}

/**
 * Gère les erreurs de l'API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

/**
 * GET - Récupérer des données
 */
export async function apiGet<T>(endpoint: string, options?: ApiOptions): Promise<T> {
  const url = buildUrl(endpoint, options)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return handleResponse<T>(response)
}

/**
 * POST - Créer une ressource
 */
export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const url = buildUrl(endpoint)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return handleResponse<T>(response)
}

/**
 * PUT - Mettre à jour une ressource
 */
export async function apiPut<T>(endpoint: string, id: string, data: Partial<any>): Promise<T> {
  const url = buildUrl(endpoint, { id })
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return handleResponse<T>(response)
}

/**
 * DELETE - Supprimer une ressource
 */
export async function apiDelete<T>(endpoint: string, id: string): Promise<T> {
  const url = buildUrl(endpoint, { id })
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return handleResponse<T>(response)
}

/**
 * Résultat paginé
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * GET avec pagination
 */
export async function apiGetPaginated<T>(
  endpoint: string,
  page: number = 1,
  limit: number = 10,
  options?: Omit<ApiOptions, 'page' | 'limit'>
): Promise<PaginatedResult<T>> {
  return apiGet<PaginatedResult<T>>(endpoint, {
    ...options,
    page,
    limit,
  })
}


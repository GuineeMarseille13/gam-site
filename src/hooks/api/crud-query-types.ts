import type { ApiOptions } from '@/lib/api/client'

/** Options de liste / détail alignées sur `ApiOptions` (sans `id`). */
export type CrudQueryOptions = Omit<ApiOptions, 'id'>

/**
 * Export centralisé de tous les hooks API
 * Permet d'importer facilement tous les hooks depuis un seul endroit
 */

// Hooks génériques
export { createCrudResources } from './use-crud'
export type { UseCrudOptions } from './use-crud'

// Hooks spécifiques
export * from './use-products'
export * from './use-events'
export * from './use-reviews'
export * from './use-poles'
export * from './use-orders'
export * from './use-achievements'
export * from './use-persons'
export * from './use-images'
export * from './use-videos'
export * from './use-partners'
export * from './use-volunteers'
export * from './use-team-members'
export * from './use-memberships'
export * from './use-donations'
export * from './use-social-medias'
export * from './use-report-activities'
export * from './use-about-us'
export * from './use-contacts'
export * from './use-addresses'
export * from './use-sections'
export * from './use-reasons'
export * from './use-pole-details'

// Client API
export * from '@/lib/api/client'
export type { ApiOptions, PaginatedResult } from '@/lib/api/client'


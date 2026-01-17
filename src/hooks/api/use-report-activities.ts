/**
 * Hooks spécifiques pour les rapports d'activité
 */

import { useCrud } from './use-crud'
import type { ReportActivity } from '@/lib/generated/prisma/client'

const reportActivitiesCrud = useCrud<ReportActivity>({
  endpoint: '/report-activities',
  queryKey: ['reportActivities'],
})

/**
 * Récupérer tous les rapports d'activité
 */
export function useReportActivities(options?: { where?: any; include?: any; orderBy?: any }) {
  return reportActivitiesCrud.useGetAll(options)
}

/**
 * Récupérer un rapport d'activité par ID
 */
export function useReportActivity(id: string | null | undefined, options?: { include?: any }) {
  return reportActivitiesCrud.useGetById(id, options)
}

/**
 * Récupérer les rapports d'activité avec pagination
 */
export function useReportActivitiesPaginated(
  page: number = 1,
  limit: number = 10,
  options?: { where?: any; orderBy?: any }
) {
  return reportActivitiesCrud.useGetPaginated(page, limit, options)
}

/**
 * Récupérer les rapports d'activité triés par année (décroissant)
 */
export function useReportActivitiesByYear() {
  return reportActivitiesCrud.useGetAll({
    orderBy: {
      year: 'desc',
    },
    include: {
      reportActivitySection: true,
    },
  })
}

/**
 * Récupérer un rapport d'activité par année
 */
export function useReportActivityByYear(year: number) {
  return reportActivitiesCrud.useGetAll({
    where: { year },
    include: {
      reportActivitySection: true,
    },
  })
}

/**
 * Créer un rapport d'activité
 */
export function useCreateReportActivity() {
  return reportActivitiesCrud.useCreate()
}

/**
 * Mettre à jour un rapport d'activité
 */
export function useUpdateReportActivity() {
  return reportActivitiesCrud.useUpdate()
}

/**
 * Supprimer un rapport d'activité
 */
export function useDeleteReportActivity() {
  return reportActivitiesCrud.useDelete()
}


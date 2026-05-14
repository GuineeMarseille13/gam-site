/**
 * API Routes pour les rapports d'activité
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createReportActivitySchema = z.object({
  label: z.string().optional().nullable(),
  year: z.number().int().min(2000).max(2100),
  pdfUrl: z.string().url('Invalid URL').min(1, 'PDF URL is required'),
  reportActivitySectionId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
})

const updateReportActivitySchema = createReportActivitySchema.partial()

const handlers = createCrudHandler({
  modelName: 'ReportActivity',
  validateCreate: (data) => createReportActivitySchema.parse(data),
  validateUpdate: (data) => updateReportActivitySchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE


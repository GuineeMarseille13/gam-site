/**
 * API Routes pour les sections de rapports d'activité
 */
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createReportActivitySectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
})

const updateReportActivitySectionSchema = createReportActivitySectionSchema.partial()

const handlers = createCrudHandler({
  modelName: 'ReportActivitySection',
  validateCreate: (data) => createReportActivitySectionSchema.parse(data),
  validateUpdate: (data) => updateReportActivitySectionSchema.parse(data),
})

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE


import { z } from "zod"

export const createBeneficiaryDocumentTypeSchema = z
  .object({
    label: z.string().min(2, "Au moins 2 caractères.").max(200).transform((s) => s.trim()),
    sortOrder: z.number().int().min(0).max(9999).optional(),
    requiresOtherDetail: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

export const updateBeneficiaryDocumentTypeSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(2, "Au moins 2 caractères.").max(200).transform((s) => s.trim()),
    sortOrder: z.number().int().min(0).max(9999),
    requiresOtherDetail: z.boolean(),
    isActive: z.boolean(),
  })
  .strict()

export const deleteBeneficiaryDocumentTypeSchema = z
  .object({
    id: z.string().min(1),
  })
  .strict()

export const beneficiaryDocumentTypeRowSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    label: z.string(),
    sortOrder: z.number(),
    requiresOtherDetail: z.boolean(),
    isActive: z.boolean(),
    usageCount: z.number().int().min(0),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict()

export type BeneficiaryDocumentTypeRow = z.infer<typeof beneficiaryDocumentTypeRowSchema>

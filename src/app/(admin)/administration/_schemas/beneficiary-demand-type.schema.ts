import { z } from "zod"

export const createBeneficiaryDemandTypeSchema = z
  .object({
    label: z.string().min(2, "Au moins 2 caractères.").max(120).transform((s) => s.trim()),
    sortOrder: z.number().int().min(0).max(9999).optional(),
    requiresDetail: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

export const updateBeneficiaryDemandTypeSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(2, "Au moins 2 caractères.").max(120).transform((s) => s.trim()),
    sortOrder: z.number().int().min(0).max(9999),
    requiresDetail: z.boolean(),
    isActive: z.boolean(),
  })
  .strict()

export const deleteBeneficiaryDemandTypeSchema = z
  .object({
    id: z.string().min(1),
  })
  .strict()

export const beneficiaryDemandTypeRowSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    sortOrder: z.number(),
    requiresDetail: z.boolean(),
    isActive: z.boolean(),
    usageCount: z.number().int().min(0),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict()

export type BeneficiaryDemandTypeRow = z.infer<typeof beneficiaryDemandTypeRowSchema>

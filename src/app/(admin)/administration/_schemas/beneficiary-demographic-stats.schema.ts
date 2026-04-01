import { z } from "zod"

export const beneficiaryDemographicCountsSchema = z
  .object({
    minor: z.number().int().min(0),
    adultAccompanied: z.number().int().min(0),
    unknownAge: z.number().int().min(0),
  })
  .strict()

export type BeneficiaryDemographicCountsValidated = z.infer<typeof beneficiaryDemographicCountsSchema>

export const beneficiaryDemographicByMonthRowSchema = z
  .object({
    monthKey: z.string().regex(/^\d{4}-\d{2}$/),
    monthLabel: z.string().min(1),
    minor: z.number().int().min(0),
    adultAccompanied: z.number().int().min(0),
    unknownAge: z.number().int().min(0),
    total: z.number().int().min(0),
  })
  .strict()

export type BeneficiaryDemographicByMonthRow = z.infer<typeof beneficiaryDemographicByMonthRowSchema>

export const beneficiaryDemographicByPermanenceRowSchema = z
  .object({
    permanenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    minor: z.number().int().min(0),
    adultAccompanied: z.number().int().min(0),
    unknownAge: z.number().int().min(0),
    total: z.number().int().min(0),
  })
  .strict()

export type BeneficiaryDemographicByPermanenceRow = z.infer<
  typeof beneficiaryDemographicByPermanenceRowSchema
>

export const beneficiaryDemographicStatsPayloadSchema = z
  .object({
    year: z.number().int().min(2020),
    yearTotals: beneficiaryDemographicCountsSchema,
    byMonth: z.array(beneficiaryDemographicByMonthRowSchema),
    byPermanence: z.array(beneficiaryDemographicByPermanenceRowSchema),
  })
  .strict()

export type BeneficiaryDemographicStatsPayload = z.infer<typeof beneficiaryDemographicStatsPayloadSchema>

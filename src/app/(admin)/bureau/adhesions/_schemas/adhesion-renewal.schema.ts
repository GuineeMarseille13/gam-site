import { z } from "zod"

export const adhesionRenewalPayloadSchema = z
  .object({
    memberShipId: z.string().min(1),
  })
  .strict()

export type AdhesionRenewalPayload = z.infer<typeof adhesionRenewalPayloadSchema>


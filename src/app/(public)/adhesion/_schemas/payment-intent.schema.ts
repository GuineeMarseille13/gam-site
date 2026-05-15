import { z } from "zod";

export const paymentIntentResponseSchema = z
  .object({
    clientSecret: z.string().nullable().optional(),
    paymentIntentId: z.string().nullable().optional(),
    /** Présent sur les réponses bureau / renouvellement. */
    membershipYear: z.number().int().optional(),
  })
  .strict();

export type PaymentIntentResponse = z.infer<typeof paymentIntentResponseSchema>;


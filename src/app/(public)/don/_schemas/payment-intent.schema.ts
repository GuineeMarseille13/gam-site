import { z } from "zod";

export const paymentIntentResponseSchema = z
  .object({
    clientSecret: z.string().nullable().optional(),
    paymentIntentId: z.string().nullable().optional(),
  })
  .strict();

export type PaymentIntentResponse = z.infer<typeof paymentIntentResponseSchema>;


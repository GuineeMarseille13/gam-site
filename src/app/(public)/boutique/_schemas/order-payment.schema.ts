import { z } from "zod";

import { cartItemSchema, checkoutDataSchema } from "./product.schema";

export const orderPaymentPayloadSchema = z
  .object({
    items: z.array(cartItemSchema).min(1),
    customer: checkoutDataSchema,
  })
  .strict();

export type OrderPaymentPayload = z.infer<typeof orderPaymentPayloadSchema>;

export const orderPaymentResponseSchema = z
  .object({
    clientSecret: z.string().nullable().optional(),
    paymentIntentId: z.string().nullable().optional(),
  })
  .strict();

export type OrderPaymentResponse = z.infer<typeof orderPaymentResponseSchema>;


import { z } from "zod";

/**
 * Lignes de panier stockées dans les métadonnées Stripe (léger, sans prix client).
 */
export const orderCartCompactLineSchema = z
  .object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
  })
  .strict();

export const orderCartCompactSchema = z
  .array(orderCartCompactLineSchema)
  .min(1)
  .max(40);

export type OrderCartCompactLine = z.infer<typeof orderCartCompactLineSchema>;

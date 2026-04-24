import { z } from "zod";

const productRecordSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    price: z.number().int().nonnegative(),
    stock: z.number().int().nonnegative().nullable().optional(),
    imageId: z.string().nullable().optional(),
    discountPercent: z.number().int().min(0).max(100).nullable().optional(),
    discountActive: z.boolean().nullable().optional(),
    isActive: z.boolean().nullable().optional(),
  })
  .strict();

export type ProductRecord = z.infer<typeof productRecordSchema>;

export const productsApiResponseSchema = z
  .object({
    success: z.boolean(),
    data: z.array(productRecordSchema).optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  })
  .strict();


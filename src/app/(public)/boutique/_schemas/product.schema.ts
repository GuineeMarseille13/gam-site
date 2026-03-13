import { z } from "zod";

/**
 * Product schema used for in-app catalog display.
 */
export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  image: z.string().url().or(z.string().min(1)),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().optional(),
  discount: z.number().min(0).max(100).optional(),
});

export type Product = z.infer<typeof productSchema>;

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().min(1).max(99),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutDataSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phone: z.string().min(6).max(20).optional(),
  email: z
    .string()
    .email("Email invalide")
    .optional(),
});

export type CheckoutData = z.infer<typeof checkoutDataSchema>;



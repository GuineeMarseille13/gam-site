import { z } from "zod"

/** Champs formulaire bureau (FormData → validation). */
export const productCategoryFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Le titre est obligatoire")
      .max(120, "Le titre ne peut pas dépasser 120 caractères"),
    description: z
      .string()
      .trim()
      .max(500, "La description ne peut pas dépasser 500 caractères")
      .optional()
      .transform((value) => (value === "" || value === undefined ? null : value)),
  })
  .strict()

export type ProductCategoryFormFields = z.infer<typeof productCategoryFormSchema>

export function parseProductCategoryFormFields(formData: FormData) {
  return productCategoryFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  })
}

export function formatProductCategoryFormError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Données invalides"
}

import { z } from "zod"

const optionalEmailSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value.toLowerCase()))
  .pipe(
    z.union([z.null(), z.string().email("Adresse email invalide.")]),
  )

export const benevoleFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis."),
    lastName: z.string().trim().min(1, "Le nom est requis."),
    phone: z.string().trim().min(1, "Le téléphone est requis."),
    email: optionalEmailSchema,
    showOnSite: z.boolean(),
    address: z.string().trim(),
    zipCode: z.string().trim(),
    city: z.string().trim(),
    country: z.string().trim().min(1, "Le pays est requis."),
  })
  .strict()
  .superRefine((data, ctx) => {
    const hasPartialAddress = !!(data.address || data.zipCode || data.city)
    const hasCompleteAddress = !!(data.address && data.zipCode && data.city)

    if (hasPartialAddress && !hasCompleteAddress) {
      ctx.addIssue({
        code: "custom",
        message: "Pour enregistrer l'adresse, renseignez la rue, le code postal et la ville.",
        path: ["address"],
      })
    }
  })

export type BenevoleFormInput = z.infer<typeof benevoleFormSchema>

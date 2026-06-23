import { z } from "zod"

import { associationRichTextSchema } from "./rich-text-content.schema"

export const savePresidentContentSchema = z
  .object({
    message: associationRichTextSchema({
      min: 10,
      max: 12_000,
      minMessage: "Le message doit contenir au moins 10 caractères.",
      maxMessage: "Le message ne peut pas dépasser 12 000 caractères.",
    }),
    imageId: z.string().optional(),
  })
  .strict()

export const saveWhoWeAreContentSchema = z
  .object({
    title: z.string().min(2, "Le titre est requis."),
    text: associationRichTextSchema({
      min: 10,
      max: 12_000,
      minMessage: "Le texte doit contenir au moins 10 caractères.",
      maxMessage: "Le texte ne peut pas dépasser 12 000 caractères.",
    }),
    imageId: z.string().optional(),
  })
  .strict()

export const saveWhatWeOfferContentSchema = z
  .object({
    title: z.string().min(2, "Le titre est requis."),
    intro: z
      .string()
      .min(10, "L'introduction doit contenir au moins 10 caractères.")
      .max(4_000, "L'introduction ne peut pas dépasser 4 000 caractères."),
    items: z
      .array(z.string().min(3, "Chaque axe doit contenir au moins 3 caractères."))
      .min(1, "Ajoutez au moins un axe majeur.")
      .max(12, "Maximum 12 axes majeurs."),
    conclusion: z
      .string()
      .min(10, "La conclusion doit contenir au moins 10 caractères.")
      .max(4_000, "La conclusion ne peut pas dépasser 4 000 caractères."),
    imageId: z.string().optional(),
  })
  .strict()

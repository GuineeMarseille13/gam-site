import { z } from "zod"

import { associationRichTextSchema } from "./rich-text-content.schema"

export const ASSOCIATION_CONTENT_KEYS = {
  president: "president",
  whoWeAre: "who_we_are",
  whatWeOffer: "what_we_offer",
} as const

export type AssociationContentKey =
  (typeof ASSOCIATION_CONTENT_KEYS)[keyof typeof ASSOCIATION_CONTENT_KEYS]

const associationContentKeySchema = z.enum([
  ASSOCIATION_CONTENT_KEYS.president,
  ASSOCIATION_CONTENT_KEYS.whoWeAre,
  ASSOCIATION_CONTENT_KEYS.whatWeOffer,
])

export const associationContentRowSchema = z
  .object({
    id: z.string().min(1),
    key: associationContentKeySchema,
    title: z.string().nullable(),
    body: z.string().nullable(),
    imageId: z.string().nullable(),
    intro: z.string().nullable(),
    items: z.array(z.string().min(1)).nullable(),
    conclusion: z.string().nullable(),
  })
  .strict()

export type AssociationContentRow = z.infer<typeof associationContentRowSchema>

export const presidentPublicSchema = z
  .object({
    president: z
      .object({
        name: z.string().min(1),
        role: z.string().min(1),
        image: z.string(),
      })
      .strict(),
    message: z
      .object({
        content: z.string().min(1),
      })
      .strict(),
  })
  .strict()

export type PresidentPublicData = z.infer<typeof presidentPublicSchema>

export const aboutUsSectionPublicSchema = z
  .object({
    title: z.string().min(1),
    text: z.string().min(1),
    image: z.string(),
  })
  .strict()

export const whatWeOfferPublicSchema = z
  .object({
    title: z.string().min(1),
    intro: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
    conclusion: z.string().min(1),
    image: z.string(),
  })
  .strict()

export const aboutUsPublicSchema = z
  .object({
    whoWeAre: aboutUsSectionPublicSchema,
    whatWeOffer: whatWeOfferPublicSchema,
  })
  .strict()

export type AboutUsPublicData = z.infer<typeof aboutUsPublicSchema>

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

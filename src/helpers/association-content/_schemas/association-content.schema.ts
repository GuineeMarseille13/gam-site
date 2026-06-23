import { z } from "zod"

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

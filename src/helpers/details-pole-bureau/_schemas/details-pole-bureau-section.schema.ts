import { z } from "zod"

import { BUREAU_POLE_CONTENT_SLUGS } from "@/config/bureau-poles-content"
import { MISE_EN_RELATION_POLE_SLUG } from "@/config/pole-public-slugs"

export const bureauPoleContentSlugSchema = z.enum(BUREAU_POLE_CONTENT_SLUGS)

const EDITABLE_POLE_PUBLIC_SLUGS = [
  ...BUREAU_POLE_CONTENT_SLUGS,
  MISE_EN_RELATION_POLE_SLUG,
] as const

export const editablePolePublicSlugSchema = z.enum(EDITABLE_POLE_PUBLIC_SLUGS)

export type EditablePolePublicSlug = z.infer<typeof editablePolePublicSlugSchema>

export const bureauPoleDetailsSectionSchema = z.enum([
  "about",
  "achievements",
])

export type BureauPoleDetailsSection = z.infer<
  typeof bureauPoleDetailsSectionSchema
>

/** Limite alignée validation Zod / action serveur. */
export const DETAILS_POLE_BUREAU_SECTION_MAX_CHARS = 12_000

const sectionTextField = z
  .string()
  .max(
    DETAILS_POLE_BUREAU_SECTION_MAX_CHARS,
    "Le texte ne peut pas dépasser 12 000 caractères.",
  )

export const saveDetailsPoleBureauSectionFormSchema = z
  .object({
    poleSlug: editablePolePublicSlugSchema,
    section: bureauPoleDetailsSectionSchema,
    sectionText: sectionTextField,
  })
  .strict()
  .transform(({ poleSlug, section, sectionText }) => {
    const t = sectionText.trim()
    return {
      poleSlug,
      section,
      sectionText: t === "" ? null : t,
    }
  })

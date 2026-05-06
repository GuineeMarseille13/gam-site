import { z } from "zod"

import { BUREAU_POLE_CONTENT_SLUGS } from "@/config/bureau-poles-content"

export const bureauPoleContentSlugSchema = z.enum(BUREAU_POLE_CONTENT_SLUGS)

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
    poleSlug: bureauPoleContentSlugSchema,
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

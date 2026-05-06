import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"

import type { BureauPoleDetailsSection } from "./_schemas/details-pole-bureau-section.schema"

function isMissingColumn(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2022"
  )
}

export interface DetailsPoleBureauContentDto {
  aboutSectionText: string | null
  achievementsSectionText: string | null
}

const emptyDto: DetailsPoleBureauContentDto = {
  aboutSectionText: null,
  achievementsSectionText: null,
}

/**
 * Lit les champs `DetailsPole` éditables depuis le bureau pour un slug public (`poles.ts`).
 */
export async function getDetailsPoleBureauContentByPublicSlug(
  publicSlug: string,
): Promise<DetailsPoleBureauContentDto | null> {
  try {
    const pole = await findPoleBySlugOrId(publicSlug)
    if (!pole?.detailsPoleId) {
      return null
    }

    const row = await prisma.detailsPole.findUnique({
      where: { id: pole.detailsPoleId },
      select: {
        aboutSectionText: true,
        achievementsSectionText: true,
      },
    })

    if (!row) {
      return null
    }

    return {
      aboutSectionText: normalizeText(row.aboutSectionText),
      achievementsSectionText: normalizeText(row.achievementsSectionText),
    }
  } catch (error) {
    if (isMissingColumn(error)) {
      return emptyDto
    }
    throw error
  }
}

/**
 * Valeur affichée pour une section (chaîne vide → null).
 */
export function getDetailsPoleSectionStored(
  dto: DetailsPoleBureauContentDto | null,
  section: BureauPoleDetailsSection,
): string | null {
  if (!dto) {
    return null
  }
  const key = sectionToKey(section)
  return dto[key]
}

function sectionToKey(
  section: BureauPoleDetailsSection,
): keyof DetailsPoleBureauContentDto {
  const map = {
    about: "aboutSectionText",
    achievements: "achievementsSectionText",
  } as const satisfies Record<
    BureauPoleDetailsSection,
    keyof DetailsPoleBureauContentDto
  >
  return map[section]
}

function normalizeText(value: string | null | undefined): string | null {
  const t = value?.trim()
  return t && t !== "" ? t : null
}

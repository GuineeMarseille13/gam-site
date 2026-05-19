import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/slugify"

import { poleWhereByPublicSlugFallback } from "./pole-slug-resolution"

/**
 * Résout un paramètre d’URL `[slug]` vers un `Pôle` :
 * `public_slug`, id CUID, nom exact, motifs connus (pôles bureau), ou slug dérivé du nom.
 */
export async function findPoleBySlugOrId(slug: string) {
  const normalizedSlug = slug.trim()
  if (!normalizedSlug) {
    return null
  }

  const byPublicSlug = await prisma.pole.findUnique({
    where: { publicSlug: normalizedSlug },
  })
  if (byPublicSlug) {
    return byPublicSlug
  }

  const byIdOrExactName = await prisma.pole.findFirst({
    where: {
      OR: [
        { id: normalizedSlug },
        { name: { equals: normalizedSlug, mode: "insensitive" } },
      ],
    },
  })
  if (byIdOrExactName) {
    return byIdOrExactName
  }

  const fallbackWhere = poleWhereByPublicSlugFallback(normalizedSlug)
  if (fallbackWhere) {
    const byKnownPolePattern = await prisma.pole.findFirst({
      where: fallbackWhere,
      orderBy: { createdAt: "asc" },
    })
    if (byKnownPolePattern) {
      return byKnownPolePattern
    }
  }

  const poles = await prisma.pole.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imageId: true,
      poleSectionId: true,
      detailsPoleId: true,
      publicSlug: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return (
    poles.find((pole) => slugify(pole.name) === normalizedSlug) ?? null
  )
}

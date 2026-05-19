import { prisma } from "@/lib/prisma"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

import {
  detailsPoleAchievementPublicListSchema,
  type DetailsPoleAchievementPublic,
} from "./_schemas/details-pole-achievement-public.schema"

function resolveAchievementImageUrl(imageUrl: string): string {
  const trimmed = imageUrl.trim()
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed
  }
  return cloudinaryImageUrl(trimmed, "w_1200,h_900,c_fill,q_auto,f_auto")
}

/**
 * Charge les réalisations dynamiques actives pour un slug public de pôle.
 * Retourne `null` si pôle introuvable ou sans fiche détail.
 */
export async function getActivePoleAchievementsByPublicSlug(
  publicSlug: string,
): Promise<DetailsPoleAchievementPublic[] | null> {
  const pole = await findPoleBySlugOrId(publicSlug)
  if (!pole?.detailsPoleId) {
    return null
  }

  const rows = await prisma.detailsPoleAchievement.findMany({
    where: { detailsPoleId: pole.detailsPoleId, isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      title: true,
      description: true,
      imageUrl: true,
    },
  })

  const payload: unknown = rows.map((r) => ({
    url: resolveAchievementImageUrl(r.imageUrl),
    title: r.title,
    description: r.description,
  }))

  return detailsPoleAchievementPublicListSchema.parse(payload)
}

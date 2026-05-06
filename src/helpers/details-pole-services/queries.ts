import { prisma } from "@/lib/prisma"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"

import {
  detailsPoleServicePublicListSchema,
  type DetailsPoleServicePublic,
} from "./_schemas/details-pole-service-public.schema"

/**
 * Charge les services dynamiques actifs pour un slug public de pôle.
 * Retourne `null` si pôle introuvable ou sans fiche détail.
 */
export async function getActivePoleServicesByPublicSlug(
  publicSlug: string,
): Promise<DetailsPoleServicePublic[] | null> {
  const pole = await findPoleBySlugOrId(publicSlug)
  if (!pole?.detailsPoleId) {
    return null
  }

  const rows = await prisma.detailsPoleService.findMany({
    where: { detailsPoleId: pole.detailsPoleId, isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      title: true,
      description: true,
      icon: true,
    },
  })

  const payload: unknown = rows.map((r) => ({
    title: r.title,
    description: r.description,
    icon: r.icon?.trim() ? r.icon.trim() : "🧩",
  }))

  return detailsPoleServicePublicListSchema.parse(payload)
}


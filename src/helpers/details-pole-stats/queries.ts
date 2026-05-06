import { prisma } from "@/lib/prisma"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"

import {
  detailsPoleStatPublicListSchema,
  type DetailsPoleStatPublic,
} from "./_schemas/details-pole-stat-public.schema"

function buildDescription(helperText: string | null, unit: string | null): string | undefined {
  const parts = [helperText?.trim(), unit?.trim()].filter(
    (v): v is string => !!v && v !== "",
  )
  return parts.length > 0 ? parts.join(" · ") : undefined
}

/**
 * Charge les stats dynamiques actives pour un slug public de pôle.
 * Retourne `null` si pôle introuvable ou sans fiche détail.
 */
export async function getActivePoleStatsByPublicSlug(
  publicSlug: string,
): Promise<DetailsPoleStatPublic[] | null> {
  const pole = await findPoleBySlugOrId(publicSlug)
  if (!pole?.detailsPoleId) {
    return null
  }

  const rows = await prisma.detailsPoleStat.findMany({
    where: { detailsPoleId: pole.detailsPoleId, isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      value: true,
      label: true,
      helperText: true,
      unit: true,
    },
  })

  const payload: unknown = rows.map((r) => ({
    value: r.value,
    label: r.label,
    description: buildDescription(r.helperText, r.unit),
  }))

  return detailsPoleStatPublicListSchema.parse(payload)
}


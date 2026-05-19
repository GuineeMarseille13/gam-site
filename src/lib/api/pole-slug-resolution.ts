import type { Prisma } from "@/lib/generated/prisma/client"

import { BUREAU_POLE_CONTENT_SLUGS } from "@/config/bureau-poles-content"
import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

/**
 * Filtres Prisma pour retrouver un pôle quand `public_slug` n’est pas renseigné
 * (même logique que la migration `20260505130000_details_pole_bureau_sections`).
 */
export function poleWhereByPublicSlugFallback(
  slug: string,
): Prisma.PoleWhereInput | null {
  if (!BUREAU_POLE_CONTENT_SLUGS.includes(slug as BureauPoleContentSlug)) {
    return null
  }

  switch (slug as BureauPoleContentSlug) {
    case "evenementiel":
      return {
        OR: [
          { name: { contains: "événementiel", mode: "insensitive" } },
          { name: { contains: "evenementiel", mode: "insensitive" } },
        ],
      }
    case "demarche-administrative":
      return {
        AND: [
          {
            OR: [
              { name: { contains: "démarche", mode: "insensitive" } },
              { name: { contains: "demarche", mode: "insensitive" } },
            ],
          },
          {
            OR: [
              { name: { contains: "administratif", mode: "insensitive" } },
              { name: { contains: "administrative", mode: "insensitive" } },
            ],
          },
        ],
      }
    case "mise-en-relation":
      return {
        OR: [
          {
            AND: [
              { name: { contains: "mise", mode: "insensitive" } },
              { name: { contains: "relation", mode: "insensitive" } },
            ],
          },
          { name: { contains: "hébergement", mode: "insensitive" } },
          { name: { contains: "hebergement", mode: "insensitive" } },
        ],
      }
    default:
      return null
  }
}

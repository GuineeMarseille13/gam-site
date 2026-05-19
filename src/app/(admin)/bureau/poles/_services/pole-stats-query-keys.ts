import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

export const poleStatsKeys = {
  all: ["bureau", "poles", "stats"] as const,
  byPole: (poleSlug: EditablePolePublicSlug) =>
    ["bureau", "poles", "stats", poleSlug] as const,
} as const


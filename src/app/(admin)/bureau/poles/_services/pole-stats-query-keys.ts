import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

export const poleStatsKeys = {
  all: ["bureau", "poles", "stats"] as const,
  byPole: (poleSlug: BureauPoleContentSlug) =>
    ["bureau", "poles", "stats", poleSlug] as const,
} as const


import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"

export const poleServicesKeys = {
  all: ["bureau", "poles", "services"] as const,
  byPole: (poleSlug: BureauPoleContentSlug) =>
    ["bureau", "poles", "services", poleSlug] as const,
} as const


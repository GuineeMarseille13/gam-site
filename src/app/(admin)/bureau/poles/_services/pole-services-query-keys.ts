import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

export const poleServicesKeys = {
  all: ["bureau", "poles", "services"] as const,
  byPole: (poleSlug: EditablePolePublicSlug) =>
    ["bureau", "poles", "services", poleSlug] as const,
} as const


import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"

export const poleAchievementsKeys = {
  all: ["pole-achievements"] as const,
  byPole: (poleSlug: EditablePolePublicSlug) =>
    [...poleAchievementsKeys.all, poleSlug] as const,
}

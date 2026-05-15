import { memberSchema, type Member } from "../_schemas/adhesion.schema"

/**
 * Parse et valide les membres stockés dans les métadonnées Stripe (adhésion).
 */
export function parseAdhesionMembersFromMetadata(membersJson: string): Member[] {
  let parsedMembers: unknown[]
  try {
    parsedMembers = JSON.parse(membersJson) as unknown[]
  } catch (err) {
    throw new Error(
      `Erreur lors du parsing des membres: ${err instanceof Error ? err.message : "Erreur inconnue"}`,
    )
  }

  return parsedMembers.map((member) => memberSchema.parse(member))
}

import type { Prisma } from "@/lib/generated/prisma/client"

/**
 * Enregistrement d’adhésion tel que renvoyé par Prisma avec personne et paiement.
 */
export type AdhesionWithRelations = Prisma.MemberShipGetPayload<{
  include: { person: true; payment: true }
}>

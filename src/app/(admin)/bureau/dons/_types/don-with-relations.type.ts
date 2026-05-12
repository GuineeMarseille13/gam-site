import type { Prisma } from "@/lib/generated/prisma/client"

/**
 * Don (Donation) tel que renvoyé par Prisma avec personne et paiement.
 */
export type DonWithRelations = Prisma.DonationGetPayload<{
  include: { person: true; payment: true }
}>


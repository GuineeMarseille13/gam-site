import type { Prisma } from "@/lib/generated/prisma/client"

/**
 * Commande telle que renvoyée par Prisma avec client, paiement et lignes.
 */
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    person: true
    payment: true
    items: { include: { product: true } }
  }
}>

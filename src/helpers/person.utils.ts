import type { PrismaClient } from "@/lib/generated/prisma/client"

type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0]

/**
 * Trouve ou crée une Person à partir des informations de base.
 * Recherche par (firstName + lastName + phone), sinon crée une nouvelle entrée.
 */
export async function findOrCreatePerson(
  tx: TransactionClient,
  data: { firstName: string; lastName: string; phone?: string; email?: string }
): Promise<string> {
  const { firstName, lastName, phone, email } = data

  // Rechercher une personne existante par nom + prénom + téléphone
  if (phone) {
    const existing = await tx.person.findFirst({
      where: { firstName, lastName, phone },
      select: { id: true },
    })
    if (existing) return existing.id
  }

  // Créer une nouvelle personne
  const person = await tx.person.create({
    data: {
      firstName,
      lastName,
      phone: phone || '',
      email: email || null,
    },
  })

  return person.id
}

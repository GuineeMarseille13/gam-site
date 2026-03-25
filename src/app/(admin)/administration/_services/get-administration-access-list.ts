import { prisma } from "@/lib/prisma"
import { requireAdmin, requireAdministrationDashboard } from "@/lib/auth-guard"
import {
  administrationAccessRowSchema,
  type AdministrationAccessRow,
} from "../_schemas/administration-access.schema"

/**
 * Liste des comptes Better Auth avec rôle `administration`, avec fiche Person si présente.
 */
export async function getAdministrationAccessList(): Promise<AdministrationAccessRow[]> {
  await requireAdministrationDashboard()

  const users = await prisma.user.findMany({
    where: { role: "administration" },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  if (users.length === 0) return []

  const userIds = users.map((u) => u.id)
  const persons = await prisma.person.findMany({
    where: { userId: { in: userIds } },
  })
  const personByUserId = new Map(persons.map((p) => [p.userId!, p]))

  const rows: AdministrationAccessRow[] = users.map((u) => {
    const person = personByUserId.get(u.id) ?? null
    return {
      userId: u.id,
      email: u.email,
      name: u.name,
      banned: u.banned === true,
      createdAt: u.createdAt.toISOString(),
      person: person
        ? {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            phone: person.phone,
            email: person.email,
            image: person.image,
            description: person.description,
          }
        : null,
    }
  })

  return rows.map((r) => administrationAccessRowSchema.parse(r))
}

/**
 * Détail pour le formulaire d’édition (admin uniquement).
 */
export async function getAdministrationAccessForEdit(userId: string) {
  await requireAdmin()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== "administration") return null

  const person = await prisma.person.findUnique({ where: { userId } })
  return { user, person }
}

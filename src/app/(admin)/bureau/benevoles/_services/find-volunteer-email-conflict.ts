import { prisma } from "@/lib/prisma"

const VOLUNTEER_EMAIL_CONFLICT_MESSAGE =
  "Un bénévole avec cet email existe déjà."

/**
 * Vérifie si l'email est déjà utilisé par un autre bénévole (fiche Person liée à Volunteer).
 */
export async function findVolunteerEmailConflict(
  email: string | null,
  excludePersonId?: string,
): Promise<string | null> {
  if (!email) return null

  const normalized = email.trim().toLowerCase()
  if (!normalized) return null

  const volunteerPersonIds = await prisma.volunteer.findMany({
    select: { personId: true },
  })

  const eligibleIds = volunteerPersonIds
    .map((volunteer) => volunteer.personId)
    .filter((personId) => personId !== excludePersonId)

  if (eligibleIds.length === 0) return null

  const conflict = await prisma.person.findFirst({
    where: {
      id: { in: eligibleIds },
      email: { equals: normalized, mode: "insensitive" },
    },
    select: { id: true },
  })

  return conflict ? VOLUNTEER_EMAIL_CONFLICT_MESSAGE : null
}

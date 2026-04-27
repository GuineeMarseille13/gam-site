import { prisma } from "@/lib/prisma"

/**
 * Retourne l'id `Person` associé au compte Better Auth (`session.user.id`), sinon `null`.
 */
export async function getPersonIdForAuthUserId(userId: string): Promise<string | null> {
  const person = await prisma.person.findUnique({
    where: { userId },
    select: { id: true },
  })
  return person?.id ?? null
}

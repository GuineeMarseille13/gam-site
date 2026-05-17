import type { Prisma, PrismaClient } from "@/lib/generated/prisma/client"

type DbClient = PrismaClient | Prisma.TransactionClient

/**
 * Séparation des données :
 * - `Person` : fiche métier (membre bureau, bénévole, adhérent…) — avec ou sans accès.
 * - `User` : compte Better Auth (email, mot de passe, rôle) — uniquement si accès dashboard.
 *
 * Seules les personnes ayant un accès ont une ligne `User` ; le lien est `Person.userId`.
 */

export function buildUserDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

/** Met à jour le seul champ profil utile côté auth : le nom affiché du compte. */
export async function syncUserDisplayNameFromPerson(
  db: DbClient,
  userId: string,
  firstName: string,
  lastName: string,
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { name: buildUserDisplayName(firstName, lastName) },
  })
}

/** Lie une fiche Person existante (sans accès) à un compte User nouvellement créé. */
export async function linkPersonToDashboardUser(
  db: DbClient,
  personId: string,
  userId: string,
  loginEmail: string,
): Promise<void> {
  await db.person.update({
    where: { id: personId },
    data: { userId, email: loginEmail },
  })
}

/** Délie la Person du compte sans supprimer la fiche métier. */
export async function unlinkPersonFromDashboardUser(
  db: DbClient,
  userId: string,
): Promise<void> {
  await db.person.updateMany({
    where: { userId },
    data: { userId: null },
  })
}

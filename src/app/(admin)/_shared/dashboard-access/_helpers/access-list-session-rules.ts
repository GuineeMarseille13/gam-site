/**
 * Indique si la cible correspond à l'utilisateur de la session (auto-gestion interdite dans les listes d'accès).
 */
export function isAccessListSelfUser(targetUserId: string, sessionUserId: string): boolean {
  return targetUserId === sessionUserId
}

/**
 * Clause Prisma pour exclure l'utilisateur connecté d'une liste d'accès dashboard.
 */
export function prismaUserWhereExcludeSessionUser(sessionUserId: string) {
  return { NOT: { id: sessionUserId } } as const
}

/**
 * Filet UI : retire l'utilisateur connecté si une ligne a encore transité côté client.
 */
export function filterAccessListRowsExcludingSessionUser<T extends { userId: string }>(
  rows: T[],
  sessionUserId: string | undefined,
): T[] {
  if (!sessionUserId) return rows
  return rows.filter((row) => !isAccessListSelfUser(row.userId, sessionUserId))
}

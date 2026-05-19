import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { sessionCanAccessPoleApi } from "@/helpers/api-dashboard-auth"

/**
 * Vérifie la session et les droits d’édition API pour un pôle (`/api/bureau/poles/[poleSlug]/*`).
 */
export async function hasPoleApiAccess(poleSlug: string): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return false
  return sessionCanAccessPoleApi(session.user.role, poleSlug)
}

import { getDashboardPermissions } from "@/config/dashboard-permissions"
import {
  isBureauDashboardRole,
  isPermanenceOnlyRole,
} from "@/helpers/dashboard-roles"

export type AuthDashboardTarget = "bureau" | "administration"

export type PostAuthRedirectResult =
  | { status: "allowed"; href: string }
  | { status: "wrong_dashboard"; href: string; message: string }
  | { status: "denied"; message: string }

function safePath(path: string, prefix: "/bureau" | "/administration", fallback: string): string {
  if (path.startsWith(prefix)) return path
  return fallback
}

/**
 * Détermine la redirection après connexion selon le rôle et l’espace ciblé (Bureau / Administration).
 */
export function resolvePostAuthRedirect(
  role: string | null | undefined,
  target: AuthDashboardTarget,
  requestedPath: string,
): PostAuthRedirectResult {
  const permissions = getDashboardPermissions(role)

  if (target === "bureau") {
    if (isBureauDashboardRole(role) && permissions.canAccessBureauDashboard) {
      return { status: "allowed", href: safePath(requestedPath, "/bureau", "/bureau") }
    }

    if (
      isPermanenceOnlyRole(role) ||
      permissions.canAccessAdministrationDashboard
    ) {
      return {
        status: "wrong_dashboard",
        href: "/administration",
        message:
          "Ce compte est rattaché à l’espace Administration, pas au Bureau GAM. Vous avez été redirigé.",
      }
    }

    return {
      status: "denied",
      message:
        "Ce compte n’a pas accès à l’espace Bureau GAM. Utilisez la connexion Administration si vous êtes permanent(e), ou contactez un administrateur.",
    }
  }

  if (permissions.canAccessAdministrationDashboard) {
    return {
      status: "allowed",
      href: safePath(requestedPath, "/administration", "/administration"),
    }
  }

  if (isBureauDashboardRole(role) && permissions.canAccessBureauDashboard) {
    return {
      status: "wrong_dashboard",
      href: "/bureau",
      message:
        "Ce compte est rattaché à l’espace Bureau GAM, pas à l’Administration. Vous avez été redirigé.",
    }
  }

  return {
    status: "denied",
    message:
      "Ce compte n’a pas accès à l’espace Administration. Utilisez la connexion Bureau si vous êtes membre du bureau.",
  }
}

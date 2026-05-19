import { getDashboardPermissions } from "@/config/dashboard-permissions"
import {
  isBureauDashboardRole,
  isHerbergementRelationOnlyRole,
  isPermanenceOnlyRole,
} from "@/helpers/dashboard-roles"

export type AuthDashboardTarget = "bureau" | "administration" | "hebergement-relation"

export type PostAuthRedirectResult =
  | { status: "allowed"; href: string }
  | { status: "wrong_dashboard"; href: string; message: string }
  | { status: "denied"; message: string }

type DashboardPrefix = "/bureau" | "/administration" | "/hebergement-relation"

function safePath(path: string, prefix: DashboardPrefix, fallback: string): string {
  if (path.startsWith(prefix)) return path
  return fallback
}

/**
 * Détermine la redirection après connexion selon le rôle et l’espace ciblé.
 */
export function resolvePostAuthRedirect(
  role: string | null | undefined,
  target: AuthDashboardTarget,
  requestedPath: string,
): PostAuthRedirectResult {
  const permissions = getDashboardPermissions(role)

  if (target === "hebergement-relation") {
    if (permissions.canAccessHerbergementRelationDashboard) {
      return {
        status: "allowed",
        href: safePath(requestedPath, "/hebergement-relation", "/hebergement-relation"),
      }
    }

    if (isPermanenceOnlyRole(role) || permissions.canAccessAdministrationDashboard) {
      return {
        status: "wrong_dashboard",
        href: "/administration",
        message:
          "Ce compte est rattaché à l’espace Administration, pas à Hébergement et mise en relation.",
      }
    }

    if (isBureauDashboardRole(role) && permissions.canAccessBureauDashboard) {
      return {
        status: "wrong_dashboard",
        href: "/bureau",
        message:
          "Ce compte est rattaché au Bureau GAM, pas à Hébergement et mise en relation.",
      }
    }

    return {
      status: "denied",
      message:
        "Ce compte n’a pas accès à l’espace Hébergement et mise en relation. Contactez un administrateur.",
    }
  }

  if (target === "bureau") {
    if (isBureauDashboardRole(role) && permissions.canAccessBureauDashboard) {
      return { status: "allowed", href: safePath(requestedPath, "/bureau", "/bureau") }
    }

    if (isHerbergementRelationOnlyRole(role)) {
      return {
        status: "wrong_dashboard",
        href: "/hebergement-relation",
        message:
          "Ce compte est rattaché à l’espace Hébergement et mise en relation. Vous avez été redirigé.",
      }
    }

    if (isPermanenceOnlyRole(role) || permissions.canAccessAdministrationDashboard) {
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
        "Ce compte n’a pas accès à l’espace Bureau GAM. Utilisez la connexion adaptée à votre périmètre ou contactez un administrateur.",
    }
  }

  if (permissions.canAccessAdministrationDashboard) {
    return {
      status: "allowed",
      href: safePath(requestedPath, "/administration", "/administration"),
    }
  }

  if (isHerbergementRelationOnlyRole(role)) {
    return {
      status: "wrong_dashboard",
      href: "/hebergement-relation",
      message:
        "Ce compte est rattaché à l’espace Hébergement et mise en relation. Vous avez été redirigé.",
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
      "Ce compte n’a pas accès à l’espace Administration. Utilisez la connexion adaptée à votre périmètre.",
  }
}

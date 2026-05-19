import type { ProfilDashboardScope } from "../_types/profil-dashboard-scope"

const LOGIN_PATH_BY_SCOPE = {
  bureau: "/connexion",
  administration: "/connexion-administration",
  "hebergement-relation": "/connexion-hebergement-relation",
} as const satisfies Record<ProfilDashboardScope, string>

/**
 * Page de connexion à utiliser après changement de mot de passe,
 * alignée sur l’espace dashboard où l’utilisateur modifie son profil.
 */
export function resolveProfilLoginPath(scope: ProfilDashboardScope): string {
  return LOGIN_PATH_BY_SCOPE[scope]
}

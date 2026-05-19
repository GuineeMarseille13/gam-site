/**
 * Chemin de connexion selon le préfixe du dashboard protégé.
 */
export function resolveDashboardLoginPath(pathname: string): string {
  if (pathname.startsWith("/administration")) return "/connexion-administration"
  if (pathname.startsWith("/hebergement-relation")) return "/connexion-hebergement-relation"
  return "/connexion"
}

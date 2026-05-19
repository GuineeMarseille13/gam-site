/**
 * Indique si le chemin correspond aux espaces où le thème clair/sombre est actif
 * (Bureau et Administration — pas le site public ni les pages de connexion).
 */
export function isDashboardThemeRoute(pathname: string | null): boolean {
  if (pathname == null || pathname === "") return false
  return (
    pathname.startsWith("/bureau") ||
    pathname.startsWith("/administration") ||
    pathname.startsWith("/hebergement-relation")
  )
}

"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { resolveDashboardLoginPath } from "@/helpers/dashboard-login-path"
import { MISE_EN_RELATION_POLE_SLUG } from "@/config/pole-public-slugs"
import {
  DASHBOARD_CAPABILITY,
  type DashboardCapability,
  getDashboardPermissions,
  hasDashboardCapability,
} from "@/config/dashboard-permissions"
import { sessionCanAccessMiseEnRelationPoleContent } from "@/helpers/api-dashboard-auth"
import { BUREAU_DASHBOARD_ROLES, SUPER_ADMIN_ROLE } from "@/helpers/dashboard-roles"

const BUREAU_DASHBOARD = BUREAU_DASHBOARD_ROLES as readonly string[]

function getRequestPathname(headerList: Headers): string {
  return headerList.get("x-pathname") ?? "/bureau"
}

function getDashboardHome(pathname: string): string {
  if (pathname.startsWith("/administration")) return "/administration"
  if (pathname.startsWith("/hebergement-relation")) return "/hebergement-relation"
  return "/bureau"
}

/** Invalide les cookies Better Auth puis redirige vers la page de connexion adaptée. */
async function invalidateSessionAndRedirectToLogin(
  error: "session_expired" | "unauthorized",
): Promise<never> {
  const requestHeaders = await headers()
  const pathname = getRequestPathname(requestHeaders)
  const loginPath = resolveDashboardLoginPath(pathname)

  try {
    await auth.api.signOut({ headers: requestHeaders })
  } catch {
    // Session déjà absente ou cookie invalide
  }

  const params = new URLSearchParams({ error })
  params.set("redirect", pathname)
  redirect(`${loginPath}?${params.toString()}`)
}

function redirectForbidden(pathname: string): never {
  redirect(`${getDashboardHome(pathname)}?error=forbidden`)
}

function redirectUnauthorized(pathname: string): never {
  const loginPath = resolveDashboardLoginPath(pathname)
  const params = new URLSearchParams({ error: "unauthorized", redirect: pathname })
  redirect(`${loginPath}?${params.toString()}`)
}

async function getSessionOrThrow() {
  return ensureDashboardSession()
}

/** Session valide ou déconnexion + redirection vers la page de connexion du dashboard. */
export async function ensureDashboardSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return invalidateSessionAndRedirectToLogin("session_expired")
  }
  return session
}

/**
 * Utilisateur connecté avec accès à au moins un dashboard (Bureau, Administration ou Hébergement).
 */
export async function requireAuthenticatedDashboardUser() {
  const requestHeaders = await headers()
  const pathname = getRequestPathname(requestHeaders)
  const session = await getSessionOrThrow()
  const permissions = getDashboardPermissions(session.user.role)

  if (
    !permissions.canAccessBureauDashboard &&
    !permissions.canAccessAdministrationDashboard &&
    !permissions.canAccessHerbergementRelationDashboard
  ) {
    redirectUnauthorized(pathname)
  }

  return session
}

async function assertCapability(
  role: string | null | undefined,
  capability: DashboardCapability,
): Promise<void> {
  if (!hasDashboardCapability(role, capability)) {
    const pathname = getRequestPathname(await headers())
    redirectForbidden(pathname)
  }
}

async function assertAdministrationDashboard(role: string | null | undefined): Promise<void> {
  if (!getDashboardPermissions(role).canAccessAdministrationDashboard) {
    const pathname = getRequestPathname(await headers())
    redirectUnauthorized(pathname)
  }
}

/**
 * Vérifie que l'utilisateur connecté a accès au dashboard Bureau.
 */
export async function requireBureau() {
  const requestHeaders = await headers()
  const pathname = getRequestPathname(requestHeaders)
  const session = await getSessionOrThrow()
  if (!BUREAU_DASHBOARD.includes(session.user.role ?? "")) {
    redirectUnauthorized(pathname)
  }
  if (!getDashboardPermissions(session.user.role).canAccessBureauDashboard) {
    redirectUnauthorized(pathname)
  }
  return session
}

/**
 * Accès au dashboard Administration (toute fonctionnalité autorisée pour le rôle).
 */
export async function requireAdministrationDashboard() {
  const session = await getSessionOrThrow()
  await assertAdministrationDashboard(session.user.role)
  return session
}

/**
 * Vérifie que l'utilisateur connecté est super administrateur.
 */
export async function requireAdmin() {
  const pathname = getRequestPathname(await headers())
  const session = await getSessionOrThrow()
  if (session.user.role !== SUPER_ADMIN_ROLE) {
    redirectForbidden(pathname)
  }
  return session
}

/** Contenu du site (mutations). */
export async function requireBureauContenu() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauContenu)
  return session
}

/** Paiements (adhésions, dons, commandes). */
export async function requireBureauPaiements() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauPaiements)
  return session
}

/** Administration bureau — tous les membres (comptes). */
export async function requireBureauAdminMembres() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminMembres)
  return session
}

/** Administration bureau — adhérents. */
export async function requireBureauAdminAdherents() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminAdherents)
  return session
}

/** Administration bureau — bénévoles. */
export async function requireBureauAdminBenevoles() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminBenevoles)
  return session
}

/** Lecture / gestion bénévoles (Bureau ou Administration). */
export async function requireBenevolesManagement() {
  const session = await getSessionOrThrow()
  const role = session.user.role ?? ""
  const permissions = getDashboardPermissions(role)
  if (permissions.canAccessAdminBenevolesList || permissions.canManageAdminBenevoles) {
    return session
  }
  if (hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauAdminBenevoles)) {
    return session
  }
  const pathname = getRequestPathname(await headers())
  redirectForbidden(pathname)
}

/** Création / modification bénévoles (Bureau ou Administration). */
export async function requireBenevolesWrite() {
  const session = await getSessionOrThrow()
  const role = session.user.role ?? ""
  const permissions = getDashboardPermissions(role)
  if (
    permissions.canManageAdminBenevoles ||
    hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauAdminBenevoles)
  ) {
    return session
  }
  const pathname = getRequestPathname(await headers())
  redirectForbidden(pathname)
}

/** Suppression bénévole (Bureau ou Administration). */
export async function requireBenevoleDelete() {
  const session = await getSessionOrThrow()
  const role = session.user.role ?? ""
  const permissions = getDashboardPermissions(role)
  if (
    permissions.canDeleteAdminBenevole ||
    permissions.canDeleteAdminEntities
  ) {
    return session
  }
  const pathname = getRequestPathname(await headers())
  redirectForbidden(pathname)
}

/** Membres du bureau (équipe site) — super admin uniquement. */
export async function requireBureauAdminEquipe() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminEquipe)
  return session
}

/** Gestion des accès dashboard bureau — super admin uniquement. */
export async function requireBureauAdminAcces() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminAcces)
  return session
}

/** Suppression dans l’administration bureau (membres, adhérents, bénévoles). */
export async function requireBureauAdminDelete() {
  const session = await requireBureau()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminDelete)
  return session
}

/** Accès au dashboard Hébergement et mise en relation. */
export async function requireHerbergementRelationDashboard() {
  const pathname = getRequestPathname(await headers())
  const session = await getSessionOrThrow()
  if (!getDashboardPermissions(session.user.role).canAccessHerbergementRelationDashboard) {
    redirectUnauthorized(pathname)
  }
  return session
}

/** Édition du contenu public d’un pôle (Bureau ou Hébergement selon le slug). */
export async function requirePolePublicContentEdit(poleSlug: string) {
  const session = await getSessionOrThrow()
  const role = session.user.role ?? ""
  if (poleSlug === MISE_EN_RELATION_POLE_SLUG) {
    if (!sessionCanAccessMiseEnRelationPoleContent(role)) {
      const pathname = getRequestPathname(await headers())
      redirectForbidden(pathname)
    }
    return session
  }
  await assertCapability(role, DASHBOARD_CAPABILITY.bureauContenu)
  return session
}

/** Gestion des accès dashboard Hébergement et mise en relation. */
export async function requireHerbergementAcces() {
  const session = await requireHerbergementRelationDashboard()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.hebergementAcces)
  return session
}

/** Calendrier permanence (dashboard Administration). */
export async function requireAdminCalendrier() {
  const session = await requireAdministrationDashboard()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminCalendrier)
  return session
}

/** Accès administration — gestion des comptes permanence. */
export async function requireAdminAcces() {
  const session = await requireAdministrationDashboard()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminAcces)
  return session
}

/** Liste bénévoles Administration (lecture). */
export async function requireAdminBenevolesRead() {
  const session = await requireAdministrationDashboard()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminBenevolesRead)
  return session
}

/** Création / édition bénévoles Administration. */
export async function requireAdminBenevolesManage() {
  const session = await requireAdministrationDashboard()
  await assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminBenevolesManage)
  return session
}

/** Capacité arbitraire (garde générique). */
export async function requireDashboardCapability(capability: DashboardCapability) {
  const session = await getSessionOrThrow()
  await assertCapability(session.user.role, capability)
  return session
}

/** Permissions résolues pour la session courante (UI serveur). */
export async function getSessionDashboardPermissions() {
  const session = await getSessionOrThrow()
  return {
    session,
    permissions: getDashboardPermissions(session.user.role),
  }
}

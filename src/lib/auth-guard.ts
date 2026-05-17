"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  DASHBOARD_CAPABILITY,
  type DashboardCapability,
  getDashboardPermissions,
  hasDashboardCapability,
} from "@/config/dashboard-permissions"
import {
  ADMINISTRATION_DASHBOARD_ROLES,
  BUREAU_DASHBOARD_ROLES,
  SUPER_ADMIN_ROLE,
} from "@/helpers/dashboard-roles"

const BUREAU_DASHBOARD = BUREAU_DASHBOARD_ROLES as readonly string[]

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    throw new Error("Accès non autorisé")
  }
  return session
}

function assertCapability(
  role: string | null | undefined,
  capability: DashboardCapability,
): void {
  if (!hasDashboardCapability(role, capability)) {
    throw new Error("Accès non autorisé")
  }
}

function assertAdministrationDashboard(role: string | null | undefined): void {
  if (!getDashboardPermissions(role).canAccessAdministrationDashboard) {
    throw new Error("Accès non autorisé")
  }
}

/**
 * Vérifie que l'utilisateur connecté a accès au dashboard Bureau.
 */
export async function requireBureau() {
  const session = await getSessionOrThrow()
  if (!BUREAU_DASHBOARD.includes(session.user.role ?? "")) {
    throw new Error("Accès non autorisé")
  }
  if (!getDashboardPermissions(session.user.role).canAccessBureauDashboard) {
    throw new Error("Accès non autorisé")
  }
  return session
}

/**
 * Accès au dashboard Administration (toute fonctionnalité autorisée pour le rôle).
 */
export async function requireAdministrationDashboard() {
  const session = await getSessionOrThrow()
  assertAdministrationDashboard(session.user.role)
  return session
}

/**
 * Vérifie que l'utilisateur connecté est super administrateur.
 */
export async function requireAdmin() {
  const session = await getSessionOrThrow()
  if (session.user.role !== SUPER_ADMIN_ROLE) {
    throw new Error("Accès réservé aux administrateurs")
  }
  return session
}

/** Contenu du site (mutations). */
export async function requireBureauContenu() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauContenu)
  return session
}

/** Paiements (adhésions, dons, commandes). */
export async function requireBureauPaiements() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauPaiements)
  return session
}

/** Administration bureau — tous les membres (comptes). */
export async function requireBureauAdminMembres() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminMembres)
  return session
}

/** Administration bureau — adhérents. */
export async function requireBureauAdminAdherents() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminAdherents)
  return session
}

/** Administration bureau — bénévoles. */
export async function requireBureauAdminBenevoles() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminBenevoles)
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
  throw new Error("Accès non autorisé")
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
  throw new Error("Accès non autorisé")
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
  throw new Error("Accès non autorisé")
}

/** Membres du bureau (équipe site) — super admin uniquement. */
export async function requireBureauAdminEquipe() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminEquipe)
  return session
}

/** Gestion des accès dashboard bureau — super admin uniquement. */
export async function requireBureauAdminAcces() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminAcces)
  return session
}

/** Suppression dans l’administration bureau (membres, adhérents, bénévoles). */
export async function requireBureauAdminDelete() {
  const session = await requireBureau()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.bureauAdminDelete)
  return session
}

/** Calendrier permanence (dashboard Administration). */
export async function requireAdminCalendrier() {
  const session = await requireAdministrationDashboard()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminCalendrier)
  return session
}

/** Accès administration — gestion des comptes permanence. */
export async function requireAdminAcces() {
  const session = await requireAdministrationDashboard()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminAcces)
  return session
}

/** Liste bénévoles Administration (lecture). */
export async function requireAdminBenevolesRead() {
  const session = await requireAdministrationDashboard()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminBenevolesRead)
  return session
}

/** Création / édition bénévoles Administration. */
export async function requireAdminBenevolesManage() {
  const session = await requireAdministrationDashboard()
  assertCapability(session.user.role, DASHBOARD_CAPABILITY.adminBenevolesManage)
  return session
}

/** Capacité arbitraire (garde générique). */
export async function requireDashboardCapability(capability: DashboardCapability) {
  const session = await getSessionOrThrow()
  assertCapability(session.user.role, capability)
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

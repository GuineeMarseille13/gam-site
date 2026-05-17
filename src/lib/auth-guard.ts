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
const ADMINISTRATION_ZONE = ADMINISTRATION_DASHBOARD_ROLES as readonly string[]

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

/**
 * Vérifie que l'utilisateur connecté a accès au dashboard Bureau.
 */
export async function requireBureau() {
  const session = await getSessionOrThrow()
  if (!BUREAU_DASHBOARD.includes(session.user.role ?? "")) {
    throw new Error("Accès non autorisé")
  }
  return session
}

/**
 * Accès aux fonctionnalités partagées entre Bureau et Administration.
 */
export async function requireAdministrationDashboard() {
  const session = await getSessionOrThrow()
  if (!ADMINISTRATION_ZONE.includes(session.user.role ?? "")) {
    throw new Error("Accès non autorisé")
  }
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

/**
 * Gestion des bénévoles (dashboard Bureau ou Administration).
 */
export async function requireBenevolesManagement() {
  const session = await getSessionOrThrow()
  const role = session.user.role ?? ""
  if (
    hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauAdminBenevoles) ||
    ADMINISTRATION_ZONE.includes(role)
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

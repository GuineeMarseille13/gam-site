"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  ADMINISTRATION_DASHBOARD_ROLES,
  BUREAU_DASHBOARD_ROLES,
} from "@/helpers/dashboard-roles"

const BUREAU_ONLY = BUREAU_DASHBOARD_ROLES as readonly string[]
const ADMINISTRATION_ZONE = ADMINISTRATION_DASHBOARD_ROLES as readonly string[]

/**
 * Vérifie que l'utilisateur connecté a le rôle admin ou bureau (dashboard Bureau).
 * Lève une erreur sinon.
 */
export async function requireBureau() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !BUREAU_ONLY.includes(session.user.role ?? "")) {
    throw new Error("Accès non autorisé")
  }
  return session
}

/**
 * Accès aux fonctionnalités partagées entre Bureau et Administration (ex. bénévoles, profil limité).
 * Rôles : admin, bureau, administration.
 */
export async function requireAdministrationDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !ADMINISTRATION_ZONE.includes(session.user.role ?? "")) {
    throw new Error("Accès non autorisé")
  }
  return session
}

/**
 * Vérifie que l'utilisateur connecté a le rôle admin uniquement.
 * Lève une erreur sinon.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    throw new Error("Accès réservé aux administrateurs")
  }
  return session
}

"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const BUREAU_ROLES = ["admin", "bureau"]

/**
 * Vérifie que l'utilisateur connecté a le rôle admin ou bureau.
 * Lève une erreur sinon.
 */
export async function requireBureau() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !BUREAU_ROLES.includes(session.user.role ?? "")) {
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

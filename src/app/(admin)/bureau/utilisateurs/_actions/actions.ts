"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== "admin") {
    throw new Error("Accès non autorisé")
  }
  return session
}

// ── Lister les utilisateurs ────────────────────────────────────────────────────

export async function listUsers() {
  await requireAdmin()
  const result = await auth.api.listUsers({
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    headers: await headers(),
  })
  return result.users ?? []
}

// ── Créer un utilisateur ───────────────────────────────────────────────────────

export async function createUser(formData: FormData) {
  await requireAdmin()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  if (!name || !email || !password || !role) {
    return { error: "Tous les champs sont requis." }
  }

  try {
    await auth.api.createUser({
      body: { name, email, password, role },
      headers: await headers(),
    })
    revalidatePath("/bureau/utilisateurs")
    return { success: true }
  } catch {
    return { error: "Un utilisateur avec cet email existe déjà." }
  }
}

// ── Modifier le rôle ───────────────────────────────────────────────────────────

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin()

  await auth.api.setRole({
    body: { userId, role },
    headers: await headers(),
  })
  revalidatePath("/bureau/utilisateurs")
}

// ── Modifier le nom ────────────────────────────────────────────────────────────

export async function updateUser(formData: FormData) {
  await requireAdmin()

  const userId = formData.get("userId") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string

  if (!userId || !name || !role) {
    return { error: "Données invalides." }
  }

  try {
    // Update role via admin API
    await auth.api.setRole({
      body: { userId, role },
      headers: await headers(),
    })
    revalidatePath("/bureau/utilisateurs")
    return { success: true }
  } catch {
    return { error: "Erreur lors de la mise à jour." }
  }
}

// ── Bannir / débannir ──────────────────────────────────────────────────────────

export async function banUser(userId: string) {
  await requireAdmin()
  await auth.api.banUser({
    body: { userId },
    headers: await headers(),
  })
  revalidatePath("/bureau/utilisateurs")
}

export async function unbanUser(userId: string) {
  await requireAdmin()
  await auth.api.unbanUser({
    body: { userId },
    headers: await headers(),
  })
  revalidatePath("/bureau/utilisateurs")
}

// ── Supprimer ─────────────────────────────────────────────────────────────────

export async function deleteUser(userId: string) {
  const session = await requireAdmin()
  if (session.user.id === userId) {
    return { error: "Vous ne pouvez pas supprimer votre propre compte." }
  }

  try {
    await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    })
    revalidatePath("/bureau/utilisateurs")
    return { success: true }
  } catch {
    return { error: "Erreur lors de la suppression." }
  }
}

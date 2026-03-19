"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { Role } from "@/lib/generated/prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireBureau } from "@/lib/auth-guard"

// ── Lister les utilisateurs ────────────────────────────────────────────────────

export async function listUsers() {
  await requireBureau()
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
      body: { name, email, password, role: role as "admin" | "user" },
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
    body: { userId, role: role as "admin" | "user" },
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

// ── Lister les bénévoles (table Person) ───────────────────────────────────────

export async function listBenevoles() {
  await requireBureau()
  return prisma.person.findMany({
    where: { roles: { has: Role.VOLUNTEER } },
    orderBy: { createdAt: "desc" },
  })
}

// ── Créer un bénévole (table Person) ──────────────────────────────────────────

export async function createBenevole(formData: FormData) {
  await requireAdmin()

  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName")  as string
  const email     = formData.get("email")     as string | null
  const phone     = formData.get("phone")     as string

  const address = (formData.get("address") as string | null)?.trim() || null
  const zipCode = (formData.get("zipCode") as string | null)?.trim() || null
  const city    = (formData.get("city")    as string | null)?.trim() || null
  const country = (formData.get("country") as string | null)?.trim() || "France"

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  // Adresse : on la crée uniquement si rue, code postal et ville sont fournis
  const hasAddress = !!(address && zipCode && city)
  if ((address || zipCode || city) && !hasAddress) {
    return { error: "Pour enregistrer l'adresse, renseignez la rue, le code postal et la ville." }
  }

  try {
    const addressRecord = hasAddress
      ? await prisma.address.create({
          data: {
            address: address!,
            zipCode: zipCode!,
            city:    city!,
            country,
            state:       "",
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase(),
          },
        })
      : null

    await prisma.person.create({
      data: {
        firstName,
        lastName,
        email:     email || null,
        phone,
        roles:     ["VOLUNTEER"],
        addressId: addressRecord?.id ?? null,
      },
    })

    revalidatePath("/bureau/utilisateurs")
    return { success: true }
  } catch {
    return { error: "Erreur lors de la création du bénévole." }
  }
}

// ── Supprimer un bénévole (table Person) ──────────────────────────────────────

export async function deleteBenevole(personId: string) {
  await requireAdmin()
  try {
    await prisma.person.delete({ where: { id: personId } })
    revalidatePath("/bureau/utilisateurs")
    return { success: true }
  } catch {
    return { error: "Erreur lors de la suppression du bénévole." }
  }
}

// ── Supprimer un utilisateur ───────────────────────────────────────────────────

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

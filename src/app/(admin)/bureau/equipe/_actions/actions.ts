"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import {
  deleteSupersededPublicId,
  safeDestroyCloudinaryAsset,
} from "@/lib/cloudinary-replacement"
import { requireAdmin, requireBureau } from "@/lib/auth-guard"
import { getRoleIdByCode } from "@/lib/association-role-helpers"

// ── Helper image ───────────────────────────────────────────────────────────────

async function resolveImageId(formData: FormData, fallback: string | null = null): Promise<string | null> {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, "gam/equipe")
    return result.publicId
  }
  const fromForm = (formData.get("imageId") as string) || null
  return fromForm ?? fallback
}

// ── Créer un membre de l'équipe ────────────────────────────────────────────────
// Flux : User (Better Auth) → Person → TeamMember

export async function createMembreEquipe(formData: FormData) {
  await requireAdmin()

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const email       = formData.get("email")     as string
  const password    = formData.get("password")  as string
  const phone       = formData.get("phone")     as string
  const role        = (formData.get("role") as string)?.trim() || "bureau"
  const associationRoleCode = (formData.get("associationRoleCode") as string | null)?.trim() || null
  const description = (formData.get("description") as string | null)?.trim() || null
  const order       = parseInt(formData.get("order") as string) || 0
  const showOnSite  = formData.get("showOnSite") !== "false"

  if (!firstName || !lastName || !email || !password || !phone) {
    return { error: "Tous les champs obligatoires doivent être remplis." }
  }

  if (!associationRoleCode) {
    return { error: "Veuillez sélectionner un rôle dans le bureau." }
  }

  const associationRoleId = await getRoleIdByCode(prisma, associationRoleCode)
  if (!associationRoleId) {
    return { error: "Rôle association invalide." }
  }

  // 1. Créer le compte utilisateur (Better Auth)
  let createdUserId: string
  try {
    const created = await auth.api.createUser({
      body: { name: `${firstName} ${lastName}`, email, password, role: role as "admin" | "user" },
      headers: await headers(),
    })
    createdUserId = created.user.id
  } catch {
    return { error: "Un compte avec cet email existe déjà." }
  }

  // 2. Créer la Person + TeamMember (avec rollback User si échec)
  try {
    const imageId = await resolveImageId(formData)

    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        userId: createdUserId,
        roleId: associationRoleId,
      },
    })

    await prisma.teamMember.create({
      data: { personId: person.id, description, imageId, order, showOnSite },
    })

    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch {
    // Rollback : supprimer le User si la création Person/TeamMember a échoué
    try {
      await auth.api.removeUser({ body: { userId: createdUserId }, headers: await headers() })
    } catch { /* non-bloquant */ }
    return { error: "Erreur lors de la création du membre." }
  }
}

// ── Modifier un membre de l'équipe ─────────────────────────────────────────────

export async function updateMembreEquipe(id: string, formData: FormData) {
  await requireBureau()

  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) return { error: "Membre introuvable." }

  const person = await prisma.person.findUnique({ where: { id: member.personId } })
  if (!person) return { error: "Personne introuvable." }

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const phone       = formData.get("phone")     as string
  const role        = (formData.get("role") as string)?.trim() || null
  const associationRoleCode = (formData.get("associationRoleCode") as string | null)?.trim() || null
  const description = (formData.get("description") as string | null)?.trim() || null
  const order       = parseInt(formData.get("order") as string) || 0
  const showOnSite  = formData.get("showOnSite") !== "false"

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  if (!associationRoleCode) {
    return { error: "Veuillez sélectionner un rôle dans le bureau." }
  }

  const associationRoleId = await getRoleIdByCode(prisma, associationRoleCode)
  if (!associationRoleId) {
    return { error: "Rôle association invalide." }
  }

  try {
    const imageId = await resolveImageId(formData, member.imageId)

    // Mettre à jour le nom + rôle dans le compte User si lié
    if (person.userId) {
      await prisma.user.update({
        where: { id: person.userId },
        data: { name: `${firstName} ${lastName}` },
      })
      if (role) {
        await auth.api.setRole({
          body: { userId: person.userId, role: role as "admin" | "user" },
          headers: await headers(),
        })
      }
    }

    await prisma.person.update({
      where: { id: member.personId },
      data: { firstName, lastName, phone, roleId: associationRoleId },
    })

    await prisma.teamMember.update({
      where: { id },
      data: { description, imageId, order, showOnSite },
    })

    await deleteSupersededPublicId({
      previousPublicId: member.imageId,
      nextPublicId: imageId,
      resourceType: "image",
    })

    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la mise à jour du membre." }
  }
}

// ── Changer le mot de passe d'un membre ───────────────────────────────────────

export async function changePasswordEquipe(userId: string, newPassword: string) {
  await requireAdmin()
  try {
    await auth.api.setUserPassword({
      body: { newPassword, userId },
      headers: await headers(),
    })
    // Révoquer toutes les sessions actives → déconnexion forcée
    await prisma.session.deleteMany({ where: { userId } })
    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors du changement de mot de passe." }
  }
}

// ── Bannir / débannir un compte lié ───────────────────────────────────────────

export async function banUserEquipe(userId: string) {
  await requireAdmin()
  await auth.api.banUser({ body: { userId }, headers: await headers() })
  revalidatePath("/bureau/equipe")
}

export async function unbanUserEquipe(userId: string) {
  await requireAdmin()
  await auth.api.unbanUser({ body: { userId }, headers: await headers() })
  revalidatePath("/bureau/equipe")
}

// ── Supprimer un membre de l'équipe ────────────────────────────────────────────
// Cascade : TeamMember → Person → User (Better Auth)

export async function deleteMembreEquipe(id: string) {
  await requireAdmin()

  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
      select: {
        personId: true,
        imageId: true,
      },
    })
    if (!member) return { error: "Membre introuvable." }

    const person = await prisma.person.findUnique({ where: { id: member.personId } })
    const userId = person?.userId ?? null

    await prisma.teamMember.delete({ where: { id } })
    await prisma.person.delete({ where: { id: member.personId } })

    if (member.imageId) {
      await safeDestroyCloudinaryAsset(member.imageId, "image")
    }

    if (userId) {
      try {
        await auth.api.removeUser({ body: { userId }, headers: await headers() })
      } catch { /* non-bloquant */ }
    }

    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la suppression du membre." }
  }
}

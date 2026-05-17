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
import { requireAdmin, requireBureauAdminEquipe } from "@/lib/auth-guard"
import { getPosteIdByCode } from "@/helpers/poste-helpers"
import { syncUserDisplayNameFromPerson, unlinkPersonFromDashboardUser } from "@/helpers/dashboard-user-person"

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
// Flux : Person → TeamMember → Volunteer (sans compte dashboard)

export async function createMembreEquipe(formData: FormData) {
  await requireAdmin()

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const email       = (formData.get("email") as string)?.trim() || null
  const phone       = formData.get("phone")     as string
  const posteCode = (formData.get("posteCode") as string | null)?.trim() || null
  const description = (formData.get("description") as string | null)?.trim() || null
  const order       = parseInt(formData.get("order") as string) || 0
  const showOnSite  = formData.get("showOnSite") !== "false"

  if (!firstName || !lastName || !email || !phone) {
    return { error: "Tous les champs obligatoires doivent être remplis." }
  }

  if (!posteCode) {
    return { error: "Veuillez sélectionner un poste dans le bureau." }
  }

  const posteId = await getPosteIdByCode(prisma, posteCode)
  if (!posteId) {
    return { error: "Poste invalide." }
  }

  try {
    const imageId = await resolveImageId(formData)

    await prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          posteId,
        },
      })

      await tx.teamMember.create({
        data: { personId: person.id, description, imageId, order, showOnSite },
      })

      await tx.volunteer.upsert({
        where: { personId: person.id },
        create: { personId: person.id },
        update: {},
      })
    })

    revalidatePath("/bureau/equipe")
    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la création du membre." }
  }
}

// ── Modifier un membre de l'équipe ─────────────────────────────────────────────

export async function updateMembreEquipe(id: string, formData: FormData) {
  await requireBureauAdminEquipe()

  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) return { error: "Membre introuvable." }

  const person = await prisma.person.findUnique({ where: { id: member.personId } })
  if (!person) return { error: "Personne introuvable." }

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const phone       = formData.get("phone")     as string
  const posteCode = (formData.get("posteCode") as string | null)?.trim() || null
  const description = (formData.get("description") as string | null)?.trim() || null
  const order       = parseInt(formData.get("order") as string) || 0
  const showOnSite  = formData.get("showOnSite") !== "false"

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  if (!posteCode) {
    return { error: "Veuillez sélectionner un poste dans le bureau." }
  }

  const posteId = await getPosteIdByCode(prisma, posteCode)
  if (!posteId) {
    return { error: "Poste invalide." }
  }

  try {
    const imageId = await resolveImageId(formData, member.imageId)

    if (person.userId) {
      await syncUserDisplayNameFromPerson(prisma, person.userId, firstName, lastName)
    }

    await prisma.person.update({
      where: { id: member.personId },
      data: { firstName, lastName, phone, posteId },
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

// ── Supprimer un membre de l'équipe ────────────────────────────────────────────
// Supprime TeamMember + Person (+ Volunteer). Révoque le User si la personne avait un accès.

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

    await prisma.volunteer.deleteMany({ where: { personId: member.personId } })
    await prisma.teamMember.delete({ where: { id } })
    await prisma.person.delete({ where: { id: member.personId } })

    if (member.imageId) {
      await safeDestroyCloudinaryAsset(member.imageId, "image")
    }

    if (userId) {
      try {
        await unlinkPersonFromDashboardUser(prisma, userId)
        await auth.api.removeUser({ body: { userId }, headers: await headers() })
      } catch { /* non-bloquant */ }
    }

    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la suppression du membre." }
  }
}

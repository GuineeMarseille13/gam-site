"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import { requireBureau } from "@/lib/auth-guard"

// ── Mettre à jour le profil ────────────────────────────────────────────────────

export async function updateProfil(formData: FormData) {
  const session = await requireBureau()
  const userId = session.user.id

  const firstName   = (formData.get("firstName") as string)?.trim()
  const lastName    = (formData.get("lastName")  as string)?.trim()
  const phone       = (formData.get("phone")     as string | null)?.trim() || ""
  const imageFile   = formData.get("imageFile")  as File | null
  const removeImage = formData.get("removeImage") === "true"

  if (!firstName || !lastName) {
    return { error: "Le prénom et le nom sont requis." }
  }

  try {
    // 1. Mettre à jour le nom dans le compte User
    await prisma.user.update({
      where: { id: userId },
      data: { name: `${firstName} ${lastName}` },
    })

    // 2. Résoudre l'image
    let imageUrl: string | null | undefined = undefined
    if (removeImage) {
      imageUrl = null
    } else if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    // 3. Mettre à jour (ou créer) la Person liée
    const existing = await prisma.person.findUnique({ where: { userId } })

    if (existing) {
      await prisma.person.update({
        where: { userId },
        data: {
          firstName,
          lastName,
          phone,
          ...(imageUrl !== undefined ? { image: imageUrl } : {}),
        },
      })
    } else {
      // Créer la Person si elle n'existe pas encore
      const user = await prisma.user.findUnique({ where: { id: userId } })
      await prisma.person.create({
        data: {
          firstName,
          lastName,
          email: user?.email ?? "",
          phone,
          userId,
          image: imageUrl ?? null,
        },
      })
    }

    revalidatePath("/bureau/profil")
    revalidatePath("/bureau")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la mise à jour du profil." }
  }
}

// ── Changer son propre mot de passe ────────────────────────────────────────────

export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  await requireBureau()
  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: true },
      headers: await headers(),
    })
    return { success: true as const }
  } catch {
    return { error: "Mot de passe actuel incorrect ou erreur serveur." }
  }
}

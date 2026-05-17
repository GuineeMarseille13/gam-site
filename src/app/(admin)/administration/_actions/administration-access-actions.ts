"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { updateAdministrationAccessSchema } from "../_schemas/administration-access.schema"

const ACCES_PATH = "/administration/acces"

export type AdministrationAccessActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

function revalidateAccesHub() {
  revalidatePath(ACCES_PATH)
  revalidatePath("/administration")
  revalidatePath("/bureau/membres")
}

/**
 * Supprime un compte rôle administration et la Person liée.
 */
export async function deleteAdministrationAccessUser(userId: string): Promise<AdministrationAccessActionResult> {
  try {
    const session = await requireAdmin()
    if (session.user.id === userId) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." }
    }
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const permanenceRoles = ["ADMIN-PERMADMIN", "PERMADMIN", "INVITE-PERMADMIN"] as const
  if (!user || !permanenceRoles.includes(user.role as (typeof permanenceRoles)[number])) {
    return { success: false, error: "Compte introuvable ou rôle incorrect." }
  }

  try {
    const person = await prisma.person.findUnique({
      where: { userId },
      select: { id: true, image: true },
    })
    if (person) {
      if (person.image) {
        await deleteSupersededCloudinaryUrl({
          previousUrl: person.image,
          nextUrl: null,
        })
      }
      await prisma.person.delete({ where: { id: person.id } })
    }
    await auth.api.removeUser({ body: { userId }, headers: await headers() })
    revalidateAccesHub()
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors de la suppression." }
  }
}

/**
 * Met à jour profil Person + identifiants User (email, nom, mot de passe optionnel).
 */
export async function updateAdministrationAccessUser(
  userId: string,
  formData: FormData,
): Promise<AdministrationAccessActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const permanenceRoles = ["ADMIN-PERMADMIN", "PERMADMIN", "INVITE-PERMADMIN"] as const
  if (!user || !permanenceRoles.includes(user.role as (typeof permanenceRoles)[number])) {
    return { success: false, error: "Compte introuvable ou rôle incorrect." }
  }

  const parsed = updateAdministrationAccessSchema.safeParse({
    firstName: (formData.get("firstName") as string)?.trim(),
    lastName: (formData.get("lastName") as string)?.trim(),
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    phone: (formData.get("phone") as string)?.trim(),
    description: ((formData.get("description") as string) ?? "").trim() || undefined,
    password: (formData.get("password") as string) || undefined,
    confirmPassword: (formData.get("confirmPassword") as string) || undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { firstName, lastName, email, phone, description } = parsed.data
  const newPassword = parsed.data.password?.length ? parsed.data.password : undefined
  const imageFile = formData.get("imageFile") as File | null

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${firstName} ${lastName}`,
        email,
      },
    })

    let imageUrl: string | null | undefined
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    const existing = await prisma.person.findUnique({ where: { userId } })
    if (existing) {
      await prisma.person.update({
        where: { userId },
        data: {
          firstName,
          lastName,
          email,
          phone,
          description: description ?? null,
          ...(imageUrl !== undefined ? { image: imageUrl } : {}),
        },
      })
    } else {
      await prisma.person.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          userId,
          description: description ?? null,
          image: imageUrl ?? null,
          showOnSite: true,
        },
      })
    }

    if (imageUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing?.image,
        nextUrl: imageUrl ?? null,
      })
    }

    if (newPassword) {
      await auth.api.setUserPassword({
        body: { userId, newPassword },
        headers: await headers(),
      })
      await prisma.session.deleteMany({ where: { userId } })
    }

    revalidateAccesHub()
    revalidatePath(`${ACCES_PATH}/${userId}/modifier`)
    return { success: true }
  } catch (err) {
    console.error("[updateAdministrationAccessUser]", err)
    return { success: false, error: "Erreur lors de l'enregistrement. Vérifiez l'email ou réessayez." }
  }
}

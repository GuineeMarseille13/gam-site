"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"
import { createAdministrationAccountSchema } from "../_schemas/create-administration-account.schema"

export type CreateAdministrationAccountResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/**
 * Crée un User Better Auth (mot de passe), définit le rôle `administration`,
 * puis une Person liée (sans TeamMember — profil hors équipe dirigeante).
 */
export async function createAdministrationAccount(
  formData: FormData,
): Promise<CreateAdministrationAccountResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const parsed = createAdministrationAccountSchema.safeParse({
    firstName: (formData.get("firstName") as string)?.trim(),
    lastName: (formData.get("lastName") as string)?.trim(),
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    phone: (formData.get("phone") as string)?.trim(),
    description: ((formData.get("description") as string) ?? "").trim() || undefined,
  })

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      error: "Vérifiez les champs du formulaire.",
      fieldErrors,
    }
  }

  const { firstName, lastName, email, password, phone, description } = parsed.data
  const imageFile = formData.get("imageFile") as File | null

  let createdUserId: string | undefined

  try {
    const created = await auth.api.createUser({
      body: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: "user",
      },
      headers: await headers(),
    })
    createdUserId = created.user.id
  } catch {
    return { success: false, error: "Un compte existe déjà avec cet email ou la création a échoué." }
  }

  try {
    await prisma.user.update({
      where: { id: createdUserId },
      data: { role: "administration" },
    })

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        userId: createdUserId,
        image: imageUrl,
        description: description ?? null,
        showOnSite: true,
      },
    })

    revalidatePath("/administration")
    revalidatePath("/administration/acces")
    revalidatePath("/bureau/membres")
    return { success: true }
  } catch (err) {
    console.error("[createAdministrationAccount] Erreur Prisma:", err)
    if (createdUserId) {
      try {
        await auth.api.removeUser({ body: { userId: createdUserId }, headers: await headers() })
      } catch {
        /* rollback best-effort */
      }
    }
    return { success: false, error: "Erreur lors de l'enregistrement du profil. Réessayez." }
  }
}

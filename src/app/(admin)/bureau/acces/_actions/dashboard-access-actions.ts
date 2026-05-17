"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-guard"
import {
  buildUserDisplayName,
  linkPersonToDashboardUser,
  unlinkPersonFromDashboardUser,
} from "@/helpers/dashboard-user-person"
import {
  createDashboardAccessSchema,
  updateDashboardAccessSchema,
} from "../_schemas/dashboard-access.schema"

const ACCES_PATH = "/bureau/acces"

export type DashboardAccessActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

function revalidateAccesHub() {
  revalidatePath(ACCES_PATH)
  revalidatePath("/bureau/membres")
  revalidatePath("/bureau/equipe")
}

/**
 * Lie une personne existante à un compte Better Auth (rôle + mot de passe).
 */
export async function createDashboardAccess(
  formData: FormData,
): Promise<DashboardAccessActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const parsed = createDashboardAccessSchema.safeParse({
    personId: (formData.get("personId") as string)?.trim(),
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    role: (formData.get("role") as string)?.trim(),
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  })

  if (!parsed.success) {
    return {
      success: false,
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { personId, email, role, password } = parsed.data

  const person = await prisma.person.findUnique({ where: { id: personId } })
  if (!person) {
    return { success: false, error: "Personne introuvable." }
  }
  if (person.userId) {
    return { success: false, error: "Cette personne a déjà un accès dashboard." }
  }

  const emailTaken = await prisma.user.findFirst({ where: { email } })
  if (emailTaken) {
    return { success: false, error: "Un compte existe déjà avec cet email." }
  }

  let createdUserId: string | undefined

  try {
    const created = await auth.api.createUser({
      body: {
        name: buildUserDisplayName(person.firstName, person.lastName),
        email,
        password,
        role: "user",
      },
      headers: await headers(),
    })
    createdUserId = created.user.id
    const newUserId = createdUserId

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: newUserId }, data: { role } })
      await linkPersonToDashboardUser(tx, personId, newUserId, email)
    })

    revalidateAccesHub()
    return { success: true }
  } catch (err) {
    console.error("[createDashboardAccess]", err)
    if (createdUserId) {
      try {
        await auth.api.removeUser({ body: { userId: createdUserId }, headers: await headers() })
      } catch {
        /* rollback best-effort */
      }
    }
    return { success: false, error: "Création de l'accès impossible. Vérifiez l'email ou réessayez." }
  }
}

/**
 * Met à jour le rôle, l’email de connexion et éventuellement le mot de passe.
 */
export async function updateDashboardAccess(
  userId: string,
  formData: FormData,
): Promise<DashboardAccessActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const parsed = updateDashboardAccessSchema.safeParse({
    role: (formData.get("role") as string)?.trim(),
    email: (formData.get("email") as string)?.trim().toLowerCase(),
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

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return { success: false, error: "Compte introuvable." }
  }

  const { role, email } = parsed.data
  const newPassword = parsed.data.password?.length ? parsed.data.password : undefined

  const emailConflict = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
  })
  if (emailConflict) {
    return { success: false, error: "Cet email est déjà utilisé par un autre compte." }
  }

  try {
    const person = await prisma.person.findUnique({ where: { userId } })

    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        email,
        ...(person
          ? { name: buildUserDisplayName(person.firstName, person.lastName) }
          : {}),
      },
    })

    if (person) {
      await prisma.person.update({
        where: { id: person.id },
        data: { email },
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
    console.error("[updateDashboardAccess]", err)
    return { success: false, error: "Erreur lors de l'enregistrement." }
  }
}

/**
 * Bannit un compte dashboard (connexion impossible, fiche Person conservée).
 */
export async function banDashboardAccess(userId: string): Promise<DashboardAccessActionResult> {
  try {
    const session = await requireAdmin()
    if (session.user.id === userId) {
      return { success: false, error: "Vous ne pouvez pas bannir votre propre compte." }
    }
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  try {
    await auth.api.banUser({ body: { userId }, headers: await headers() })
    revalidateAccesHub()
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors du bannissement." }
  }
}

/**
 * Réactive un compte dashboard précédemment banni.
 */
export async function unbanDashboardAccess(userId: string): Promise<DashboardAccessActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  try {
    await auth.api.unbanUser({ body: { userId }, headers: await headers() })
    revalidateAccesHub()
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors du débannissement." }
  }
}

/**
 * Révoque l’accès dashboard sans supprimer la fiche Person.
 */
export async function revokeDashboardAccess(userId: string): Promise<DashboardAccessActionResult> {
  try {
    const session = await requireAdmin()
    if (session.user.id === userId) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre accès." }
    }
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  try {
    await unlinkPersonFromDashboardUser(prisma, userId)
    await auth.api.removeUser({ body: { userId }, headers: await headers() })
    revalidateAccesHub()
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors de la révocation de l'accès." }
  }
}

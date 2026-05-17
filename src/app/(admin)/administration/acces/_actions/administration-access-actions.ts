"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdminAcces } from "@/lib/auth-guard"
import { PERMANENCE_ADMIN_ROLE_CODES } from "@/config/system-roles"
import {
  buildUserDisplayName,
  linkPersonToDashboardUser,
  unlinkPersonFromDashboardUser,
} from "@/helpers/dashboard-user-person"
import {
  createAdministrationAccessSchema,
  updateAdministrationAccessSchema,
} from "../_schemas/administration-access.schema"

const ACCES_PATH = "/administration/acces"

export type AdministrationAccessActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

function revalidateAccesHub() {
  revalidatePath(ACCES_PATH)
  revalidatePath("/administration")
  revalidatePath("/bureau/membres")
}

function isPermanenceAdminRole(role: string | null | undefined): boolean {
  return (PERMANENCE_ADMIN_ROLE_CODES as readonly string[]).includes(role ?? "")
}

/**
 * Lie une personne existante à un compte permanence administrative (rôle + mot de passe).
 */
export async function createAdministrationAccess(
  formData: FormData,
): Promise<AdministrationAccessActionResult> {
  try {
    await requireAdminAcces()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const parsed = createAdministrationAccessSchema.safeParse({
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

  const roleExists = await prisma.role.findFirst({
    where: { code: role, isActive: true },
  })
  if (!roleExists) {
    return { success: false, error: "Rôle invalide ou indisponible." }
  }

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
    console.error("[createAdministrationAccess]", err)
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
export async function updateAdministrationAccess(
  userId: string,
  formData: FormData,
): Promise<AdministrationAccessActionResult> {
  try {
    await requireAdminAcces()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const parsed = updateAdministrationAccessSchema.safeParse({
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
  if (!user || !isPermanenceAdminRole(user.role)) {
    return { success: false, error: "Compte introuvable ou rôle incorrect." }
  }

  const { role, email } = parsed.data
  const newPassword = parsed.data.password?.length ? parsed.data.password : undefined

  const roleExists = await prisma.role.findFirst({
    where: { code: role, isActive: true },
  })
  if (!roleExists) {
    return { success: false, error: "Rôle invalide ou indisponible." }
  }

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
    console.error("[updateAdministrationAccess]", err)
    return { success: false, error: "Erreur lors de l'enregistrement." }
  }
}

/**
 * Suspend un compte permanence administrative (connexion impossible).
 */
export async function banAdministrationAccess(
  userId: string,
): Promise<AdministrationAccessActionResult> {
  try {
    const session = await requireAdminAcces()
    if (session.user.id === userId) {
      return { success: false, error: "Vous ne pouvez pas suspendre votre propre compte." }
    }
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !isPermanenceAdminRole(user.role)) {
    return { success: false, error: "Compte introuvable." }
  }

  try {
    await auth.api.banUser({ body: { userId }, headers: await headers() })
    revalidateAccesHub()
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors de la suspension." }
  }
}

/**
 * Réactive un compte permanence administrative précédemment suspendu.
 */
export async function unbanAdministrationAccess(
  userId: string,
): Promise<AdministrationAccessActionResult> {
  try {
    await requireAdminAcces()
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !isPermanenceAdminRole(user.role)) {
    return { success: false, error: "Compte introuvable." }
  }

  try {
    await auth.api.unbanUser({ body: { userId }, headers: await headers() })
    revalidateAccesHub()
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors de la réactivation." }
  }
}

/**
 * Révoque l’accès sans supprimer la fiche Person.
 */
export async function revokeAdministrationAccess(
  userId: string,
): Promise<AdministrationAccessActionResult> {
  try {
    const session = await requireAdminAcces()
    if (session.user.id === userId) {
      return { success: false, error: "Vous ne pouvez pas révoquer votre propre accès." }
    }
  } catch {
    return { success: false, error: "Accès réservé aux administrateurs." }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !isPermanenceAdminRole(user.role)) {
    return { success: false, error: "Compte introuvable." }
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

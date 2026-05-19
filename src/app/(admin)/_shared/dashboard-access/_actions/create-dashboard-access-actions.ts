import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import type { DashboardAccessActionResult } from "../_types/dashboard-access-row"
import {
  buildUserDisplayName,
  linkPersonToDashboardUser,
  unlinkPersonFromDashboardUser,
} from "@/helpers/dashboard-user-person"

function revalidateAccesHub(scope: DashboardAccessScope) {
  revalidatePath(scope.accesPath)
  revalidatePath(scope.basePath)
  revalidatePath("/bureau/membres")
}

function isScopeRole(scope: DashboardAccessScope, role: string | null | undefined): boolean {
  return (scope.roleCodes as readonly string[]).includes(role ?? "")
}

/**
 * Factory des server actions CRUD accès pour un périmètre dashboard.
 */
export function createDashboardAccessActions(scope: DashboardAccessScope) {
  async function createAccess(formData: FormData): Promise<DashboardAccessActionResult> {
    try {
      await scope.requireAcces()
    } catch {
      return { success: false, error: "Accès réservé aux administrateurs." }
    }

    const parsed = scope.schemas.createSchema.safeParse({
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

    const roleCode = String(role)

    const roleExists = await prisma.role.findFirst({
      where: { code: roleCode, isActive: true },
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
        await tx.user.update({ where: { id: newUserId }, data: { role: roleCode } })
        await linkPersonToDashboardUser(tx, personId, newUserId, email)
      })

      revalidateAccesHub(scope)
      return { success: true }
    } catch (err) {
      console.error(`[createDashboardAccess:${scope.id}]`, err)
      if (createdUserId) {
        try {
          await auth.api.removeUser({ body: { userId: createdUserId }, headers: await headers() })
        } catch {
          /* rollback best-effort */
        }
      }
      return {
        success: false,
        error: "Création de l'accès impossible. Vérifiez l'email ou réessayez.",
      }
    }
  }

  async function updateAccess(
    userId: string,
    formData: FormData,
  ): Promise<DashboardAccessActionResult> {
    try {
      await scope.requireAcces()
    } catch {
      return { success: false, error: "Accès réservé aux administrateurs." }
    }

    const parsed = scope.schemas.updateSchema.safeParse({
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
    if (!user || !isScopeRole(scope, user.role)) {
      return { success: false, error: "Compte introuvable ou rôle incorrect." }
    }

    const { role, email } = parsed.data
    const roleCode = String(role)
    const newPassword = parsed.data.password?.length ? parsed.data.password : undefined

    const roleExists = await prisma.role.findFirst({
      where: { code: roleCode, isActive: true },
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
          role: roleCode,
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

      revalidateAccesHub(scope)
      revalidatePath(`${scope.accesPath}/${userId}/modifier`)
      return { success: true }
    } catch (err) {
      console.error(`[updateDashboardAccess:${scope.id}]`, err)
      return { success: false, error: "Erreur lors de l'enregistrement." }
    }
  }

  async function banAccess(userId: string): Promise<DashboardAccessActionResult> {
    try {
      const session = await scope.requireAcces()
      if (session.user.id === userId) {
        return { success: false, error: "Vous ne pouvez pas suspendre votre propre compte." }
      }
    } catch {
      return { success: false, error: "Accès réservé aux administrateurs." }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !isScopeRole(scope, user.role)) {
      return { success: false, error: "Compte introuvable." }
    }

    try {
      await auth.api.banUser({ body: { userId }, headers: await headers() })
      revalidateAccesHub(scope)
      return { success: true }
    } catch {
      return { success: false, error: "Erreur lors de la suspension." }
    }
  }

  async function unbanAccess(userId: string): Promise<DashboardAccessActionResult> {
    try {
      await scope.requireAcces()
    } catch {
      return { success: false, error: "Accès réservé aux administrateurs." }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !isScopeRole(scope, user.role)) {
      return { success: false, error: "Compte introuvable." }
    }

    try {
      await auth.api.unbanUser({ body: { userId }, headers: await headers() })
      revalidateAccesHub(scope)
      return { success: true }
    } catch {
      return { success: false, error: "Erreur lors de la réactivation." }
    }
  }

  async function revokeAccess(userId: string): Promise<DashboardAccessActionResult> {
    try {
      const session = await scope.requireAcces()
      if (session.user.id === userId) {
        return { success: false, error: "Vous ne pouvez pas révoquer votre propre accès." }
      }
    } catch {
      return { success: false, error: "Accès réservé aux administrateurs." }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !isScopeRole(scope, user.role)) {
      return { success: false, error: "Compte introuvable." }
    }

    try {
      await unlinkPersonFromDashboardUser(prisma, userId)
      await auth.api.removeUser({ body: { userId }, headers: await headers() })
      revalidateAccesHub(scope)
      return { success: true }
    } catch {
      return { success: false, error: "Erreur lors de la révocation de l'accès." }
    }
  }

  return {
    createAccess,
    updateAccess,
    banAccess,
    unbanAccess,
    revokeAccess,
  }
}

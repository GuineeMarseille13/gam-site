import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { requireAuthenticatedDashboardUser } from "@/lib/auth-guard"
import { changeOwnPasswordSchema } from "../_schemas/change-password.schema"
import { updateProfilSchema } from "../_schemas/update-profil.schema"
import { resolveProfilLoginPath } from "../_helpers/resolve-profil-login-path"
import type { ProfilDashboardScope } from "../_types/profil-dashboard-scope"
import type { ProfilActionResult } from "../_types/profil-action-result"

const PROFIL_REVALIDATE_PATHS = [
  "/bureau/profil",
  "/administration/profil",
  "/hebergement-relation/profil",
  "/bureau",
  "/administration",
  "/hebergement-relation",
] as const

function revalidateProfilPaths(): void {
  for (const path of PROFIL_REVALIDATE_PATHS) {
    revalidatePath(path)
  }
}

/** Termine la session courante et renvoie la page de connexion adaptée. */
async function finalizeProfilReauth(
  dashboardScope: ProfilDashboardScope,
  userId?: string,
): Promise<ProfilActionResult> {
  const loginPath = resolveProfilLoginPath(dashboardScope)
  const requestHeaders = await headers()

  if (userId) {
    await prisma.session.deleteMany({ where: { userId } })
  }

  await auth.api.signOut({ headers: requestHeaders })

  return { success: true, requiresReauth: true, loginPath }
}

/** Met à jour les informations personnelles de l’utilisateur connecté. */
export async function mutateUpdateProfil(
  formData: FormData,
  dashboardScope: ProfilDashboardScope,
): Promise<ProfilActionResult> {
  const session = await requireAuthenticatedDashboardUser()
  const userId = session.user.id

  const parsed = updateProfilSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    removeImage: formData.get("removeImage") === "true",
  })

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Données invalides."
    return { error: message }
  }

  const { firstName, lastName, email, phone, removeImage } = parsed.data
  const imageFile = formData.get("imageFile") as File | null
  const currentEmail = session.user.email.trim().toLowerCase()
  const emailChanged = email !== currentEmail

  if (emailChanged) {
    const emailConflict = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    })
    if (emailConflict) {
      return { error: "Cet email est déjà utilisé par un autre compte." }
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${firstName} ${lastName}`,
        ...(emailChanged ? { email } : {}),
      },
    })

    let imageUrl: string | null | undefined = undefined
    if (removeImage) {
      imageUrl = null
    } else if (imageFile && imageFile.size > 0) {
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
          phone,
          ...(emailChanged ? { email } : {}),
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
          image: imageUrl ?? null,
        },
      })
    }

    if (imageUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing?.image,
        nextUrl: imageUrl ?? null,
      })
    }

    revalidateProfilPaths()

    if (emailChanged) {
      return finalizeProfilReauth(dashboardScope, userId)
    }

    return { success: true }
  } catch {
    return { error: "Erreur lors de la mise à jour du profil." }
  }
}

/**
 * Change le mot de passe, révoque les autres sessions Better Auth,
 * puis termine la session courante (reconnexion obligatoire).
 */
export async function mutateChangeOwnPassword(
  currentPassword: string,
  newPassword: string,
  dashboardScope: ProfilDashboardScope,
): Promise<ProfilActionResult> {
  await requireAuthenticatedDashboardUser()

  const parsed = changeOwnPasswordSchema.safeParse({ currentPassword, newPassword })
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Données invalides."
    return { error: message }
  }

  const requestHeaders = await headers()

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders,
    })

    return finalizeProfilReauth(dashboardScope)
  } catch {
    return { error: "Mot de passe actuel incorrect ou erreur serveur." }
  }
}

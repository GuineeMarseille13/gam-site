import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { requireAuthenticatedDashboardUser } from "@/lib/auth-guard"
import { changeOwnPasswordSchema } from "../_schemas/change-password.schema"
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

/** Met à jour les informations personnelles de l’utilisateur connecté. */
export async function mutateUpdateProfil(formData: FormData): Promise<ProfilActionResult> {
  const session = await requireAuthenticatedDashboardUser()
  const userId = session.user.id

  const firstName = (formData.get("firstName") as string)?.trim()
  const lastName = (formData.get("lastName") as string)?.trim()
  const phone = (formData.get("phone") as string | null)?.trim() || ""
  const imageFile = formData.get("imageFile") as File | null
  const removeImage = formData.get("removeImage") === "true"

  if (!firstName || !lastName) {
    return { error: "Le prénom et le nom sont requis." }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: `${firstName} ${lastName}` },
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
          ...(imageUrl !== undefined ? { image: imageUrl } : {}),
        },
      })
    } else {
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

    if (imageUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing?.image,
        nextUrl: imageUrl ?? null,
      })
    }

    revalidateProfilPaths()
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

  const loginPath = resolveProfilLoginPath(dashboardScope)
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

    await auth.api.signOut({
      headers: requestHeaders,
    })

    return { success: true, requiresReauth: true, loginPath }
  } catch {
    return { error: "Mot de passe actuel incorrect ou erreur serveur." }
  }
}

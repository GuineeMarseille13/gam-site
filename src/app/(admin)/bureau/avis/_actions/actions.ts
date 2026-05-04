"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { prisma } from "@/lib/prisma"
import { requireBureau } from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { getRoleIdByCode } from "@/helpers/association-role-helpers"
import {
  formatAvisFormErrorMessage,
  parseAvisFormFields,
} from "../_schemas/avis-form.schema"

export type AvisActionState = { error: string } | null

const REVALIDATE_PATHS = ["/bureau/avis", "/"] as const

async function resolveAvatarUrl(
  formData: FormData,
  existingUrl: string | null,
): Promise<string | null> {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, "gam/reviews")
    return result.url
  }
  if (formData.get("removeAvatar") === "on") {
    return null
  }
  const urlInput = (formData.get("avatarUrl") as string | null)?.trim() ?? ""
  if (urlInput.length > 0) return urlInput
  const hiddenExisting = (formData.get("existingAvatarUrl") as string | null)?.trim() ?? ""
  if (hiddenExisting.length > 0) return hiddenExisting
  return existingUrl
}

async function defaultReviewSectionId(): Promise<string | null> {
  const row = await prisma.reviewSection.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  })
  return row?.id ?? null
}

export async function createAvis(
  _prev: AvisActionState,
  formData: FormData,
): Promise<AvisActionState> {
  await requireBureau()
  const parsed = parseAvisFormFields(formData)
  if (!parsed.success) {
    return { error: formatAvisFormErrorMessage(parsed.error) }
  }

  const roleId = await getRoleIdByCode(prisma, parsed.data.roleCode)
  if (!roleId) {
    return { error: "Rôle inconnu ou inactif." }
  }

  try {
    const avatarUrl = await resolveAvatarUrl(formData, null)
    const reviewSectionId = await defaultReviewSectionId()
    const publishedAt =
      parsed.data.isVerified ? new Date() : null

    await prisma.review.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        roleId,
        body: parsed.data.body,
        country: parsed.data.country,
        rating: parsed.data.rating,
        order: parsed.data.order,
        isActive: parsed.data.isActive,
        isVerified: parsed.data.isVerified,
        avatarUrl,
        reviewSectionId,
        publishedAt,
      },
    })

    REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
    redirect("/bureau/avis")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createAvis]", err)
    return { error: err instanceof Error ? err.message : "Erreur lors de l’enregistrement" }
  }
}

export async function updateAvis(
  id: string,
  _prev: AvisActionState,
  formData: FormData,
): Promise<AvisActionState> {
  await requireBureau()
  const parsed = parseAvisFormFields(formData)
  if (!parsed.success) {
    return { error: formatAvisFormErrorMessage(parsed.error) }
  }

  const roleId = await getRoleIdByCode(prisma, parsed.data.roleCode)
  if (!roleId) {
    return { error: "Rôle inconnu ou inactif." }
  }

  const existing = await prisma.review.findUnique({
    where: { id },
    select: { avatarUrl: true, publishedAt: true },
  })
  if (!existing) {
    return { error: "Avis introuvable." }
  }

  try {
    const avatarUrl = await resolveAvatarUrl(formData, existing.avatarUrl)
    const publishedAt = parsed.data.isVerified
      ? (existing.publishedAt ?? new Date())
      : null

    await prisma.review.update({
      where: { id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        roleId,
        body: parsed.data.body,
        country: parsed.data.country,
        rating: parsed.data.rating,
        order: parsed.data.order,
        isActive: parsed.data.isActive,
        isVerified: parsed.data.isVerified,
        avatarUrl,
        publishedAt,
      },
    })

    await deleteSupersededCloudinaryUrl({
      previousUrl: existing.avatarUrl,
      nextUrl: avatarUrl,
    })

    REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
    redirect("/bureau/avis")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updateAvis]", err)
    return { error: err instanceof Error ? err.message : "Erreur lors de l’enregistrement" }
  }
}

export async function deleteAvis(id: string) {
  await requireBureau()
  const existing = await prisma.review.findUnique({
    where: { id },
    select: { avatarUrl: true },
  })
  await prisma.review.delete({ where: { id } })

  await deleteSupersededCloudinaryUrl({
    previousUrl: existing?.avatarUrl,
    nextUrl: null,
  })

  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
}

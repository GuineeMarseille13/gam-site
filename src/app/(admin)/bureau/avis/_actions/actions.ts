"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { prisma } from "@/lib/prisma"
import { requireBureauContenu } from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import {
  formatAvisFormErrorMessage,
  parseAvisFormFields,
  resolveAvisSourceFields,
} from "../_schemas/avis-form.schema"

export type AvisActionState = { error: string } | null

const REVALIDATE_PATHS = ["/bureau/avis", "/"] as const

interface ImageFieldNames {
  file: string
  url: string
  existing: string
  remove: string
}

async function resolveImageUrl(
  formData: FormData,
  existingUrl: string | null,
  fields: ImageFieldNames,
  uploadFolder: string,
): Promise<string | null> {
  const file = formData.get(fields.file) as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, uploadFolder)
    return result.url
  }
  if (formData.get(fields.remove) === "on") {
    return null
  }
  const urlInput = (formData.get(fields.url) as string | null)?.trim() ?? ""
  if (urlInput.length > 0) return urlInput
  const hiddenExisting = (formData.get(fields.existing) as string | null)?.trim() ?? ""
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
  await requireBureauContenu()
  const parsed = parseAvisFormFields(formData)
  if (!parsed.success) {
    return { error: formatAvisFormErrorMessage(parsed.error) }
  }

  try {
    const avatarUrl = await resolveImageUrl(formData, null, {
      file: "imageFile",
      url: "avatarUrl",
      existing: "existingAvatarUrl",
      remove: "removeAvatar",
    }, "gam/reviews")

    const sourceImageUrl = await resolveImageUrl(formData, null, {
      file: "sourceImageFile",
      url: "sourceImageUrl",
      existing: "existingSourceImageUrl",
      remove: "removeSourceImage",
    }, "gam/reviews/sources")

    if (parsed.data.sourceType === "image" && !sourceImageUrl) {
      return { error: "Ajoutez un logo ou une URL d’image pour l’origine." }
    }

    const source = resolveAvisSourceFields(
      parsed.data.sourceType,
      parsed.data.sourceLabel,
      sourceImageUrl,
    )

    const reviewSectionId = await defaultReviewSectionId()
    const publishedAt =
      parsed.data.isVerified ? new Date() : null

    await prisma.review.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        body: parsed.data.body,
        rating: parsed.data.rating,
        order: parsed.data.order,
        isActive: parsed.data.isActive,
        isVerified: parsed.data.isVerified,
        avatarUrl,
        sourceLabel: source.sourceLabel,
        sourceImageUrl: source.sourceImageUrl,
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
  await requireBureauContenu()
  const parsed = parseAvisFormFields(formData)
  if (!parsed.success) {
    return { error: formatAvisFormErrorMessage(parsed.error) }
  }

  const existing = await prisma.review.findUnique({
    where: { id },
    select: { avatarUrl: true, sourceImageUrl: true, publishedAt: true },
  })
  if (!existing) {
    return { error: "Avis introuvable." }
  }

  try {
    const avatarUrl = await resolveImageUrl(formData, existing.avatarUrl, {
      file: "imageFile",
      url: "avatarUrl",
      existing: "existingAvatarUrl",
      remove: "removeAvatar",
    }, "gam/reviews")

    const sourceImageUrl = await resolveImageUrl(formData, existing.sourceImageUrl, {
      file: "sourceImageFile",
      url: "sourceImageUrl",
      existing: "existingSourceImageUrl",
      remove: "removeSourceImage",
    }, "gam/reviews/sources")

    if (parsed.data.sourceType === "image" && !sourceImageUrl) {
      return { error: "Ajoutez un logo ou une URL d’image pour l’origine." }
    }

    const source = resolveAvisSourceFields(
      parsed.data.sourceType,
      parsed.data.sourceLabel,
      sourceImageUrl,
    )

    const publishedAt = parsed.data.isVerified
      ? (existing.publishedAt ?? new Date())
      : null

    await prisma.review.update({
      where: { id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        body: parsed.data.body,
        rating: parsed.data.rating,
        order: parsed.data.order,
        isActive: parsed.data.isActive,
        isVerified: parsed.data.isVerified,
        avatarUrl,
        sourceLabel: source.sourceLabel,
        sourceImageUrl: source.sourceImageUrl,
        publishedAt,
      },
    })

    await deleteSupersededCloudinaryUrl({
      previousUrl: existing.avatarUrl,
      nextUrl: avatarUrl,
    })
    await deleteSupersededCloudinaryUrl({
      previousUrl: existing.sourceImageUrl,
      nextUrl: source.sourceImageUrl,
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
  await requireBureauContenu()
  const existing = await prisma.review.findUnique({
    where: { id },
    select: { avatarUrl: true, sourceImageUrl: true },
  })
  await prisma.review.delete({ where: { id } })

  await deleteSupersededCloudinaryUrl({
    previousUrl: existing?.avatarUrl,
    nextUrl: null,
  })
  await deleteSupersededCloudinaryUrl({
    previousUrl: existing?.sourceImageUrl,
    nextUrl: null,
  })

  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
}

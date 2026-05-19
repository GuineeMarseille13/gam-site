"use server"

import { z } from "zod"

import { uploadImage } from "@/lib/cloudinary"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"
import { requirePolePublicContentEdit } from "@/lib/auth-guard"

const MAX_SIZE_BYTES = 10 * 1024 * 1024

const poleSlugSchema = z.string().min(1)

export type UploadPoleAchievementImageState =
  | { error: string }
  | { imageUrl: string }
  | null

/**
 * Upload une image de réalisation vers Cloudinary (bureau pôles).
 */
export async function uploadPoleAchievementImageAction(
  _prev: UploadPoleAchievementImageState,
  formData: FormData,
): Promise<UploadPoleAchievementImageState> {
  const rawSlug = (formData.get("poleSlug") as string) ?? ""

  try {
    await requirePolePublicContentEdit(rawSlug)
  } catch {
    return { error: "Accès non autorisé." }
  }

  const parsedSlug = poleSlugSchema.safeParse(rawSlug)
  if (!parsedSlug.success) {
    return { error: "Slug invalide." }
  }

  const file = formData.get("imageFile")
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Sélectionnez une image." }
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "L’image ne doit pas dépasser 10 Mo." }
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Le fichier doit être une image." }
  }

  try {
    const result = await uploadImage(file, "gam/poles/achievements")
    const imageUrl = cloudinaryImageUrl(
      result.publicId,
      "w_1200,h_900,c_fill,q_auto,f_auto",
    )
    return { imageUrl }
  } catch (error: unknown) {
    console.error("[uploadPoleAchievementImageAction]", error)
    return { error: "Upload impossible. Réessayez." }
  }
}

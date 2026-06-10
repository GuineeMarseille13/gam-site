import { uploadImage } from "@/lib/cloudinary"

const MAX_SIZE_BYTES = 10 * 1024 * 1024

/**
 * Résout l'imageId à partir du FormData (fichier uploadé ou id existant).
 */
export async function resolveAssociationImageId(
  formData: FormData,
  folder: string,
): Promise<string | null> {
  const file = formData.get("imageFile")
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error("L'image ne doit pas dépasser 10 Mo.")
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("Le fichier doit être une image.")
    }
    const result = await uploadImage(file, folder)
    return result.publicId
  }

  const existing = formData.get("imageId")
  if (typeof existing === "string" && existing.trim().length > 0) {
    return existing.trim()
  }

  return null
}

"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { requireBureau } from "@/lib/auth-guard"

export type ActionState = { error: string } | null

// ── Helpers ────────────────────────────────────────────────────────────────────

async function uploadFiles(files: File[]): Promise<string[]> {
  const ids: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    const result = await uploadImage(file, "gam/evenements")
    ids.push(result.publicId)
  }
  return ids
}

async function deleteCloudinaryImages(imageIds: string[]) {
  await Promise.allSettled(imageIds.map((id) => deleteImage(id)))
}

// ── Créer un événement ─────────────────────────────────────────────────────────

export async function createEvenement(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureau()
  try {
    const title       = formData.get("title")       as string
    const description = (formData.get("description") as string) || null
    const location    = (formData.get("location")    as string) || null
    const startDate   = new Date((formData.get("startDate") as string) || "")
    const endDate     = new Date((formData.get("endDate")   as string) || "")
    const published   = formData.get("published") === "true"

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return { error: "Veuillez sélectionner les dates de début et de fin." }
    }

    // Uploader les nouvelles images
    const imageFiles = formData.getAll("imageFiles") as File[]
    const uploadedIds = await uploadFiles(imageFiles)

    // coverImageId = première image uploadée
    const coverImageId = uploadedIds[0] ?? null

    const event = await prisma.event.create({
      data: { title, description, location, imageId: coverImageId, startDate, endDate, published },
    })

    // Sauvegarder les images dans la galerie
    if (uploadedIds.length > 0) {
      await prisma.eventImage.createMany({
        data: uploadedIds.map((imageId, order) => ({ eventId: event.id, imageId, order })),
      })
    }

    // Sauvegarder les liens vidéo
    const videoUrls = formData.getAll("videoUrls") as string[]
    const validVideoUrls = videoUrls.filter((url) => typeof url === "string" && url.trim().length > 0)
    if (validVideoUrls.length > 0) {
      await prisma.eventVideo.createMany({
        data: validVideoUrls.map((url, order) => ({ eventId: event.id, url: url.trim(), order })),
      })
    }

    revalidatePath("/bureau/evenements")
    revalidatePath("/evenements")
    redirect("/bureau/evenements")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createEvenement]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

// ── Modifier un événement ──────────────────────────────────────────────────────

export async function updateEvenement(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureau()
  try {
    const title       = formData.get("title")       as string
    const description = (formData.get("description") as string) || null
    const location    = (formData.get("location")    as string) || null
    const startDate   = new Date((formData.get("startDate") as string) || "")
    const endDate     = new Date((formData.get("endDate")   as string) || "")
    const published   = formData.get("published") === "true"

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return { error: "Veuillez sélectionner les dates de début et de fin." }
    }

    const keptImageIds = formData.getAll("keptImageIds") as string[]
    const imageFiles   = formData.getAll("imageFiles")   as File[]

    // Supprimer les images retirées de Cloudinary
    const existingImages = await prisma.eventImage.findMany({ where: { eventId: id } })
    const toDelete = existingImages
      .filter((img) => !keptImageIds.includes(img.imageId))
      .map((img) => img.imageId)
    await deleteCloudinaryImages(toDelete)

    // Uploader les nouvelles images
    const newIds = await uploadFiles(imageFiles)

    // Liste finale dans l'ordre : kept d'abord, nouveaux ensuite
    const finalIds = [...keptImageIds, ...newIds]

    // Reconstruire la galerie
    await prisma.eventImage.deleteMany({ where: { eventId: id } })
    if (finalIds.length > 0) {
      await prisma.eventImage.createMany({
        data: finalIds.map((imageId, order) => ({ eventId: id, imageId, order })),
      })
    }

    const coverImageId = finalIds[0] ?? null

    // Mise à jour des liens vidéo
    const videoUrls = formData.getAll("videoUrls") as string[]
    const validVideoUrls = videoUrls.filter((url) => typeof url === "string" && url.trim().length > 0)
    await prisma.eventVideo.deleteMany({ where: { eventId: id } })
    if (validVideoUrls.length > 0) {
      await prisma.eventVideo.createMany({
        data: validVideoUrls.map((url, order) => ({ eventId: id, url: url.trim(), order })),
      })
    }

    await prisma.event.update({
      where: { id },
      data: { title, description, location, imageId: coverImageId, startDate, endDate, published },
    })

    revalidatePath("/bureau/evenements")
    revalidatePath("/evenements")
    redirect("/bureau/evenements")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updateEvenement]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

// ── Supprimer un événement ─────────────────────────────────────────────────────

export async function deleteEvenement(id: string) {
  await requireBureau()

  const event = await prisma.event.findUnique({
    where: { id },
    include: { images: true },
  })

  // Supprimer l'événement (cascade EventImage)
  await prisma.event.delete({ where: { id } })

  // Supprimer toutes les images Cloudinary
  const allIds = [
    ...(event?.images.map((i) => i.imageId) ?? []),
    // imageId héritage si pas encore migré vers EventImage
    ...(event?.imageId && !event.images.some((i) => i.imageId === event.imageId)
      ? [event.imageId]
      : []),
  ]
  await deleteCloudinaryImages(allIds)

  revalidatePath("/bureau/evenements")
  revalidatePath("/evenements")
}

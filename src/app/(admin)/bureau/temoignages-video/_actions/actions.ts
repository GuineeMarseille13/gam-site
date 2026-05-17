"use server"

import { prisma } from "@/lib/prisma"
import { uploadVideo } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { requireBureauContenu } from "@/lib/auth-guard"

export type ActionState = { error: string } | null

const REVALIDATE_PATHS = ["/bureau/temoignages-video", "/"]

/** Résout l'URL et la miniature depuis un fichier uploadé ou un lien saisi. */
async function resolveVideoSource(
  formData: FormData
): Promise<{ url: string; thumbnail: string | null }> {
  const file = formData.get("videoFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadVideo(file, "gam/temoignages")
    return { url: result.url, thumbnail: result.thumbnail || null }
  }
  const url = formData.get("url") as string
  const thumbnail = (formData.get("thumbnail") as string) || null
  return { url, thumbnail }
}

export async function createVideoTemoignage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureauContenu()
  try {
    const { url, thumbnail } = await resolveVideoSource(formData)
    const title = (formData.get("title") as string) || null
    const description = (formData.get("description") as string) || null
    const order = parseInt(formData.get("order") as string) || 0
    const isActive = formData.get("isActive") === "on"

    await prisma.video.create({
      data: {
        url,
        title,
        description,
        thumbnail,
        order,
        isActive,
        page: "HOME",
        section: "REVIEW",
      },
    })

    REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
    redirect("/bureau/temoignages-video")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createVideoTemoignage]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

export async function updateVideoTemoignage(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureauContenu()
  try {
    const previous = await prisma.video.findUnique({
      where: { id },
      select: { url: true },
    })

    const { url, thumbnail } = await resolveVideoSource(formData)
    const title = (formData.get("title") as string) || null
    const description = (formData.get("description") as string) || null
    const order = parseInt(formData.get("order") as string) || 0
    const isActive = formData.get("isActive") === "on"

    await prisma.video.update({
      where: { id },
      data: { url, title, description, thumbnail, order, isActive },
    })

    await deleteSupersededCloudinaryUrl({
      previousUrl: previous?.url,
      nextUrl: url,
    })

    REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
    redirect("/bureau/temoignages-video")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updateVideoTemoignage]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

export async function deleteVideoTemoignage(id: string) {
  await requireBureauContenu()
  const existing = await prisma.video.findUnique({
    where: { id },
    select: { url: true },
  })
  await prisma.video.delete({ where: { id } })

  await deleteSupersededCloudinaryUrl({
    previousUrl: existing?.url,
    nextUrl: null,
  })

  REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
}

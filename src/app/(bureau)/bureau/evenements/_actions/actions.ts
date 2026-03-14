"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export type ActionState = { error: string } | null

async function resolveImageId(formData: FormData): Promise<string | null> {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, "gam/evenements")
    return result.publicId
  }
  return (formData.get("imageId") as string) || null
}

export async function createEvenement(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const title = formData.get("title") as string
    const description = (formData.get("description") as string) || null
    const location = (formData.get("location") as string) || null
    const imageId = await resolveImageId(formData)
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)

    await prisma.event.create({
      data: { title, description, location, imageId, startDate, endDate },
    })

    revalidatePath("/bureau/evenements")
    revalidatePath("/evenements")
    redirect("/bureau/evenements")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createEvenement]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

export async function updateEvenement(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const title = formData.get("title") as string
    const description = (formData.get("description") as string) || null
    const location = (formData.get("location") as string) || null
    const imageId = await resolveImageId(formData)
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)

    await prisma.event.update({
      where: { id },
      data: { title, description, location, imageId, startDate, endDate },
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

export async function deleteEvenement(id: string) {
  const event = await prisma.event.findUnique({ where: { id }, select: { imageId: true } })
  await prisma.event.delete({ where: { id } })
  if (event?.imageId) {
    await deleteImage(event.imageId).catch(console.error)
  }
  revalidatePath("/bureau/evenements")
  revalidatePath("/evenements")
}

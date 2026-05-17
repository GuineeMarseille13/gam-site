"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { deleteSupersededPublicId } from "@/lib/cloudinary-replacement"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { requireBureauContenu } from "@/lib/auth-guard"

export type ActionState = { error: string } | null

async function resolveImageId(formData: FormData): Promise<string | null> {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, "gam/poles")
    return result.publicId
  }
  return (formData.get("imageId") as string) || null
}

export async function createPole(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureauContenu()
  try {
    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || null
    const imageId = await resolveImageId(formData)

    const details = await prisma.detailsPole.create({
      data: { title: name, description },
    })
    await prisma.pole.create({
      data: { name, description, imageId, detailsPoleId: details.id },
    })

    revalidatePath("/bureau/poles")
    revalidatePath("/")
    redirect("/bureau/poles")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createPole]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
  return null
}

export async function updatePole(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureauContenu()
  try {
    const previous = await prisma.pole.findUnique({
      where: { id },
      select: { imageId: true },
    })

    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || null
    const imageId = await resolveImageId(formData)

    await prisma.pole.update({
      where: { id },
      data: { name, description, imageId },
    })

    await deleteSupersededPublicId({
      previousPublicId: previous?.imageId,
      nextPublicId: imageId,
      resourceType: "image",
    })

    revalidatePath("/bureau/poles")
    revalidatePath("/")
    redirect("/bureau/poles")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updatePole]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
  return null
}

export async function deletePole(id: string) {
  await requireBureauContenu()
  const pole = await prisma.pole.findUnique({ where: { id }, select: { imageId: true } })
  await prisma.pole.delete({ where: { id } })
  if (pole?.imageId) {
    await deleteImage(pole.imageId).catch(console.error)
  }
  revalidatePath("/bureau/poles")
  revalidatePath("/")
}

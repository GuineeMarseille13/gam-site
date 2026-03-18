"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { requireBureau } from "@/lib/auth-guard"

export type ActionState = { error: string } | null

async function resolveImageId(formData: FormData): Promise<string | null> {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, "gam/partenaires")
    return result.publicId
  }
  return (formData.get("imageId") as string) || null
}

export async function createPartenaire(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureau()
  try {
    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || null
    const url = (formData.get("url") as string) || null
    const imageId = await resolveImageId(formData)

    const published = formData.get("published") === "true"
    await prisma.partner.create({
      data: { name, description, url, imageId, published },
    })

    revalidatePath("/bureau/partenaires")
    revalidatePath("/")
    redirect("/bureau/partenaires")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createPartenaire]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
  return null
}

export async function updatePartenaire(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureau()
  try {
    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || null
    const url = (formData.get("url") as string) || null
    const imageId = await resolveImageId(formData)

    const published = formData.get("published") === "true"
    await prisma.partner.update({
      where: { id },
      data: { name, description, url, imageId, published },
    })

    revalidatePath("/bureau/partenaires")
    revalidatePath("/")
    redirect("/bureau/partenaires")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updatePartenaire]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
  return null
}

export async function deletePartenaire(id: string) {
  await requireBureau()
  const partner = await prisma.partner.findUnique({ where: { id }, select: { imageId: true } })
  await prisma.partner.delete({ where: { id } })
  if (partner?.imageId) {
    await deleteImage(partner.imageId).catch(console.error)
  }
  revalidatePath("/bureau/partenaires")
  revalidatePath("/")
}

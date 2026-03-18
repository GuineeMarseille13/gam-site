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
    const result = await uploadImage(file, "gam/produits")
    return result.publicId
  }
  return (formData.get("imageId") as string) || null
}

export async function createProduit(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureau()
  try {
    const title = formData.get("title") as string
    const description = (formData.get("description") as string) || null
    const imageId = await resolveImageId(formData)
    const price = Math.round(parseFloat(formData.get("price") as string) * 100)
    const stock = parseInt(formData.get("stock") as string) || 0
    const isActive = formData.get("isActive") === "true"
    const productCategoryId = (formData.get("productCategoryId") as string) || null
    const discountActive = formData.get("discountActive") === "true"
    const discountPercentRaw = formData.get("discountPercent") as string
    const discountPercent = discountActive && discountPercentRaw ? parseInt(discountPercentRaw) : null

    await prisma.product.create({
      data: { title, description, imageId, price, stock, isActive, productCategoryId, discountActive, discountPercent },
    })

    revalidatePath("/bureau/produits")
    revalidatePath("/")
    redirect("/bureau/produits")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createProduit]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
  return null
}

export async function updateProduit(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireBureau()
  try {
    const title = formData.get("title") as string
    const description = (formData.get("description") as string) || null
    const imageId = await resolveImageId(formData)
    const price = Math.round(parseFloat(formData.get("price") as string) * 100)
    const stock = parseInt(formData.get("stock") as string) || 0
    const isActive = formData.get("isActive") === "true"
    const productCategoryId = (formData.get("productCategoryId") as string) || null
    const discountActive = formData.get("discountActive") === "true"
    const discountPercentRaw = formData.get("discountPercent") as string
    const discountPercent = discountActive && discountPercentRaw ? parseInt(discountPercentRaw) : null

    await prisma.product.update({
      where: { id },
      data: { title, description, imageId, price, stock, isActive, productCategoryId, discountActive, discountPercent },
    })

    revalidatePath("/bureau/produits")
    revalidatePath("/")
    redirect("/bureau/produits")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updateProduit]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
  return null
}

export async function deleteProduit(id: string) {
  await requireBureau()
  const product = await prisma.product.findUnique({ where: { id }, select: { imageId: true } })
  await prisma.product.delete({ where: { id } })
  if (product?.imageId) {
    await deleteImage(product.imageId).catch(console.error)
  }
  revalidatePath("/bureau/produits")
  revalidatePath("/")
}

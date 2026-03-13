"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduit(formData: FormData) {
  const title = formData.get("title") as string
  const description = (formData.get("description") as string) || null
  const imageId = (formData.get("imageId") as string) || null
  const price = Math.round(parseFloat(formData.get("price") as string) * 100)
  const stock = parseInt(formData.get("stock") as string) || 0
  const isActive = formData.get("isActive") === "on"
  const productCategoryId = (formData.get("productCategoryId") as string) || null

  await prisma.product.create({
    data: { title, description, imageId, price, stock, isActive, productCategoryId },
  })

  revalidatePath("/bureau/produits")
  redirect("/bureau/produits")
}

export async function updateProduit(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = (formData.get("description") as string) || null
  const imageId = (formData.get("imageId") as string) || null
  const price = Math.round(parseFloat(formData.get("price") as string) * 100)
  const stock = parseInt(formData.get("stock") as string) || 0
  const isActive = formData.get("isActive") === "on"
  const productCategoryId = (formData.get("productCategoryId") as string) || null

  await prisma.product.update({
    where: { id },
    data: { title, description, imageId, price, stock, isActive, productCategoryId },
  })

  revalidatePath("/bureau/produits")
  redirect("/bureau/produits")
}

export async function deleteProduit(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/bureau/produits")
}

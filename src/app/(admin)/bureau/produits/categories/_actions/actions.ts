"use server"

import { prisma } from "@/lib/prisma"
import { requireBureau } from "@/lib/auth-guard"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import {
  formatProductCategoryFormError,
  parseProductCategoryFormFields,
} from "../_schemas/product-category.schema"

export type ActionState = { error: string } | null

const REVALIDATE_PATHS = [
  "/bureau/produits",
  "/bureau/produits/categories",
  "/bureau/produits/nouveau",
  "/",
  "/boutique",
] as const

function revalidateProductCategoryPaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path)
  }
}

export async function createProductCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireBureau()

  const parsed = parseProductCategoryFormFields(formData)
  if (!parsed.success) {
    return { error: formatProductCategoryFormError(parsed.error) }
  }

  try {
    await prisma.productCategory.create({ data: parsed.data })
    revalidateProductCategoryPaths()
    redirect("/bureau/produits/categories")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createProductCategory]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

export async function updateProductCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireBureau()

  const parsed = parseProductCategoryFormFields(formData)
  if (!parsed.success) {
    return { error: formatProductCategoryFormError(parsed.error) }
  }

  try {
    await prisma.productCategory.update({
      where: { id },
      data: parsed.data,
    })
    revalidateProductCategoryPaths()
    redirect("/bureau/produits/categories")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updateProductCategory]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

export async function deleteProductCategory(id: string) {
  await requireBureau()

  await prisma.$transaction([
    prisma.product.updateMany({
      where: { productCategoryId: id },
      data: { productCategoryId: null },
    }),
    prisma.productCategory.delete({ where: { id } }),
  ])

  revalidateProductCategoryPaths()
}

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateProductSchema = z
  .object({
    name: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    price: z.number().int().positive().optional(),
    stock: z.number().int().min(0).optional(),
    stockQuantity: z.number().int().min(0).optional(),
    discountPercent: z.number().int().min(0).max(99).optional(),
    discount: z.number().int().min(0).max(99).optional(),
    discountActive: z.boolean().optional(),
    productCategoryId: z.string().optional(),
    categoryId: z.string().optional(),
    productSectionId: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

/**
 * GET /api/products/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productCategory: true,
        productSection: true,
      },
    })

    if (!product) {
      return notFoundResponse('Produit')
    }

    return successResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/products/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const data: {
      title?: string
      description?: string | null
      imageId?: string | null
      price?: number
      stock?: number
      discountPercent?: number | null
      discountActive?: boolean
      productCategoryId?: string | null
      productSectionId?: string | null
      isActive?: boolean
    } = {}

    if (validatedData.title !== undefined) data.title = validatedData.title
    if (validatedData.name !== undefined) data.title = validatedData.name
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.image !== undefined) data.imageId = validatedData.image
    if (validatedData.price !== undefined) data.price = validatedData.price
    if (validatedData.stock !== undefined) data.stock = validatedData.stock
    if (validatedData.stockQuantity !== undefined) data.stock = validatedData.stockQuantity
    if (validatedData.discountPercent !== undefined) data.discountPercent = validatedData.discountPercent
    if (validatedData.discount !== undefined) data.discountPercent = validatedData.discount
    if (validatedData.discountActive !== undefined) data.discountActive = validatedData.discountActive
    if (validatedData.productCategoryId !== undefined) data.productCategoryId = validatedData.productCategoryId
    if (validatedData.categoryId !== undefined) data.productCategoryId = validatedData.categoryId
    if (validatedData.productSectionId !== undefined) data.productSectionId = validatedData.productSectionId
    if (validatedData.isActive !== undefined) data.isActive = validatedData.isActive

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        productCategory: true,
        productSection: true,
      },
    })

    return successResponse(product, 'Produit mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/products/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return successResponse(null, 'Produit supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

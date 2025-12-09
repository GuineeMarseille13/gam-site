import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().positive().optional(),
  category: z.string().optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/products/[id] - Récupérer un produit par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categoryRef: true,
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

// PUT /api/products/[id] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        categoryRef: true,
      },
    })

    return successResponse(product, 'Produit mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/products/[id] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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


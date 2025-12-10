import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url(),
  images: z.array(z.string().url()).default([]),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.string().optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  discount: z.number().int().min(0).max(100).optional(),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
})

// GET /api/products - Liste tous les produits
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured') === 'true'
    const categoryId = searchParams.get('categoryId')
    const inStock = searchParams.get('inStock') === 'true'
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true
    if (featured) where.featured = true
    if (categoryId) where.categoryId = categoryId
    if (inStock) where.inStock = true

    const products = await prisma.product.findMany({
      where,
      include: {
        categoryRef: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(products)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
      },
      include: {
        categoryRef: true,
      },
    })

    return successResponse(product, 'Produit créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


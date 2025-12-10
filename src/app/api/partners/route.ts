import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createPartnerSchema = z.object({
  name: z.string().min(1),
  logo: z.string().url(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/partners - Liste tous les partenaires
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'
    const categoryId = searchParams.get('categoryId')

    const where: any = {}
    if (activeOnly) where.isActive = true
    if (categoryId) where.categoryId = categoryId

    const partners = await prisma.partner.findMany({
      where,
      include: {
        categoryRef: true,
      },
      orderBy: { order: 'asc' },
    })

    return successResponse(partners)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/partners - Créer un nouveau partenaire
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPartnerSchema.parse(body)

    const partner = await prisma.partner.create({
      data: validatedData,
      include: {
        categoryRef: true,
      },
    })

    return successResponse(partner, 'Partenaire créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


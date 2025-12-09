import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createContactMethodSchema = z.object({
  type: z.enum(['email', 'phone', 'address']),
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().optional(),
  icon: z.string(),
  color: z.string(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/contact-methods - Liste toutes les méthodes de contact
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true

    const methods = await prisma.contactMethod.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return successResponse(methods)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/contact-methods - Créer une nouvelle méthode de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContactMethodSchema.parse(body)

    const method = await prisma.contactMethod.create({
      data: validatedData,
    })

    return successResponse(method, 'Méthode de contact créée avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


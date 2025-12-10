import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createPoleSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  features: z.array(z.string()).default([]),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    schedule: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  permanenceDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
  statistics: z.object({
    title: z.string().optional(),
    items: z.array(z.object({
      value: z.number(),
      label: z.string(),
      description: z.string().optional(),
    })),
  }).optional(),
  colorScheme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  isActive: z.boolean().default(true),
})

// GET /api/poles - Liste tous les pôles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('active') === 'true'

    const where = activeOnly ? { isActive: true } : {}

    const poles = await prisma.pole.findMany({
      where,
      include: {
        services: {
          orderBy: { order: 'asc' },
        },
        eventImages: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(poles)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/poles - Créer un nouveau pôle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPoleSchema.parse(body)

    const pole = await prisma.pole.create({
      data: validatedData,
      include: {
        services: true,
        eventImages: true,
      },
    })

    return successResponse(pole, 'Pôle créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


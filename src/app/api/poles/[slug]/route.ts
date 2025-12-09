import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updatePoleSchema = z.object({
  title: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  features: z.array(z.string()).optional(),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    schedule: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  permanenceDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
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
  }).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/poles/[slug] - Récupérer un pôle par slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const pole = await prisma.pole.findUnique({
      where: { slug },
      include: {
        services: {
          orderBy: { order: 'asc' },
        },
        eventImages: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    return successResponse(pole)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/poles/[slug] - Mettre à jour un pôle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const validatedData = updatePoleSchema.parse(body)

    const pole = await prisma.pole.update({
      where: { slug },
      data: validatedData,
      include: {
        services: true,
        eventImages: true,
      },
    })

    return successResponse(pole, 'Pôle mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/poles/[slug] - Supprimer un pôle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await prisma.pole.delete({
      where: { slug },
    })

    return successResponse(null, 'Pôle supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}


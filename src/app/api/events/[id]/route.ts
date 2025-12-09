import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api/response'
import { z } from 'zod'

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  location: z.string().optional(),
  year: z.number().int().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  categoryId: z.string().optional(),
})

// GET /api/events/[id] - Récupérer un événement par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
        categoryRef: true,
      },
    })

    if (!event) {
      return notFoundResponse('Événement')
    }

    return successResponse(event)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/events/[id] - Mettre à jour un événement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateEventSchema.parse(body)

    const updateData: any = { ...validatedData }
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date)
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        media: true,
        categoryRef: true,
      },
    })

    return successResponse(event, 'Événement mis à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/events/[id] - Supprimer un événement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.event.delete({
      where: { id },
    })

    return successResponse(null, 'Événement supprimé avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}


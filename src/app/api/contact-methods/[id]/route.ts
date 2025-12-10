import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateContactMethodSchema = z.object({
  type: z.enum(['email', 'phone', 'address']).optional(),
  label: z.string().min(1).optional(),
  value: z.string().optional(),
  href: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/contact-methods/[id] - Récupérer une méthode de contact par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const method = await prisma.contactMethod.findUnique({
      where: { id },
    })

    if (!method) {
      return notFoundResponse('Méthode de contact')
    }

    return successResponse(method)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/contact-methods/[id] - Mettre à jour une méthode de contact
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateContactMethodSchema.parse(body)

    const method = await prisma.contactMethod.update({
      where: { id },
      data: validatedData,
    })

    return successResponse(method, 'Méthode de contact mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/contact-methods/[id] - Supprimer une méthode de contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.contactMethod.delete({
      where: { id },
    })

    return successResponse(null, 'Méthode de contact supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}


import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateSubmissionSchema = z.object({
  status: z.enum(['pending', 'read', 'replied', 'archived']).optional(),
  notes: z.string().optional(),
})

// GET /api/contact/submissions/[id] - Récupérer une soumission par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
      include: {
        repliedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!submission) {
      return notFoundResponse('Soumission')
    }

    return successResponse(submission)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/contact/submissions/[id] - Mettre à jour une soumission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSubmissionSchema.parse(body)

    const updateData: any = { ...validatedData }
    if (validatedData.status === 'replied' && !updateData.repliedAt) {
      updateData.repliedAt = new Date()
    }

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
      include: {
        repliedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return successResponse(submission, 'Soumission mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/contact/submissions/[id] - Supprimer une soumission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.contactSubmission.delete({
      where: { id },
    })

    return successResponse(null, 'Soumission supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}


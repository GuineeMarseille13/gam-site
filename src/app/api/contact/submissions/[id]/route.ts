import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { ContactSubmissionStatus } from '@/lib/generated/prisma/enums'
import { z } from 'zod'

const updateSubmissionSchema = z
  .object({
    status: z.nativeEnum(ContactSubmissionStatus).optional(),
  })
  .strict()

/**
 * GET /api/contact/submissions/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    })

    if (!submission) {
      return notFoundResponse('Soumission')
    }

    return successResponse(submission)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/contact/submissions/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateSubmissionSchema.parse(body)

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: {
        ...(validatedData.status !== undefined ? { status: validatedData.status } : {}),
      },
    })

    return successResponse(submission, 'Soumission mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/contact/submissions/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

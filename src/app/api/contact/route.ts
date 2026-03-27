import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactSubmissionStatus } from '@/lib/generated/prisma/enums'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { contactFormSchema } from '@/app/(public)/contacts/_schemas/contact.schema'

// POST /api/contact - Créer une soumission de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = contactFormSchema.parse(body)

    const submission = await prisma.contactSubmission.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
        status: ContactSubmissionStatus.PENDING,
      },
    })

    // TODO: Envoyer un email de notification

    return successResponse(submission, 'Message envoyé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


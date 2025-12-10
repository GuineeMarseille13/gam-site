import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateAssociationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  president: z.object({
    name: z.string(),
    role: z.string(),
    image: z.string().url(),
    message: z.string(),
  }).optional(),
  aboutUs: z.object({
    whoWeAre: z.object({
      title: z.string(),
      text: z.string(),
      image: z.string().url(),
    }),
    whatWeOffer: z.object({
      title: z.string(),
      text: z.string(),
      image: z.string().url(),
    }),
  }).optional(),
  foundingDate: z.string().datetime().optional(),
  address: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
})

// GET /api/association - Récupérer les informations de l'association
export async function GET() {
  try {
    let associationInfo = await prisma.associationInfo.findFirst()

    // Si aucune info n'existe, créer une entrée par défaut
    if (!associationInfo) {
      associationInfo = await prisma.associationInfo.create({
        data: {
          name: 'Guinée À Marseille',
          description: '',
        },
      })
    }

    return successResponse(associationInfo)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/association - Mettre à jour les informations de l'association
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateAssociationSchema.parse(body)

    const updateData: any = { ...validatedData }
    if (validatedData.foundingDate) {
      updateData.foundingDate = new Date(validatedData.foundingDate)
    }

    let associationInfo = await prisma.associationInfo.findFirst()

    if (!associationInfo) {
      associationInfo = await prisma.associationInfo.create({
        data: updateData,
      })
    } else {
      associationInfo = await prisma.associationInfo.update({
        where: { id: associationInfo.id },
        data: updateData,
      })
    }

    return successResponse(associationInfo, 'Informations mises à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}


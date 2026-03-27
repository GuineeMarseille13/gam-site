import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const updateAssociationSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    logo: z.string().url().optional(),
    president: z
      .object({
        name: z.string(),
        role: z.string(),
        image: z.string().url(),
        message: z.string(),
      })
      .optional(),
    aboutUs: z
      .object({
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
      })
      .optional(),
    foundingDate: z.string().datetime().optional(),
    address: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
  })
  .strict()

/**
 * GET /api/association — Basé sur `AboutUs` (premier enregistrement).
 */
export async function GET() {
  try {
    let row = await prisma.aboutUs.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!row) {
      row = await prisma.aboutUs.create({
        data: {
          title: 'Guinée À Marseille',
          description: '',
        },
      })
    }

    return successResponse({
      id: row.id,
      name: row.title,
      description: row.description ?? '',
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/association — Met à jour titre / description sur `AboutUs`.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateAssociationSchema.parse(body)

    let row = await prisma.aboutUs.findFirst({ orderBy: { createdAt: 'asc' } })
    const nextTitle = validatedData.name ?? row?.title ?? 'Guinée À Marseille'
    const nextDesc = validatedData.description ?? row?.description ?? ''

    if (!row) {
      row = await prisma.aboutUs.create({
        data: {
          title: nextTitle,
          description: nextDesc,
        },
      })
    } else {
      row = await prisma.aboutUs.update({
        where: { id: row.id },
        data: {
          title: nextTitle,
          description: nextDesc,
        },
      })
    }

    return successResponse(
      {
        id: row.id,
        name: row.title,
        description: row.description ?? '',
      },
      'Informations mises à jour avec succès',
    )
  } catch (error) {
    return handleApiError(error)
  }
}

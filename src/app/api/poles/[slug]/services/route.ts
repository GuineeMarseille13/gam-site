import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string(),
  order: z.number().int().default(0),
})

// GET /api/poles/[slug]/services - Liste les services d'un pôle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const pole = await prisma.pole.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    const services = await prisma.poleService.findMany({
      where: { poleId: pole.id },
      orderBy: { order: 'asc' },
    })

    return successResponse(services)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/poles/[slug]/services - Ajouter un service à un pôle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const validatedData = createServiceSchema.parse(body)

    const pole = await prisma.pole.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!pole) {
      return notFoundResponse('Pôle')
    }

    const service = await prisma.poleService.create({
      data: {
        ...validatedData,
        poleId: pole.id,
      },
    })

    return successResponse(service, 'Service ajouté avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


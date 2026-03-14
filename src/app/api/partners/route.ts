/**
 * API Routes pour les partenaires
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

const createPartnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  url: z.string().url('Invalid URL').optional().nullable(),
  partnerSectionId: z.string().optional().nullable(),
})

const updatePartnerSchema = createPartnerSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Partner',
  validateCreate: (data) => createPartnerSchema.parse(data),
  validateUpdate: (data) => updatePartnerSchema.parse(data),
})

// GET public : retourne uniquement les partenaires publiés
export async function GET(_request: NextRequest) {
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(partners)
}

export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE


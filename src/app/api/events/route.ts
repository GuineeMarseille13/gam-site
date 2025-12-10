import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().datetime(),
  location: z.string().optional(),
  year: z.number().int(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  categoryId: z.string().optional(),
})

// GET /api/events - Liste tous les événements
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = searchParams.get('year')
    const published = searchParams.get('published') === 'true'
    const categoryId = searchParams.get('categoryId')

    const where: any = {}
    if (year) where.year = parseInt(year)
    if (published) where.isPublished = true
    if (categoryId) where.categoryId = categoryId

    const events = await prisma.event.findMany({
      where,
      include: {
        media: {
          orderBy: { order: 'asc' },
        },
        categoryRef: true,
      },
      orderBy: { date: 'desc' },
    })

    // Grouper par année si demandé
    const groupByYear = searchParams.get('groupByYear') === 'true'
    if (groupByYear) {
      const eventsByYear = events.reduce((acc, event) => {
        if (!acc[event.year]) {
          acc[event.year] = []
        }
        acc[event.year].push(event)
        return acc
      }, {} as Record<number, typeof events>)

      return successResponse(eventsByYear)
    }

    return successResponse(events)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/events - Créer un nouvel événement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        media: true,
        categoryRef: true,
      },
    })

    return successResponse(event, 'Événement créé avec succès', 201)
  } catch (error) {
    return handleApiError(error)
  }
}


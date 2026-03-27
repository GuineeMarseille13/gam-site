/**
 * API Routes pour les événements
 * GET    /api/events - Liste tous les événements
 * GET    /api/events?id=xxx - Récupère un événement par ID
 * POST   /api/events - Crée un nouvel événement
 * PUT    /api/events?id=xxx - Met à jour un événement
 * DELETE /api/events?id=xxx - Supprime un événement
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCrudHandler } from '@/lib/api/handlers'
import { z } from 'zod'

// Schéma de validation pour la création
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  videoId: z.string().optional().nullable(),
  startDate: z.string().datetime('Invalid start date').or(z.date()),
  endDate: z.string().datetime('Invalid end date').or(z.date()),
  location: z.string().optional().nullable(),
  eventSectionId: z.string().optional().nullable(),
})

// Schéma de validation pour la mise à jour
const updateEventSchema = createEventSchema.partial()

const handlers = createCrudHandler({
  modelName: 'Event',
  validateCreate: (data) => {
    const parsed = createEventSchema.parse(data)
    // Convertir les dates string en Date si nécessaire
    if (typeof parsed.startDate === 'string') {
      parsed.startDate = new Date(parsed.startDate)
    }
    if (typeof parsed.endDate === 'string') {
      parsed.endDate = new Date(parsed.endDate)
    }
    return parsed
  },
  validateUpdate: (data) => {
    const parsed = updateEventSchema.parse(data)
    // Convertir les dates string en Date si nécessaire
    if (parsed.startDate && typeof parsed.startDate === 'string') {
      parsed.startDate = new Date(parsed.startDate)
    }
    if (parsed.endDate && typeof parsed.endDate === 'string') {
      parsed.endDate = new Date(parsed.endDate)
    }
    return parsed
  },
})

// GET public : retourne uniquement les événements publiés (avec galerie d'images et vidéos)
export async function GET() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: 'desc' },
    include: {
      images: { orderBy: { order: 'asc' } },
      videos: { orderBy: { order: 'asc' } },
    },
  })
  return NextResponse.json(events)
}

export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE


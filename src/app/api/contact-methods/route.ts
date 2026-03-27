import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api/response'
import { handleApiError } from '@/lib/api/errors'
import { z } from 'zod'

const createContactMethodSchema = z
  .object({
    type: z.enum(['email', 'phone', 'address']),
    label: z.string().min(1),
    value: z.string().min(1),
    href: z.string().optional(),
    icon: z.string(),
    color: z.string(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  })
  .strict()

type ContactRow = {
  id: string
  phone: string
  email: string
  address: string
  city: string
  zipCode: string
}

function contactRowsFromContact(contact: ContactRow) {
  return [
    {
      id: `${contact.id}-phone`,
      type: 'phone' as const,
      label: 'Téléphone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
      icon: 'phone',
      color: '#111827',
      order: 0,
      isActive: true,
    },
    {
      id: `${contact.id}-email`,
      type: 'email' as const,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: 'mail',
      color: '#111827',
      order: 1,
      isActive: true,
    },
    {
      id: `${contact.id}-address`,
      type: 'address' as const,
      label: 'Adresse',
      value: [contact.address, contact.zipCode, contact.city].filter(Boolean).join(', '),
      href: undefined,
      icon: 'map-pin',
      color: '#111827',
      order: 2,
      isActive: true,
    },
  ]
}

/**
 * GET /api/contact-methods — Dérivé du modèle unique `Contact`.
 */
export async function GET() {
  try {
    const contact = await prisma.contact.findFirst()
    if (!contact) {
      return successResponse([])
    }

    return successResponse(contactRowsFromContact(contact))
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/contact-methods — Met à jour le champ correspondant sur `Contact`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContactMethodSchema.parse(body)

    let contact = await prisma.contact.findFirst()
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          phone: validatedData.type === 'phone' ? validatedData.value : '',
          email: validatedData.type === 'email' ? validatedData.value : '',
          address: validatedData.type === 'address' ? validatedData.value : '',
          city: '',
          zipCode: '',
        },
      })
    } else {
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: {
          ...(validatedData.type === 'phone' ? { phone: validatedData.value } : {}),
          ...(validatedData.type === 'email' ? { email: validatedData.value } : {}),
          ...(validatedData.type === 'address' ? { address: validatedData.value } : {}),
        },
      })
    }

    const row = contactRowsFromContact(contact).find((m) => m.type === validatedData.type)
    return successResponse(
      row ?? contactRowsFromContact(contact)[0],
      'Méthode de contact créée avec succès',
      201,
    )
  } catch (error) {
    return handleApiError(error)
  }
}

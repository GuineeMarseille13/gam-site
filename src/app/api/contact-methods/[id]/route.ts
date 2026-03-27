import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundResponse } from '@/lib/api/response'
import { ApiError, handleApiError } from '@/lib/api/errors'
import { z } from 'zod'
const updateContactMethodSchema = z
  .object({
    type: z.enum(['email', 'phone', 'address']).optional(),
    label: z.string().min(1).optional(),
    value: z.string().optional(),
    href: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

function parseSyntheticMethodId(id: string): { contactId: string; field: 'phone' | 'email' | 'address' } | null {
  if (id.endsWith('-phone')) {
    return { contactId: id.slice(0, -6), field: 'phone' }
  }
  if (id.endsWith('-email')) {
    return { contactId: id.slice(0, -6), field: 'email' }
  }
  if (id.endsWith('-address')) {
    return { contactId: id.slice(0, -8), field: 'address' }
  }
  return null
}

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
      href: undefined as string | undefined,
      icon: 'map-pin',
      color: '#111827',
      order: 2,
      isActive: true,
    },
  ]
}

/**
 * GET /api/contact-methods/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const parsed = parseSyntheticMethodId(id)
    if (!parsed) {
      return notFoundResponse('Méthode de contact')
    }

    const contact = await prisma.contact.findUnique({
      where: { id: parsed.contactId },
    })

    if (!contact) {
      return notFoundResponse('Méthode de contact')
    }

    const row = contactRowsFromContact(contact).find((m) => m.id === id)
    if (!row) {
      return notFoundResponse('Méthode de contact')
    }

    return successResponse(row)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/contact-methods/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const parsed = parseSyntheticMethodId(id)
    if (!parsed) {
      return notFoundResponse('Méthode de contact')
    }

    const body = await request.json()
    const validatedData = updateContactMethodSchema.parse(body)
    const value = validatedData.value
    if (value === undefined) {
      throw new ApiError('Valeur requise pour la mise à jour', 400)
    }

    const data: { phone?: string; email?: string; address?: string } = {}
    if (parsed.field === 'phone') data.phone = value
    if (parsed.field === 'email') data.email = value
    if (parsed.field === 'address') data.address = value

    const contact = await prisma.contact.update({
      where: { id: parsed.contactId },
      data,
    })

    const row = contactRowsFromContact(contact).find((m) => m.id === id)
    return successResponse(row ?? contactRowsFromContact(contact)[0], 'Méthode de contact mise à jour avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/contact-methods/[id] — Remet le champ à vide.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const parsed = parseSyntheticMethodId(id)
    if (!parsed) {
      return notFoundResponse('Méthode de contact')
    }

    const data: { phone?: string; email?: string; address?: string } = {}
    if (parsed.field === 'phone') data.phone = ''
    if (parsed.field === 'email') data.email = ''
    if (parsed.field === 'address') data.address = ''

    await prisma.contact.update({
      where: { id: parsed.contactId },
      data,
    })

    return successResponse(null, 'Méthode de contact supprimée avec succès')
  } catch (error) {
    return handleApiError(error)
  }
}

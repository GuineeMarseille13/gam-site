/**
 * Route publique pour la section "Nos bénévoles" du site
 * Retourne uniquement les bénévoles avec showOnSite=true et une photo de profil
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/generated/prisma/client'

export async function GET() {
  try {
    const persons = await prisma.person.findMany({
      where: {
        roles: { has: Role.VOLUNTEER },
        showOnSite: true,
        image: { not: null },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    const volunteers = persons.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      image: p.image!,
      role: 'Bénévole',
      initials: `${p.firstName[0]}${p.lastName[0]}`.toUpperCase(),
    }))

    return NextResponse.json(volunteers)
  } catch (error) {
    console.error('[GET /api/volunteers/public] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

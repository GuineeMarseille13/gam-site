/**
 * Route publique pour la section "Nos bénévoles" du site
 *
 * Retourne deux sources :
 * 1. Bénévoles (Person avec rôle VOLUNTEER, showOnSite=true, image définie)
 * 2. Membres de l'équipe bureau (TeamMember avec showOnSite=true, imageId défini)
 *
 * Les membres de l'équipe sont prioritaires et apparaissent en premier.
 * La déduplication empêche d'afficher deux fois une même personne.
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPosteIdByCode } from '@/helpers/poste-helpers'
import { cloudinaryImageUrl } from '@/lib/cloudinary-delivery'

function buildAvatarUrl(imageId: string) {
  return cloudinaryImageUrl(imageId, 'w_400,h_400,c_fill,q_auto,f_auto')
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export async function GET() {
  try {
    // ── 1. Membres de l'équipe bureau (showOnSite=true + imageId) ─────────────
    const teamMembers = await prisma.teamMember.findMany({
      where: { showOnSite: true, imageId: { not: null } },
      select: { id: true, personId: true, imageId: true },
      orderBy: { order: 'asc' },
    })

    const teamPersonIds = teamMembers.map((m) => m.personId)

    const teamPersons = await prisma.person.findMany({
      where: { id: { in: teamPersonIds } },
      select: { id: true, firstName: true, lastName: true, poste: { select: { labelFr: true } } },
    })
    const teamPersonsById = Object.fromEntries(teamPersons.map((p) => [p.id, p]))

    const teamResults = teamMembers
      .filter((m) => teamPersonsById[m.personId])
      .map((m) => {
        const person = teamPersonsById[m.personId]
        return {
          id: m.id,
          name: `${person.firstName} ${person.lastName}`,
          image: buildAvatarUrl(m.imageId!),
          role: person.poste?.labelFr ?? 'Membre du bureau',
          initials: initials(person.firstName, person.lastName),
        }
      })

    // ── 2. Bénévoles (VOLUNTEER, showOnSite=true, image définie) ─────────────
    // Exclure les personnes déjà présentes via TeamMember pour éviter les doublons
    const teamPersonIdSet = new Set(teamPersonIds)

    const volunteerPosteId = await getPosteIdByCode(prisma, 'VOLUNTEER')

    const volunteerPersons = volunteerPosteId
      ? await prisma.person.findMany({
          where: {
            posteId: volunteerPosteId,
            showOnSite: true,
            image: { not: null },
            id: { notIn: [...teamPersonIdSet] },
          },
          select: { id: true, firstName: true, lastName: true, image: true },
          orderBy: { createdAt: 'asc' },
        })
      : []

    const volunteerResults = volunteerPersons.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      image: p.image!,
      role: 'Bénévole',
      initials: initials(p.firstName, p.lastName),
    }))

    return NextResponse.json([...teamResults, ...volunteerResults])
  } catch (error) {
    console.error('[GET /api/volunteers/public] Error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

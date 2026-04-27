/**
 * Route publique pour la section "Notre équipe"
 *
 * Retourne deux types de membres :
 * 1. TeamMember (créés via /bureau/equipe) — avec order explicite, imageId Cloudinary
 * 2. Person liés à un compte bureau/admin (créés via /bureau/membres) — avec showOnSite=true
 *    et sans entrée TeamMember correspondante (évite les doublons)
 */
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

export async function GET() {
  try {
    // ── 1. Membres via TeamMember ─────────────────────────────────────────────
    const teamMembers = await prisma.teamMember.findMany({
      where: { showOnSite: true },
      orderBy: { order: "asc" },
    })

    const teamPersonIds = new Set(teamMembers.map((m) => m.personId))

    // Récupérer les Person liées aux TeamMember
    const teamPersons = await prisma.person.findMany({
      where: { id: { in: [...teamPersonIds] } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: { select: { labelFr: true } },
      },
    })
    const teamPersonsById = Object.fromEntries(teamPersons.map((p) => [p.id, p]))

    const teamResults = teamMembers
      .filter((m) => teamPersonsById[m.personId])
      .map((m) => {
        const person = teamPersonsById[m.personId]
        return {
          id:    m.id,
          name:  `${person.firstName} ${person.lastName}`,
          role:  person.role?.labelFr ?? "Membre du bureau",
          image: m.imageId ? cloudinaryImageUrl(m.imageId) : "",
          order: m.order,
        }
      })

    // ── 2. Membres bureau/admin via Person (sans TeamMember) ──────────────────
    const bureauPersons = await prisma.person.findMany({
      where: {
        userId:    { not: null },
        showOnSite: true,
        id:         { notIn: [...teamPersonIds] },
      },
      select: {
        id: true, firstName: true, lastName: true,
        image: true, description: true,
        role: { select: { labelFr: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    const bureauResults = bureauPersons.map((p, i) => ({
      id:    p.id,
      name:  `${p.firstName} ${p.lastName}`,
      role:  p.role?.labelFr ?? p.description ?? "Membre du bureau",
      image: p.image ?? "",
      order: 100 + i,  // Après les membres explicitement ordonnés via Équipe
    }))

    return NextResponse.json([...teamResults, ...bureauResults])
  } catch (error) {
    console.error("[GET /api/association/team] Error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

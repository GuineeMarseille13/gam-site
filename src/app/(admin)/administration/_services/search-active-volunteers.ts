import type { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import {
  VOLUNTEER_SEARCH_MAX_RESULTS,
  volunteerSearchQuerySchema,
  volunteerSearchResultSchema,
  type VolunteerSearchResult,
} from "../_schemas/volunteer-search.schema"

function buildPersonNameWhere(q: string): Prisma.PersonWhereInput {
  const tokens = q.split(/\s+/).filter(Boolean)
  const or: Prisma.PersonWhereInput[] = [
    { firstName: { contains: q, mode: "insensitive" } },
    { lastName: { contains: q, mode: "insensitive" } },
  ]

  if (tokens.length >= 2) {
    const first = tokens[0]!
    const rest = tokens.slice(1).join(" ")
    or.push({
      AND: [
        { firstName: { contains: first, mode: "insensitive" } },
        { lastName: { contains: rest, mode: "insensitive" } },
      ],
    })
    or.push({
      AND: [
        { lastName: { contains: first, mode: "insensitive" } },
        { firstName: { contains: rest, mode: "insensitive" } },
      ],
    })
  }

  return { OR: or }
}

/**
 * Service: searchActiveVolunteersByName
 * Rôle: Suggestions de bénévoles actifs dont le nom correspond à la saisie (min 3 lettres).
 * Auth: à vérifier par l’appelant (route API / server action admin).
 */
export async function searchActiveVolunteersByName(
  rawQuery: unknown,
): Promise<VolunteerSearchResult[]> {
  const { q } = volunteerSearchQuerySchema.parse(
    typeof rawQuery === "string" ? { q: rawQuery } : rawQuery,
  )

  const activeVolunteers = await prisma.volunteer.findMany({
    where: { isActive: true },
    select: { id: true, personId: true },
  })

  if (activeVolunteers.length === 0) {
    return []
  }

  const volunteerIdByPersonId = new Map(
    activeVolunteers.map((v) => [v.personId, v.id] as const),
  )

  const persons = await prisma.person.findMany({
    where: {
      id: { in: activeVolunteers.map((v) => v.personId) },
      ...buildPersonNameWhere(q),
    },
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: VOLUNTEER_SEARCH_MAX_RESULTS,
  })

  const results = persons
    .map((person) => {
      const volunteerId = volunteerIdByPersonId.get(person.id)
      if (!volunteerId) return null

      const fullName = `${person.firstName} ${person.lastName}`.trim()
      return volunteerSearchResultSchema.parse({
        volunteerId,
        personId: person.id,
        fullName,
        firstName: person.firstName.trim(),
        email: person.email?.trim() || null,
      })
    })
    .filter((row): row is VolunteerSearchResult => row !== null)

  return results
}

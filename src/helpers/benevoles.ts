import { requireBenevolesManagement } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/lib/generated/prisma/client"
import type { PaginatedResult } from "@/services/crud.service"
import {
  buildAdminPaginatedResult,
  getAdminSkipTake,
  parseAdminPage,
} from "@/app/(admin)/_shared/_lib/admin-pagination"
import { ADMIN_TABLE_PAGE_SIZE } from "@/app/(admin)/_shared/_schemas/pagination.schema"

const volunteerPersonInclude = {
  address: true,
} satisfies Prisma.PersonInclude

type VolunteerPerson = Prisma.PersonGetPayload<{
  include: typeof volunteerPersonInclude
}>

export type BenevoleListRow = {
  id: string
  personId: string
  createdAt: Date
  updatedAt: Date
  person: VolunteerPerson | null
}

async function enrichVolunteers(
  volunteers: Awaited<ReturnType<typeof prisma.volunteer.findMany>>,
): Promise<BenevoleListRow[]> {
  if (volunteers.length === 0) return []

  const personIds = volunteers.map((v) => v.personId)
  const persons = await prisma.person.findMany({
    where: { id: { in: personIds } },
    include: volunteerPersonInclude,
  })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))

  return volunteers.map((v) => ({
    ...v,
    person: personsById[v.personId] ?? null,
  }))
}

/**
 * Liste complète des bénévoles (usage interne / compatibilité).
 */
export async function getBenevolesForDashboard(): Promise<BenevoleListRow[]> {
  await requireBenevolesManagement()
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } })
  return enrichVolunteers(volunteers)
}

/**
 * Bénévoles paginés pour les dashboards Bureau et Administration.
 */
export async function getBenevolesForDashboardPaginated(
  pageInput?: number,
): Promise<PaginatedResult<BenevoleListRow>> {
  await requireBenevolesManagement()
  const page = parseAdminPage(pageInput)
  const { skip, take } = getAdminSkipTake(page)

  const [volunteers, total] = await Promise.all([
    prisma.volunteer.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.volunteer.count(),
  ])

  const items = await enrichVolunteers(volunteers)
  return buildAdminPaginatedResult(items, total, page, ADMIN_TABLE_PAGE_SIZE)
}

export async function getBenevolesTotalCount(): Promise<number> {
  await requireBenevolesManagement()
  return prisma.volunteer.count()
}

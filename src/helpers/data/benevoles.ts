import { prisma } from "@/lib/prisma"

export type BenevoleListRow = Awaited<ReturnType<typeof getBenevolesForDashboard>>[number]

/**
 * Liste des bénévoles pour les dashboards Bureau et Administration (même source de données).
 */
export async function getBenevolesForDashboard() {
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } })
  if (volunteers.length === 0) return []
  const personIds = volunteers.map((v) => v.personId)
  const persons = await prisma.person.findMany({
    where: { id: { in: personIds } },
    include: { address: true },
  })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return volunteers.map((v) => ({ ...v, person: personsById[v.personId] ?? null }))
}

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { EvenementsList } from "./_components/evenements-list"
import type { EventFilterValue } from "./_components/event-filter"
import type { EvenementListItem } from "./_types/evenement-list-item"

export const metadata: Metadata = { title: "Événements" }

async function getEvenements(): Promise<EvenementListItem[]> {
  const rows = await prisma.event.findMany({ orderBy: { startDate: "desc" } })

  return rows.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    imageId: event.imageId,
    published: event.published,
    startDate: event.startDate.toISOString(),
  }))
}

export default async function EvenementsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter: rawFilter } = await searchParams
  const activeFilter = (
    ["upcoming", "published"].includes(rawFilter ?? "") ? rawFilter : "ALL"
  ) as EventFilterValue

  const all = await getEvenements()
  const now = new Date()

  const counts: Record<EventFilterValue, number> = {
    ALL: all.length,
    upcoming: all.filter((e) => new Date(e.startDate) > now).length,
    published: all.filter((e) => e.published).length,
  }

  const evenements =
    activeFilter === "upcoming"
      ? all.filter((e) => new Date(e.startDate) > now)
      : activeFilter === "published"
        ? all.filter((e) => e.published)
        : all

  return (
    <BureauContent
      title="Événements"
      description={`${counts.ALL} événement${counts.ALL > 1 ? "s" : ""}`}
      addHref="/bureau/evenements/nouveau"
      addLabel="Nouvel événement"
    >
      <EvenementsList
        evenements={evenements}
        counts={counts}
        activeFilter={activeFilter}
      />
    </BureauContent>
  )
}

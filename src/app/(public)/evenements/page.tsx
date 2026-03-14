import { prisma } from "@/lib/prisma"
import { EventsClient } from "./_components/events-client"
import type { EventsByYear } from "@/types/events"

async function getEventsByYear(): Promise<EventsByYear> {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "desc" },
  })

  const result: EventsByYear = {}

  for (const event of events) {
    const year = event.startDate.getFullYear()

    if (!result[year]) result[year] = []

    result[year].push({
      id: event.id as unknown as number,
      title: event.title,
      description: event.description ?? "",
      date: new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(event.startDate),
      location: event.location ?? undefined,
      media: event.imageId
        ? [
            {
              id: 1,
              type: "image",
              url: `https://res.cloudinary.com/df3ymbrqe/image/upload/${event.imageId}`,
              description: event.title,
            },
          ]
        : [],
    })
  }

  return result
}

export default async function EventsPage() {
  const eventsData = await getEventsByYear()
  return <EventsClient eventsData={eventsData} />
}

import { prisma } from "@/lib/prisma"
import { EventsClient } from "./_components/events-client"
import type { EventsByYear } from "@/types/events"

const CLOUDINARY_BASE = "https://res.cloudinary.com/df3ymbrqe/image/upload"

function buildImageUrl(publicId: string) {
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${publicId}`
}

/** Construit le tableau media à partir de EventImage ou imageId (rétro-compat) */
function buildEventMedia(
  images: { imageId: string }[],
  imageId: string | null,
  title: string
) {
  if (images.length > 0) {
    return images.map((img, index) => ({
      id: index + 1,
      type: "image" as const,
      url: buildImageUrl(img.imageId),
      description: title,
    }))
  }
  if (imageId) {
    return [
      {
        id: 1,
        type: "image" as const,
        url: buildImageUrl(imageId),
        description: title,
      },
    ]
  }
  return []
}

async function getEventsByYear(): Promise<EventsByYear> {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
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
      media: buildEventMedia(event.images, event.imageId, event.title),
    })
  }

  return result
}

export default async function EventsPage() {
  const eventsData = await getEventsByYear()
  return <EventsClient eventsData={eventsData} />
}

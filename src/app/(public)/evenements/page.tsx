import { prisma } from "@/lib/prisma"
import { EventsClient } from "./_components/events-client"
import type { EventsByYear } from "@/types/events"
import { parseVideoUrl } from "@/lib/video-urls"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

function buildImageUrl(publicId: string) {
  return cloudinaryImageUrl(publicId, "f_auto,q_auto")
}

/** Construit le tableau media à partir de EventImage, EventVideo et imageId (rétro-compat) */
function buildEventMedia(
  images: { imageId: string }[],
  videos: { url: string }[],
  imageId: string | null,
  title: string
) {
  const result: Array<{ id: number; type: "image" | "video"; url: string; description?: string; embedUrl?: string }> = []
  let id = 0

  // Vidéos (YouTube, Vimeo) en premier
  for (const v of videos) {
    const parsed = parseVideoUrl(v.url)
    if (parsed) {
      result.push({
        id: ++id,
        type: "video",
        url: parsed.thumbnailUrl,
        embedUrl: parsed.embedUrl,
        description: title,
      })
    }
  }

  // Images
  if (images.length > 0) {
    for (const img of images) {
      result.push({
        id: ++id,
        type: "image",
        url: buildImageUrl(img.imageId),
        description: title,
      })
    }
  } else if (imageId) {
    result.push({
      id: ++id,
      type: "image",
      url: buildImageUrl(imageId),
      description: title,
    })
  }

  return result
}

async function getEventsByYear(): Promise<EventsByYear> {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "desc" },
    include: {
      images: { orderBy: { order: "asc" } },
      videos: { orderBy: { order: "asc" } },
    },
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
      media: buildEventMedia(event.images, event.videos, event.imageId, event.title),
    })
  }

  return result
}

export default async function EventsPage() {
  const eventsData = await getEventsByYear()
  return <EventsClient eventsData={eventsData} />
}

import { prisma } from "@/lib/prisma"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"
import {
  ASSOCIATION_CONTENT_KEYS,
  type AssociationContentKey,
  type AssociationContentRow,
  type AboutUsPublicData,
  type PresidentPublicData,
  associationContentRowSchema,
} from "./_schemas/association-content.schema"

const PRESIDENT_IMAGE_TRANSFORM = "w_800,h_1000,c_fill,q_auto,f_auto"
const ABOUT_IMAGE_TRANSFORM = "w_1200,h_675,c_fill,q_auto,f_auto"

function parseItems(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null
  const items = raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
  return items.length > 0 ? items : null
}

function toRow(row: {
  id: string
  key: string
  title: string | null
  body: string | null
  imageId: string | null
  intro: string | null
  items: unknown
  conclusion: string | null
}): AssociationContentRow | null {
  const parsed = associationContentRowSchema.safeParse({
    id: row.id,
    key: row.key,
    title: row.title,
    body: row.body,
    imageId: row.imageId,
    intro: row.intro,
    items: parseItems(row.items),
    conclusion: row.conclusion,
  })
  return parsed.success ? parsed.data : null
}

function resolveImageUrl(imageId: string | null | undefined, transform: string): string {
  if (!imageId?.trim()) return ""
  return cloudinaryImageUrl(imageId, transform)
}

/**
 * Récupère une ligne de contenu association par clé.
 */
export async function getAssociationContentByKey(
  key: AssociationContentKey,
): Promise<AssociationContentRow | null> {
  const row = await prisma.associationPageContent.findUnique({ where: { key } })
  if (!row) return null
  return toRow(row)
}

/**
 * Récupère toutes les lignes de contenu association indexées par clé.
 */
export async function getAssociationContentMap(): Promise<Partial<Record<AssociationContentKey, AssociationContentRow>>> {
  const rows = await prisma.associationPageContent.findMany()
  const map: Partial<Record<AssociationContentKey, AssociationContentRow>> = {}

  for (const row of rows) {
    const parsed = toRow(row)
    if (parsed) {
      map[parsed.key] = parsed
    }
  }

  return map
}

/**
 * Identité du président depuis Person avec poste PRESIDENT.
 */
export async function getPresidentIdentity(): Promise<{ name: string; role: string; image: string } | null> {
  const presidentPerson = await prisma.person.findFirst({
    where: { poste: { code: "PRESIDENT" } },
    select: {
      firstName: true,
      lastName: true,
      image: true,
      poste: { select: { labelFr: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  if (!presidentPerson) return null

  return {
    name: `${presidentPerson.firstName} ${presidentPerson.lastName}`.trim(),
    role: presidentPerson.poste?.labelFr ?? "Président(e)",
    image: presidentPerson.image ?? "",
  }
}

/**
 * Données publiques « Le Président » (DB + identité bureau).
 */
export async function getPresidentPublicData(): Promise<PresidentPublicData | null> {
  const [identity, content] = await Promise.all([
    getPresidentIdentity(),
    getAssociationContentByKey(ASSOCIATION_CONTENT_KEYS.president),
  ])

  const message = content?.body?.trim()
  if (!message) return null

  const image =
    resolveImageUrl(content?.imageId, PRESIDENT_IMAGE_TRANSFORM) || identity?.image || ""

  if (!identity?.name) return null

  return {
    president: {
      name: identity.name,
      role: identity.role,
      image,
    },
    message: { content: message },
  }
}

/**
 * Données publiques « Qui sommes-nous ? » (DB uniquement).
 */
export async function getAboutUsPublicData(): Promise<AboutUsPublicData | null> {
  const map = await getAssociationContentMap()
  const whoWeAreRow = map[ASSOCIATION_CONTENT_KEYS.whoWeAre]
  const whatWeOfferRow = map[ASSOCIATION_CONTENT_KEYS.whatWeOffer]

  const whoTitle = whoWeAreRow?.title?.trim()
  const whoText = whoWeAreRow?.body?.trim()
  if (!whoTitle || !whoText) return null

  const offerTitle = whatWeOfferRow?.title?.trim()
  const offerIntro = whatWeOfferRow?.intro?.trim()
  const offerItems = whatWeOfferRow?.items ?? []
  const offerConclusion = whatWeOfferRow?.conclusion?.trim()

  if (!offerTitle || !offerIntro || offerItems.length === 0 || !offerConclusion) {
    return null
  }

  return {
    whoWeAre: {
      title: whoTitle,
      text: whoText,
      image: resolveImageUrl(whoWeAreRow?.imageId, ABOUT_IMAGE_TRANSFORM),
    },
    whatWeOffer: {
      title: offerTitle,
      intro: offerIntro,
      items: offerItems,
      conclusion: offerConclusion,
      image: resolveImageUrl(whatWeOfferRow?.imageId, ABOUT_IMAGE_TRANSFORM),
    },
  }
}

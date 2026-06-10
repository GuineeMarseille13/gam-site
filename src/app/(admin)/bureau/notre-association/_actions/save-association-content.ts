"use server"

import { revalidatePath } from "next/cache"
import {
  ASSOCIATION_CONTENT_KEYS,
  savePresidentContentSchema,
  saveWhatWeOfferContentSchema,
  saveWhoWeAreContentSchema,
} from "@/helpers/association-content/_schemas/association-content.schema"
import { resolveAssociationImageId } from "@/helpers/association-content/resolve-image-id"
import { requireBureauContenu } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { deleteSupersededPublicId } from "@/lib/cloudinary-replacement"

export type SaveAssociationContentState =
  | { success: true }
  | { error: string }
  | null

const CLOUDINARY_FOLDER = "gam/association"

type AssociationUpsertData = {
  title?: string | null
  body?: string | null
  imageId?: string | null
  intro?: string | null
  items?: string[]
  conclusion?: string | null
}

async function upsertContent(key: string, data: AssociationUpsertData) {
  const payload = {
    title: data.title ?? null,
    body: data.body ?? null,
    imageId: data.imageId ?? null,
    intro: data.intro ?? null,
    items: data.items ?? undefined,
    conclusion: data.conclusion ?? null,
  }

  await prisma.associationPageContent.upsert({
    where: { key },
    create: { key, ...payload },
    update: payload,
  })
}

/**
 * Enregistre le mot du président (texte + photo carte Fondateur & Président).
 */
export async function savePresidentContentAction(
  _prev: SaveAssociationContentState,
  formData: FormData,
): Promise<SaveAssociationContentState> {
  try {
    await requireBureauContenu()
  } catch {
    return { error: "Accès non autorisé." }
  }

  const parsed = savePresidentContentSchema.safeParse({
    message: formData.get("message"),
    imageId: (formData.get("imageId") as string) || undefined,
  })

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { error: first ?? "Données invalides." }
  }

  try {
    const previous = await prisma.associationPageContent.findUnique({
      where: { key: ASSOCIATION_CONTENT_KEYS.president },
      select: { imageId: true },
    })

    const imageId = await resolveAssociationImageId(formData, CLOUDINARY_FOLDER)

    await upsertContent(ASSOCIATION_CONTENT_KEYS.president, {
      body: parsed.data.message,
      imageId,
    })

    await deleteSupersededPublicId({
      previousPublicId: previous?.imageId,
      nextPublicId: imageId,
      resourceType: "image",
    })

    revalidatePath("/notre-association")
    revalidatePath("/bureau/notre-association/president")
    return { success: true }
  } catch (error: unknown) {
    console.error("[savePresidentContentAction]", error)
    if (error instanceof Error) return { error: error.message }
    return { error: "Enregistrement impossible." }
  }
}

/**
 * Enregistre la section « Qui sommes-nous ? ».
 */
export async function saveWhoWeAreContentAction(
  _prev: SaveAssociationContentState,
  formData: FormData,
): Promise<SaveAssociationContentState> {
  try {
    await requireBureauContenu()
  } catch {
    return { error: "Accès non autorisé." }
  }

  const parsed = saveWhoWeAreContentSchema.safeParse({
    title: formData.get("title"),
    text: formData.get("text"),
    imageId: (formData.get("imageId") as string) || undefined,
  })

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { error: first ?? "Données invalides." }
  }

  try {
    const previous = await prisma.associationPageContent.findUnique({
      where: { key: ASSOCIATION_CONTENT_KEYS.whoWeAre },
      select: { imageId: true },
    })

    const imageId = await resolveAssociationImageId(formData, CLOUDINARY_FOLDER)

    await upsertContent(ASSOCIATION_CONTENT_KEYS.whoWeAre, {
      title: parsed.data.title,
      body: parsed.data.text,
      imageId,
    })

    await deleteSupersededPublicId({
      previousPublicId: previous?.imageId,
      nextPublicId: imageId,
      resourceType: "image",
    })

    revalidatePath("/notre-association")
    revalidatePath("/bureau/notre-association/qui-sommes-nous")
    return { success: true }
  } catch (error: unknown) {
    console.error("[saveWhoWeAreContentAction]", error)
    if (error instanceof Error) return { error: error.message }
    return { error: "Enregistrement impossible." }
  }
}

/**
 * Enregistre la section « Que propose l'association ».
 */
export async function saveWhatWeOfferContentAction(
  _prev: SaveAssociationContentState,
  formData: FormData,
): Promise<SaveAssociationContentState> {
  try {
    await requireBureauContenu()
  } catch {
    return { error: "Accès non autorisé." }
  }

  const rawItems = formData.get("items")
  let items: string[] = []

  if (typeof rawItems === "string") {
    try {
      const json: unknown = JSON.parse(rawItems)
      if (Array.isArray(json)) {
        items = json.filter((item): item is string => typeof item === "string")
      }
    } catch {
      return { error: "Format des axes majeurs invalide." }
    }
  }

  const parsed = saveWhatWeOfferContentSchema.safeParse({
    title: formData.get("title"),
    intro: formData.get("intro"),
    items,
    conclusion: formData.get("conclusion"),
    imageId: (formData.get("imageId") as string) || undefined,
  })

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { error: first ?? "Données invalides." }
  }

  try {
    const previous = await prisma.associationPageContent.findUnique({
      where: { key: ASSOCIATION_CONTENT_KEYS.whatWeOffer },
      select: { imageId: true },
    })

    const imageId = await resolveAssociationImageId(formData, CLOUDINARY_FOLDER)

    await upsertContent(ASSOCIATION_CONTENT_KEYS.whatWeOffer, {
      title: parsed.data.title,
      intro: parsed.data.intro,
      items: parsed.data.items,
      conclusion: parsed.data.conclusion,
      imageId,
    })

    await deleteSupersededPublicId({
      previousPublicId: previous?.imageId,
      nextPublicId: imageId,
      resourceType: "image",
    })

    revalidatePath("/notre-association")
    revalidatePath("/bureau/notre-association/qui-sommes-nous")
    return { success: true }
  } catch (error: unknown) {
    console.error("[saveWhatWeOfferContentAction]", error)
    if (error instanceof Error) return { error: error.message }
    return { error: "Enregistrement impossible." }
  }
}

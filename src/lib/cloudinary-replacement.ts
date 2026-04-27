import {
  deleteImage,
  deleteRaw,
  deleteVideo,
} from "@/lib/cloudinary"

export type CloudinaryResourceKind = "image" | "video" | "raw"

/**
 * Indique si la chaîne ressemble à une URL Cloudinary (hébergée sur res.cloudinary.com).
 */
export function isCloudinaryDeliveryUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false
  try {
    return new URL(url.trim()).hostname.endsWith("cloudinary.com")
  } catch {
    return false
  }
}

/**
 * Extrait `public_id` et le type de ressource depuis une URL de livraison Cloudinary standard
 * (chemins produits par nos uploads `secure_url`, sans transformations complexes dans le path).
 */
export function parseCloudinaryDeliveryUrl(url: string): {
  publicId: string
  resourceType: CloudinaryResourceKind
} | null {
  try {
    const u = new URL(url.trim())
    if (!u.hostname.endsWith("cloudinary.com")) return null

    const segments = u.pathname.split("/").filter(Boolean)
    if (segments.length < 4) return null

    const resourceType = segments[1]
    if (resourceType !== "image" && resourceType !== "video" && resourceType !== "raw") {
      return null
    }
    if (segments[2] !== "upload") return null

    let i = 3
    if (/^v\d+$/.test(segments[i] ?? "")) i += 1

    while (i < segments.length) {
      const seg = segments[i]!
      if (seg.includes(",")) {
        i += 1
        continue
      }
      break
    }

    const publicId = segments.slice(i).join("/")
    if (!publicId) return null

    return {
      publicId: decodeURIComponent(publicId),
      resourceType,
    }
  } catch {
    return null
  }
}

async function destroyByKind(publicId: string, resourceType: CloudinaryResourceKind): Promise<void> {
  if (resourceType === "image") await deleteImage(publicId)
  else if (resourceType === "video") await deleteVideo(publicId)
  else await deleteRaw(publicId)
}

/**
 * Suppression best-effort : ne propage pas l’erreur (après persistance DB réussie).
 */
export async function safeDestroyCloudinaryAsset(
  publicId: string,
  resourceType: CloudinaryResourceKind,
): Promise<void> {
  try {
    await destroyByKind(publicId, resourceType)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn("[cloudinary] Suppression ignorée:", publicId, resourceType, msg)
  }
}

/**
 * DB stocke le `public_id` Cloudinary (ex. `imageId` produit / partenaire / équipe).
 * Supprime l’ancienne ressource une fois la nouvelle référence enregistrée.
 */
export async function deleteSupersededPublicId(options: {
  previousPublicId: string | null | undefined
  nextPublicId: string | null | undefined
  resourceType: CloudinaryResourceKind
}): Promise<void> {
  const prev = options.previousPublicId?.trim()
  const next = options.nextPublicId?.trim()
  if (!prev || prev === next) return
  await safeDestroyCloudinaryAsset(prev, options.resourceType)
}

/**
 * DB stocke l’URL complète Cloudinary (ex. `Person.image`, `Review.avatarUrl`).
 */
export async function deleteSupersededCloudinaryUrl(options: {
  previousUrl: string | null | undefined
  nextUrl: string | null | undefined
}): Promise<void> {
  const prevParsed = options.previousUrl?.trim()
    ? parseCloudinaryDeliveryUrl(options.previousUrl.trim())
    : null
  if (!prevParsed) return

  const nextTrim = options.nextUrl?.trim() ?? ""
  const nextParsed = nextTrim ? parseCloudinaryDeliveryUrl(nextTrim) : null

  if (
    nextParsed &&
    nextParsed.publicId === prevParsed.publicId &&
    nextParsed.resourceType === prevParsed.resourceType
  ) {
    return
  }

  await safeDestroyCloudinaryAsset(prevParsed.publicId, prevParsed.resourceType)
}

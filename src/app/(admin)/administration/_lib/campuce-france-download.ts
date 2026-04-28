import {
  cloudinaryImageUrl,
} from "@/lib/cloudinary-delivery"

function mimeToExtension(mime: string): string {
  const m = mime.toLowerCase()
  if (m.includes("pdf")) return "pdf"
  if (m.includes("jpeg")) return "jpg"
  if (m.includes("jpg")) return "jpg"
  if (m.includes("png")) return "png"
  if (m.includes("webp")) return "webp"
  if (m.includes("gif")) return "gif"
  return "bin"
}

function sanitizeFilenameSegment(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "")
    .slice(0, 80) || "fichier"
}

/**
 * Récupère le fichier Cloudinary (image ou raw PDF) — même logique que l’aperçu : image d’abord.
 */
export async function fetchCampuceAttachmentBlob(publicId: string): Promise<Blob> {
  const imageUrl = cloudinaryImageUrl(publicId, "f_auto,q_auto")
  const rawUrl = `/api/administration/campuce-france/attachment?publicId=${encodeURIComponent(
    publicId,
  )}`
  let res = await fetch(imageUrl)
  if (!res.ok) {
    res = await fetch(rawUrl)
  }
  if (!res.ok) {
    throw new Error("Téléchargement impossible : fichier introuvable ou refus réseau.")
  }
  return res.blob()
}

/**
 * Nom de fichier suggéré à partir du blob et du publicId.
 */
export function filenameForCampuceBlob(
  publicId: string,
  index: number,
  blob: Blob,
): string {
  const ext = mimeToExtension(blob.type)
  const tail =
    publicId.split("/").pop()?.replace(/[^\w.-]/g, "_") ?? `piece-${index + 1}`
  const base = tail.includes(".") ? tail.slice(0, tail.lastIndexOf(".")) : tail
  return `${base}.${ext}`
}

/**
 * Déclenche le téléchargement d’un blob dans le navigateur.
 */
export function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.rel = "noopener"
  anchor.style.display = "none"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export { sanitizeFilenameSegment }

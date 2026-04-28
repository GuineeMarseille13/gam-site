/**
 * URLs de livraison Cloudinary (affichage) — une seule source pour le nom du cloud.
 *
 * Définir dans `.env` :
 * - `CLOUDINARY_CLOUD_NAME` — utilisé par le SDK upload (`cloudinary.ts`)
 * - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — même valeur, exposée au bundle client pour construire les URLs `res.cloudinary.com`
 *
 * Si seule `CLOUDINARY_CLOUD_NAME` est définie, elle est utilisée côté serveur ; le client doit avoir la variable **NEXT_PUBLIC_**
 * pour les composants `"use client"`.
 */

const DELIVERY_HOST = "res.cloudinary.com"

function readCloudName(): string | undefined {
  const pub = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
  const server = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  return pub || server || undefined
}

/**
 * Nom du cloud Cloudinary pour les URLs publiques (non secret).
 */
export function getCloudinaryCloudName(): string {
  const name = readCloudName()
  if (!name) {
    throw new Error(
      "Cloudinary : définissez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et CLOUDINARY_CLOUD_NAME dans .env (même valeur).",
    )
  }
  return name
}

/**
 * Préfixe `https://res.cloudinary.com/<cloud>/image/upload` (sans slash final).
 */
export function cloudinaryImageUploadBase(): string {
  return `https://${DELIVERY_HOST}/${getCloudinaryCloudName()}/image/upload`
}

/**
 * Image : `.../image/upload/[transformations/]publicId`
 *
 * @param transform — chaîne Cloudinary avant le public_id (ex. `w_400,h_400,c_fill,q_auto,f_auto`)
 */
export function cloudinaryImageUrl(publicId: string, transform?: string): string {
  const base = cloudinaryImageUploadBase()
  const t = transform?.trim()
  return t ? `${base}/${t}/${publicId}` : `${base}/${publicId}`
}

/**
 * Vidéo : `.../video/upload/[transformations/]publicId`
 */
export function cloudinaryVideoUrl(publicId: string, transform?: string): string {
  const cloud = getCloudinaryCloudName()
  const t = transform?.trim()
  const base = `https://${DELIVERY_HOST}/${cloud}/video/upload`
  return t ? `${base}/${t}/${publicId}` : `${base}/${publicId}`
}

/**
 * Fichier brut Cloudinary (`resource_type: raw`, ex. PDF déposés via `uploadPdf`).
 * Préfixe `.../raw/upload/` (sans slash final).
 */
export interface CloudinaryRawDeliveryOptions {
  /**
   * Transformations/flags Cloudinary insérés avant le publicId.
   * Ex: `fl_inline` pour forcer l’affichage des PDFs dans un iframe.
   */
  transform?: string
  /**
   * Extension/format à suffixer au publicId (sans point). Ex: `pdf`.
   * Recommandé pour les assets `resource_type: raw`.
   */
  format?: string
}

export function cloudinaryRawUploadUrl(
  publicId: string,
  options?: CloudinaryRawDeliveryOptions,
): string {
  const cloud = getCloudinaryCloudName()
  const t = options?.transform?.trim()
  const f = options?.format?.trim()
  const suffix = f ? `.${f.replace(/^\./, "")}` : ""
  const base = `https://${DELIVERY_HOST}/${cloud}/raw/upload`
  return t ? `${base}/${t}/${publicId}${suffix}` : `${base}/${publicId}${suffix}`
}

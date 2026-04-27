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

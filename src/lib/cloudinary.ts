import { v2 as cloudinary } from 'cloudinary'

let isConfigured = false

function ensureCloudinaryConfig() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not set in environment variables')
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    isConfigured = true
  }
}

export interface UploadImageResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

export interface UploadVideoResult {
  url: string
  publicId: string
  duration: number
  format: string
  size: number
  thumbnail: string
}

export interface UploadPdfResult {
  url: string
  publicId: string
  format: string
  size: number
  originalFilename: string
}

export async function uploadImage(
  file: File | Buffer,
  folder?: string
): Promise<UploadImageResult> {
  ensureCloudinaryConfig()
  
  const buffer = file instanceof File 
    ? Buffer.from(await file.arrayBuffer())
    : file

  const mimeType = file instanceof File && file.type 
    ? file.type.split('/')[1] || 'jpeg'
    : 'jpeg'

  let result
  try {
    result = await cloudinary.uploader.upload(
      `data:image/${mimeType};base64,${buffer.toString('base64')}`,
      {
        folder: folder || 'gam/images',
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('File size too large')) {
      throw new Error(`Le fichier est trop volumineux. La taille maximale autorisée est 10 Mo. Veuillez compresser l'image avant de l'uploader.`)
    }
    throw err
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
  }
}

export async function uploadVideo(
  file: File | Buffer,
  folder?: string
): Promise<UploadVideoResult> {
  ensureCloudinaryConfig()
  
  const buffer = file instanceof File 
    ? Buffer.from(await file.arrayBuffer())
    : file

  const mimeType = file instanceof File && file.type 
    ? file.type.split('/')[1] || 'mp4'
    : 'mp4'

  const result = await cloudinary.uploader.upload(
    `data:video/${mimeType};base64,${buffer.toString('base64')}`,
    {
      folder: folder || 'gam/videos',
      resource_type: 'video',
    }
  )

  return {
    url: result.secure_url,
    publicId: result.public_id,
    duration: Math.round(result.duration || 0),
    format: result.format,
    size: result.bytes,
    thumbnail: result.thumbnail_url || '',
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureCloudinaryConfig()
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

export async function deleteVideo(publicId: string): Promise<void> {
  ensureCloudinaryConfig()
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
}

export async function deleteRaw(publicId: string): Promise<void> {
  ensureCloudinaryConfig()
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
}

/**
 * Suppression robuste d'une pièce Campus France (image ou PDF raw).
 * Cloudinary peut stocker certains fichiers en `image` ou `raw` selon le type.
 */
export async function deleteCampuceFranceAttachment(
  publicId: string,
): Promise<void> {
  ensureCloudinaryConfig()

  try {
    await deleteRaw(publicId)
    return
  } catch {
    // noop
  }

  try {
    await deleteImage(publicId)
  } catch {
    // noop
  }
}

export async function uploadPdf(
  file: File | Buffer,
  folder?: string
): Promise<UploadPdfResult> {
  ensureCloudinaryConfig()

  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

  const result = await new Promise<{
    secure_url: string
    public_id: string
    format?: string
    bytes: number
    original_filename?: string
  }>((resolve, reject) => {
    // Cloudinary PDF uploads use resource_type: "raw".
    // upload_stream évite les soucis liés aux data-URI/base64 (tailles, content-type, encodage).
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || "gam/pdfs",
        resource_type: "raw",
      },
      (error, uploaded) => {
        if (error) {
          reject(error)
          return
        }
        if (
          !uploaded ||
          typeof uploaded.secure_url !== "string" ||
          typeof uploaded.public_id !== "string" ||
          typeof uploaded.bytes !== "number"
        ) {
          reject(new Error("Cloudinary: réponse upload PDF invalide."))
          return
        }
        resolve(uploaded)
      },
    )
    stream.end(buffer)
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format || 'pdf',
    size: result.bytes,
    originalFilename: result.original_filename || '',
  }
}

const CAMPUCE_FOLDER = 'gam/campuce-france'
const ACCEPTED_CAMPUCE_IMAGE = ['image/jpeg', 'image/png', 'image/webp'] as const

/**
 * Pièce jointe formulaire Campus France (PDF ou image).
 */
export async function uploadCampuceFranceAttachment(
  file: File,
): Promise<{ publicId: string }> {
  const type = file.type
  if ((ACCEPTED_CAMPUCE_IMAGE as readonly string[]).includes(type)) {
    const r = await uploadImage(file, CAMPUCE_FOLDER)
    return { publicId: r.publicId }
  }
  if (type === 'application/pdf') {
    const r = await uploadPdf(file, CAMPUCE_FOLDER)
    return { publicId: r.publicId }
  }
  throw new Error('FORMAT_FICHIER')
}

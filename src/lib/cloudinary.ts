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

export async function uploadPdf(
  file: File | Buffer,
  folder?: string
): Promise<UploadPdfResult> {
  ensureCloudinaryConfig()

  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

  // Cloudinary PDF uploads use resource_type: "raw"
  const result = await cloudinary.uploader.upload(
    `data:application/pdf;base64,${buffer.toString('base64')}`,
    {
      folder: folder || 'gam/pdfs',
      resource_type: 'raw',
    }
  )

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format || 'pdf',
    size: result.bytes,
    originalFilename: result.original_filename || '',
  }
}

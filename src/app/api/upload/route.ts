import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

/**
 * POST /api/upload
 * Upload simple d'une image vers Cloudinary.
 * Retourne { publicId, url } sans persistance en base.
 *
 * Body (multipart/form-data):
 *   file    : File   — image à uploader (requis)
 *   folder  : string — dossier Cloudinary (défaut: "gam/images")
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'gam/images'

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const result = await uploadImage(file, folder)

    return NextResponse.json({ publicId: result.publicId, url: result.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}

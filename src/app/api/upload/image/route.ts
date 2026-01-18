import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { createCrudService } from '@/services/crud.service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const page = formData.get('page') as string || 'HOME'
    const section = formData.get('section') as string || 'CAROUSEL'
    const title = formData.get('title') as string || file.name
    const alt = formData.get('alt') as string || file.name

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload vers Cloudinary
    const uploadResult = await uploadImage(file, `gam/${page}/${section}`)

    // Sauvegarder dans la base de données
    const imageService = createCrudService('Image')
    const image = await imageService.create({
      url: uploadResult.url,
      alt,
      title,
      page,
      section,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      size: uploadResult.size,
      isActive: true,
    })

    return NextResponse.json({
      success: true,
      image,
      cloudinary: {
        publicId: uploadResult.publicId,
        url: uploadResult.url,
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
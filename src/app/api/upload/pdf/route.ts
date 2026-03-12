import { NextRequest, NextResponse } from 'next/server'
import { uploadPdf } from '@/lib/cloudinary'
import { createCrudService } from '@/services/crud.service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const file = formData.get('file') as File | null
    const yearRaw = formData.get('year') as string | null
    const label = (formData.get('label') as string | null) ?? null
    const reportActivitySectionId = (formData.get('reportActivitySectionId') as string | null) ?? null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Guard: only allow PDF
    if (file.type && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    const year = yearRaw ? Number(yearRaw) : new Date().getFullYear()
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
    }

    // Upload vers Cloudinary
    const uploadResult = await uploadPdf(file, `gam/report-activities/${year}`)

    // Sauvegarder dans la base de données
    const reportActivityService = createCrudService('ReportActivity')
    const reportActivity = await reportActivityService.create({
      label,
      year,
      pdfUrl: uploadResult.url,
      reportActivitySectionId,
    })

    return NextResponse.json({
      success: true,
      reportActivity,
      cloudinary: {
        publicId: uploadResult.publicId,
        url: uploadResult.url,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { contactFormSchema } from "@/app/(public)/contacts/_schemas/contact.schema"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const validatedData = contactFormSchema.parse(body)

    await prisma.contactSubmission.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, subject, message } = body

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    await prisma.contactSubmission.create({
      data: { firstName, lastName, email, phone: phone || null, subject, message },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

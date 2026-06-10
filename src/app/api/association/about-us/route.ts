import { NextResponse } from "next/server"

import { getAboutUsPublicData } from "@/helpers/association-content/queries"
import { aboutUsPublicSchema } from "@/helpers/association-content/_schemas/association-content.schema"

/**
 * GET /api/association/about-us — Sections « Qui sommes-nous ? » (page Notre association).
 */
export async function GET() {
  try {
    const data = await getAboutUsPublicData()
    if (!data) {
      return NextResponse.json({ error: "Contenu non configuré" }, { status: 404 })
    }

    const parsed = aboutUsPublicSchema.parse(data)
    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    })
  } catch (error: unknown) {
    console.error("[GET /api/association/about-us]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

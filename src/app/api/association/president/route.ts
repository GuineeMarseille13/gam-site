import { NextResponse } from "next/server"

import { getPresidentPublicData } from "@/helpers/association-content/queries"
import { presidentPublicSchema } from "@/helpers/association-content/_schemas/association-content.schema"

/**
 * GET /api/association/president — Mot du président (page Notre association).
 */
export async function GET() {
  try {
    const data = await getPresidentPublicData()
    if (!data) {
      return NextResponse.json({ error: "Contenu non configuré" }, { status: 404 })
    }

    const parsed = presidentPublicSchema.parse(data)
    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    })
  } catch (error: unknown) {
    console.error("[GET /api/association/president]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

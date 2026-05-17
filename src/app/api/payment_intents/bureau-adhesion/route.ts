import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { sessionCanAccessBureauPaiements } from "@/helpers/api-dashboard-auth"
import { adhesionPayloadWithYearSchema } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { createAdhesionStripePaymentIntent } from "@/app/(public)/adhesion/_services/create-adhesion-stripe-payment-intent"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !sessionCanAccessBureauPaiements(session.user.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = adhesionPayloadWithYearSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { members, message, membershipYear } = parsed.data

  try {
    const result = await createAdhesionStripePaymentIntent({
      members,
      message,
      membershipYear,
      extraMetadata: {
        source: "bureau",
        recorded_by_user_id: session.user.id,
      },
    })

    if (!result.clientSecret) {
      return NextResponse.json(
        { error: "Secret de paiement indisponible" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      membershipYear: result.membershipYear,
    })
  } catch (err) {
    console.error("[payment_intents/bureau-adhesion]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    )
  }
}

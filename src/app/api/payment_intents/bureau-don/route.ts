import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { sessionCanAccessBureauPaiements } from "@/helpers/api-dashboard-auth"
import { donPayloadSchema } from "@/app/(public)/don/_schemas/don.schema"
import { createDonStripePaymentIntent } from "@/app/(public)/don/_services/create-don-stripe-payment-intent"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !sessionCanAccessBureauPaiements(session.user.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = donPayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const result = await createDonStripePaymentIntent({
      donor: parsed.data,
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
    })
  } catch (err) {
    console.error("[payment_intents/bureau-don]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    )
  }
}

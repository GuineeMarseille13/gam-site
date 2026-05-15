import { NextResponse } from "next/server"

import { adhesionPayloadSchema } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { createAdhesionStripePaymentIntent } from "@/app/(public)/adhesion/_services/create-adhesion-stripe-payment-intent"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = adhesionPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { members, message } = parsed.data
    const result = await createAdhesionStripePaymentIntent({ members, message })

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    })
  } catch (err) {
    console.error("Erreur lors de la création du PaymentIntent:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    )
  }
}

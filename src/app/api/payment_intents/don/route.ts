import { NextResponse } from "next/server"

import { donPayloadSchema } from "@/app/(public)/don/_schemas/don.schema"
import { createDonStripePaymentIntent } from "@/app/(public)/don/_services/create-don-stripe-payment-intent"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = donPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const result = await createDonStripePaymentIntent({ donor: parsed.data })

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    })
  } catch (err) {
    console.error("Erreur lors de la création du PaymentIntent pour don:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    )
  }
}

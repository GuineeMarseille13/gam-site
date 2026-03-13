import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { donPayloadSchema } from '@/app/(public)/don/_schemas/don.schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = donPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, amount, message } = parsed.data
    const amountInCents = Math.round(amount * 100) // Montant en centimes

    // Créer un PaymentIntent avec uniquement les cartes
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        type: 'donation',
        firstName,
        lastName,
        email: email || '',
        phone: phone || '',
        amount: amount.toString(),
        message: message || '',
      },
      payment_method_types: ['card'],
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('Erreur lors de la création du PaymentIntent pour don:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}


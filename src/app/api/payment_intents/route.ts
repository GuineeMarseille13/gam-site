import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { adhesionPayloadSchema, PRICE_PER_MEMBER_EUR } from '@/app/(public)/adhesion/_schemas/adhesion.schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = adhesionPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { members, message } = parsed.data
    const quantity = members.length
    const amount = quantity * PRICE_PER_MEMBER_EUR * 100 // Montant en centimes

    // Créer un PaymentIntent avec uniquement les cartes
    // Permet de preparer stripe pour un paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        type: 'adhesion',
        members_count: quantity.toString(),
        members: JSON.stringify(members),
        message: message || '',
      },
      payment_method_types: ['card'],
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('Erreur lors de la création du PaymentIntent:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}


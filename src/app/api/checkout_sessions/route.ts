import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { adhesionPayloadSchema, PRICE_PER_MEMBER_EUR } from '@/app/adhesion/_schemas/adhesion.schema'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || 'http://localhost:3000'

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

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Adhésion${quantity > 1 ? 's' : ''} à l'association`,
              description: `${quantity} personne${quantity > 1 ? 's' : ''}`,
            },
            unit_amount: PRICE_PER_MEMBER_EUR * 100, // Prix unitaire en centimes
          },
          quantity,
        },
      ],
      metadata: {
        members_count: quantity.toString(),
        members: JSON.stringify(members),
        message: message || '',
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/adhesion`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Erreur lors de la création de la session Stripe:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
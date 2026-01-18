import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { checkoutDataSchema, cartItemSchema } from '@/app/boutique/_schemas/product.schema'
import { z } from 'zod'

const cartCheckoutSchema = z.object({
  items: z.array(cartItemSchema),
  customer: checkoutDataSchema,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = cartCheckoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, customer } = parsed.data
    
    // Calculer le montant total
    const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const amountInCents = Math.round(totalAmount * 100) // Montant en centimes

    // Créer un PaymentIntent avec uniquement les cartes
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        type: 'order',
        items: JSON.stringify(items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        }))),
        itemsCount: items.length.toString(),
        customer: JSON.stringify(customer),
      },
      payment_method_types: ['card'],
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('Erreur lors de la création du PaymentIntent pour panier:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}


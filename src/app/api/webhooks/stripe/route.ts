import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { rollbackPaymentIfRecorded } from '@/app/api/webhooks/_services/payment-rollback.service'
import { saveAdhesionFromPaymentIntent, saveAdhesionFromStripeSession } from '@/app/(public)/adhesion/_services/adhesion.service'
import { saveDonFromPaymentIntent } from '@/app/(public)/don/_services/don.service'
import { saveOrderFromPaymentIntent } from '@/app/(public)/boutique/_services/order.service'

// Désactiver le parsing automatique du body pour les webhooks Stripe
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET n\'est pas configuré')
      return NextResponse.json(
        { error: 'Configuration webhook manquante' },
        { status: 500 }
      )
    }

    const body = await request.text()

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      ) as Stripe.Event
    } catch (err) {
      console.error('Erreur de vérification de signature webhook:', err)
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      )
    }

    // Succès : enregistrer le paiement + l'action selon le type (don, adhésion, commande)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`[Webhook] PaymentIntent status=${paymentIntent.status}, metadata=`, paymentIntent.metadata)
      if (paymentIntent.status === 'succeeded' && paymentIntent.metadata?.type) {
        await handlePaymentSuccess(paymentIntent)
      } else {
        console.log(`[Webhook] PaymentIntent ignoré: status=${paymentIntent.status}, type=${paymentIntent.metadata?.type || 'ABSENT'}`)
      }
      return NextResponse.json({ received: true })
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'payment' && session.payment_status === 'paid') {
        await handleCheckoutSessionSuccess(session)
      }
      return NextResponse.json({ received: true })
    }

    // 3. Échec / annulation : supprimer le paiement et l’entité liée s’ils avaient été enregistrés
    if (event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.canceled') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await rollbackPaymentIfRecorded(paymentIntent.id)
      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Erreur dans le webhook Stripe:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log(`[Webhook] handlePaymentSuccess: paymentIntent=${paymentIntent}`)
  const type = paymentIntent.metadata?.type ?? ''
  try {
    switch (type) {
      case 'adhesion':
        await saveAdhesionFromPaymentIntent(paymentIntent)
        console.log(`Adhésion enregistrée pour le PaymentIntent: ${paymentIntent.id}`)
        break
      case 'donation':
        await saveDonFromPaymentIntent(paymentIntent)
        console.log(`Don enregistré pour le PaymentIntent: ${paymentIntent.id}`)
        break
      case 'order':
        await saveOrderFromPaymentIntent(paymentIntent)
        console.log(`Commande enregistrée pour le PaymentIntent: ${paymentIntent.id}`)
        break
      default:
        console.log(`Type de paiement non géré: ${type} pour le PaymentIntent: ${paymentIntent.id}`)
    }
  } catch (err) {
    console.error(`Erreur lors de l'enregistrement du paiement (type=${type}):`, err)
  }
}

async function handleCheckoutSessionSuccess(session: Stripe.Checkout.Session): Promise<void> {
  try {
    await saveAdhesionFromStripeSession(session)
    console.log(`Adhésion enregistrée pour la session: ${session.id}`)
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'adhésion (session):', err)
  }
}

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { saveAdhesionFromPaymentIntent, saveAdhesionFromStripeSession } from '@/app/adhesion/_services/adhesion.service'
import { saveDonFromPaymentIntent } from '@/app/don/_services/don.service'
import { saveOrderFromPaymentIntent } from '@/app/boutique/_services/order.service'

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

    // Récupérer le body brut pour la vérification de signature
    const body = await request.text()

    let event: Stripe.Event

    try {
      // Vérifier la signature du webhook
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

    // Gérer les événements pertinents
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Vérifier que le paiement est bien complété
        if (paymentIntent.status === 'succeeded' && paymentIntent.metadata?.type) {
          try {
            const type = paymentIntent.metadata.type

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
            console.error('Erreur lors de l\'enregistrement du paiement:', err)
            // Ne pas retourner d'erreur pour éviter que Stripe réessaie indéfiniment
            // On log l'erreur pour investigation manuelle
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Vérifier que c'est bien une session de paiement (pas un abonnement)
        if (session.mode === 'payment' && session.payment_status === 'paid') {
          try {
            await saveAdhesionFromStripeSession(session)
            console.log(`Adhésion enregistrée pour la session: ${session.id}`)
          } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'adhésion:', err)
            // Ne pas retourner d'erreur pour éviter que Stripe réessaie indéfiniment
            // On log l'erreur pour investigation manuelle
          }
        }
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'payment') {
          try {
            await saveAdhesionFromStripeSession(session)
            console.log(`Adhésion enregistrée (paiement asynchrone) pour la session: ${session.id}`)
          } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'adhésion:', err)
          }
        }
        break
      }

      default:
        // Événements non gérés (on les ignore silencieusement)
        console.log(`Événement non géré: ${event.type}`)
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


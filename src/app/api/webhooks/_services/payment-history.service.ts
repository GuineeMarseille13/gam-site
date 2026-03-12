import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@/types/paiement-status'

/** Référence Stripe (PaymentIntent id ou Checkout Session id) utilisée comme paymentId dans l'historique */
const STRIPE_ID_MAX_LENGTH = 255

function truncateStripeId(id: string): string {
  return id.length > STRIPE_ID_MAX_LENGTH ? id.slice(0, STRIPE_ID_MAX_LENGTH) : id
}

function mapPaymentIntentStatusToPaymentStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
  switch (status) {
    case 'succeeded':
      return PaymentStatus.PAID
    case 'canceled':
      return PaymentStatus.CANCELLED
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
    case 'processing':
      return PaymentStatus.PENDING
    default:
      return PaymentStatus.FAILED
  }
}

/**
 * Récupère le personId depuis les métadonnées d'un PaymentIntent (adhesion: id, donation: id, order: customer.id).
 */
function getPersonIdFromPaymentIntentMetadata(metadata: Stripe.Metadata): string | null {
  const personId = metadata.id ?? metadata.personId
  if (personId) return personId
  const customerJson = metadata.customer
  if (customerJson) {
    try {
      const customer = JSON.parse(customerJson) as { id?: string }
      return customer.id ?? null
    } catch {
      return null
    }
  }
  return null
}

/**
 * Récupère le type de paiement depuis les métadonnées (adhesion, donation, order).
 */
function getTypeFromPaymentIntentMetadata(metadata: Stripe.Metadata): string {
  return metadata.type ?? 'unknown'
}

/**
 * Enregistre une entrée dans l'historique des paiements à partir d'un événement Stripe.
 * Appelé systématiquement pour chaque événement payment_intent.* et checkout.session.*.
 */
export async function savePaymentHistoryFromEvent(event: Stripe.Event): Promise<void> {
  try {
    if (event.type.startsWith('payment_intent.')) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const metadata = paymentIntent.metadata ?? {}
      const personId = getPersonIdFromPaymentIntentMetadata(metadata)
      if (!personId) {
        // Le personId sera créé par les services métier (don, adhesion, order)
        // L'historique sera enregistré sans personId pour traçabilité
        console.log(`[PaymentHistory] Pas de personId dans les metadata pour ${event.type}, PaymentIntent: ${paymentIntent.id} — ignoré (sera géré par le service métier)`)
        return
      }
      const status = mapPaymentIntentStatusToPaymentStatus(paymentIntent.status)
      const type = getTypeFromPaymentIntentMetadata(metadata)
      await prisma.paymentHistory.create({
        data: {
          paymentId: truncateStripeId(paymentIntent.id),
          personId,
          status,
          type,
          paymentDate: new Date(),
        },
      })
      console.log(`[PaymentHistory] Enregistré: ${event.type} → ${status}, type=${type}, paymentId=${paymentIntent.id}`)
      return
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'payment') return
      const metadata = session.metadata ?? {}
      const personId = metadata.id ?? metadata.personId ?? null
      if (!personId) {
        console.log(`[PaymentHistory] Pas de personId dans les metadata pour ${event.type}, session: ${session.id} — ignoré (sera géré par le service métier)`)
        return
      }
      await prisma.paymentHistory.create({
        data: {
          paymentId: truncateStripeId(session.id),
          personId,
          status: PaymentStatus.PAID,
          type: (metadata.type as string) ?? 'adhesion',
          paymentDate: new Date(),
        },
      })
      console.log(`[PaymentHistory] Enregistré: ${event.type}, session=${session.id}`)
    }
  } catch (err) {
    console.error('[PaymentHistory] Erreur lors de l\'enregistrement:', err)
    // Ne pas relancer pour éviter d'échouer le webhook et les retentatives Stripe
  }
}

import Stripe from 'stripe'
import { dispatchAdhesionConfirmationEmail } from '@/helpers/email/_services/dispatch-adhesion-confirmation-email'
import { prisma } from '@/lib/prisma'
import { persistAdhesionRecords } from './persist-adhesion-records'
import { parseAdhesionMembersFromMetadata } from './parse-adhesion-members'

/**
 * Sauvegarde une adhésion à partir d'un PaymentIntent Stripe complété
 * @param paymentIntent - Le PaymentIntent Stripe complété
 */
export async function saveAdhesionFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    // Vérifier que le PaymentIntent a les métadonnées nécessaires
    if (!paymentIntent.metadata) {
      throw new Error('Métadonnées manquantes dans le PaymentIntent Stripe')
    }

    const { members: membersJson, members_count } = paymentIntent.metadata

    if (!membersJson || !members_count) {
      throw new Error('Données des membres manquantes dans les métadonnées')
    }

    const members = parseAdhesionMembersFromMetadata(membersJson)
    const totalAmount = paymentIntent.amount / 100

    // Vérifier si l'adhésion existe déjà (éviter les doublons)
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingPayment) {
      console.log(`Paiement déjà enregistré pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    const membershipYear = Number.isFinite(
      Number(paymentIntent.metadata.membership_year),
    )
      ? Number(paymentIntent.metadata.membership_year)
      : undefined

    const paymentMethodLabel = paymentIntent.payment_method_types[0] ?? "card"

    await prisma.$transaction(async (tx) => {
      await persistAdhesionRecords(tx, {
        members,
        totalAmountEur: totalAmount,
        paymentReference: paymentIntent.id,
        paymentMethod: paymentMethodLabel,
        membershipYear,
      })
    })

    dispatchAdhesionConfirmationEmail({
      members,
      totalAmountEur: totalAmount,
      paymentReference: paymentIntent.id,
      membershipYear,
      paymentMethodLabel,
    })

    console.log(`Adhésion sauvegardée: ${members.length} membre(s), montant: ${totalAmount}€`)
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2002') {
      console.log(`Adhésion déjà enregistrée (doublon détecté) pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }
    console.error('Erreur dans saveAdhesionFromPaymentIntent:', err)
    throw err
  }
}

/**
 * Sauvegarde une adhésion à partir d'une session Stripe complétée (pour compatibilité)
 * @param session - La session Stripe Checkout complétée
 */
export async function saveAdhesionFromStripeSession(
  session: Stripe.Checkout.Session
): Promise<void> {
  try {
    // Vérifier que la session a les métadonnées nécessaires
    if (!session.metadata) {
      throw new Error('Métadonnées manquantes dans la session Stripe')
    }

    const { members: membersJson, members_count } = session.metadata

    if (!membersJson || !members_count) {
      throw new Error('Données des membres manquantes dans les métadonnées')
    }

    const members = parseAdhesionMembersFromMetadata(membersJson)
    const totalAmount = parseFloat(session.amount_total?.toString() || "0") / 100

    // Vérifier si l'adhésion existe déjà (éviter les doublons)
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentReference: session.id,
      },
    })

    if (existingPayment) {
      console.log(`Adhésion déjà enregistrée pour la session: ${session.id}`)
      return
    }

    const membershipYear =
      typeof session.metadata?.membership_year === "string" &&
      Number.isFinite(Number(session.metadata.membership_year))
        ? Number(session.metadata.membership_year)
        : undefined

    const paymentMethodLabel = session.payment_method_types?.[0] ?? "card"

    await prisma.$transaction(async (tx) => {
      await persistAdhesionRecords(tx, {
        members,
        totalAmountEur: totalAmount,
        paymentReference: session.id,
        paymentMethod: paymentMethodLabel,
        membershipYear,
      })
    })

    dispatchAdhesionConfirmationEmail({
      members,
      totalAmountEur: totalAmount,
      paymentReference: session.id,
      membershipYear,
      paymentMethodLabel,
    })

    console.log(`Adhésion sauvegardée: ${members.length} membre(s), montant: ${totalAmount}€`)
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2002') {
      console.log(`Adhésion déjà enregistrée (doublon détecté) pour la session: ${session.id}`)
      return
    }
    console.error('Erreur dans saveAdhesionFromStripeSession:', err)
    throw err
  }
}

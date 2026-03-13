import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { donPayloadSchema } from '../_schemas/don.schema'
import { PaymentStatus } from '@/types/paiement-status'
import { findOrCreatePerson } from '@/lib/person.utils'

/**
 * Sauvegarde un don à partir d'un PaymentIntent Stripe complété
 * @param paymentIntent - Le PaymentIntent Stripe complété
 */
export async function saveDonFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    // Vérifier que le PaymentIntent a les métadonnées nécessaires
    if (!paymentIntent.metadata) {
      throw new Error('Métadonnées manquantes dans le PaymentIntent Stripe')
    }

    const { firstName, lastName, email, phone, amount, message } = paymentIntent.metadata

    if (!firstName || !lastName || !amount) {
      throw new Error('Données manquantes dans les métadonnées')
    }

    // Valider les données avec le schéma
    const validated = donPayloadSchema.parse({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      amount: parseFloat(amount),
      message: message || undefined,
    })

    // Calculer le montant total
    const totalAmount = paymentIntent.amount / 100

    // Vérifier si le don existe déjà (éviter les doublons)
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingPayment) {
      console.log(`Don déjà enregistré pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    // Operation transactionnelle
    await prisma.$transaction(async (tx) => {
      // Trouver ou créer la personne
      const personId = await findOrCreatePerson(tx, {
        firstName,
        lastName,
        phone: phone || undefined,
        email: email || undefined,
      })

      // Sauvegarder un paiement dans la base de données
      const payment = await tx.payment.create({
        data: {
          paymentReference: paymentIntent.id,
          amount: totalAmount,
          status: PaymentStatus.PAID,
          type: 'donation',
          paymentMethod: paymentIntent.payment_method_types[0],
          personId,
        },
      })

      // Sauvegarder le don dans la base de données
      await tx.donation.create({
        data: {
          personId,
          title: 'Don',
          amount: totalAmount,
          message: message || null,
          paymentId: payment.id,
        },
      })

      // Sauvegarder l'historique de paiement
      await tx.paymentHistory.create({
        data: {
          paymentId: paymentIntent.id,
          personId,
          status: PaymentStatus.PAID,
          type: 'donation',
        },
      })
    })

    console.log(`Don sauvegardé: ${validated.firstName} ${validated.lastName}, montant: ${totalAmount}€`)
  } catch (err) {
    // Ignorer les doublons (race condition entre webhooks simultanés)
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2002') {
      console.log(`Don déjà enregistré (doublon détecté) pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }
    console.error('Erreur dans saveDonFromPaymentIntent:', err)
    throw err
  }
}

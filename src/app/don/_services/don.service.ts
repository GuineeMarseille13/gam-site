import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { DonationStatus } from '@/lib/generated/prisma/enums'
import { donPayloadSchema } from '../_schemas/don.schema'

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
    const existingDon = await prisma.donation.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingDon) {
      console.log(`Don déjà enregistré pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    // Sauvegarder le don dans la base de données
    await prisma.donation.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email || null,
        phone: validated.phone || null,
        amount: totalAmount,
        message: validated.message || null,
        status: DonationStatus.paid,
        paymentMethod: 'stripe',
        paymentReference: paymentIntent.id,
        isAnonymous: false,
      },
    })

    console.log(`Don sauvegardé: ${validated.firstName} ${validated.lastName}, montant: ${totalAmount}€`)
  } catch (err) {
    console.error('Erreur dans saveDonFromPaymentIntent:', err)
    throw err
  }
}


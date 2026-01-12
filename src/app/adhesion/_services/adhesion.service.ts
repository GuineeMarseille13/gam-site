import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { AdhesionStatus } from '@/lib/generated/prisma/enums'
import { memberSchema, type Member } from '../_schemas/adhesion.schema'

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

    const { members: membersJson, members_count, message } = paymentIntent.metadata

    if (!membersJson || !members_count) {
      throw new Error('Données des membres manquantes dans les métadonnées')
    }

    // Parser les membres depuis JSON
    let members: Member[]
    try {
      const parsedMembers = JSON.parse(membersJson) as unknown[]
      
      // Valider chaque membre avec le schéma
      members = parsedMembers.map((m) => {
        const validated = memberSchema.parse(m)
        return validated
      })
    } catch (err) {
      throw new Error(`Erreur lors du parsing des membres: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
    }

    // Calculer le montant total
    const totalAmount = paymentIntent.amount / 100

    // Vérifier si l'adhésion existe déjà (éviter les doublons)
    const existingAdhesion = await prisma.adhesionSubmission.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingAdhesion) {
      console.log(`Adhésion déjà enregistrée pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    // Sauvegarder l'adhésion dans la base de données
    await prisma.adhesionSubmission.create({
      data: {
        members: members as unknown as Record<string, unknown>,
        message: message || null,
        totalAmount,
        status: AdhesionStatus.paid,
        paymentMethod: 'stripe',
        paymentReference: paymentIntent.id,
      },
    })

    console.log(`Adhésion sauvegardée: ${members.length} membre(s), montant: ${totalAmount}€`)
  } catch (err) {
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

    const { members: membersJson, members_count, message } = session.metadata

    if (!membersJson || !members_count) {
      throw new Error('Données des membres manquantes dans les métadonnées')
    }

    // Parser les membres depuis JSON
    let members: Member[]
    try {
      const parsedMembers = JSON.parse(membersJson) as unknown[]
      
      // Valider chaque membre avec le schéma
      members = parsedMembers.map((m) => {
        const validated = memberSchema.parse(m)
        return validated
      })
    } catch (err) {
      throw new Error(`Erreur lors du parsing des membres: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
    }

    // Calculer le montant total
    const totalAmount = parseFloat(session.amount_total?.toString() || '0') / 100

    // Vérifier si l'adhésion existe déjà (éviter les doublons)
    const existingAdhesion = await prisma.adhesionSubmission.findFirst({
      where: {
        paymentReference: session.id,
      },
    })

    if (existingAdhesion) {
      console.log(`Adhésion déjà enregistrée pour la session: ${session.id}`)
      return
    }

    // Sauvegarder l'adhésion dans la base de données
    await prisma.adhesionSubmission.create({
      data: {
        members: members as unknown as Record<string, unknown>,
        message: message || null,
        totalAmount,
        status: AdhesionStatus.paid,
        paymentMethod: 'stripe',
        paymentReference: session.id,
      },
    })

    console.log(`Adhésion sauvegardée: ${members.length} membre(s), montant: ${totalAmount}€`)
  } catch (err) {
    console.error('Erreur dans saveAdhesionFromStripeSession:', err)
    throw err
  }
}


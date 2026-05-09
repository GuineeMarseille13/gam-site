import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@/types/paiement-status'
import { memberSchema, type Member } from '../_schemas/adhesion.schema'
import { findOrCreatePerson } from '@/helpers/person.utils'

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
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingPayment) {
      console.log(`Paiement déjà enregistré pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    // Operation transactionnelle
    await prisma.$transaction(async (tx) => {
      // Trouver ou créer la personne du premier membre (payeur principal)
      const primaryMember = members[0]
      const personId = await findOrCreatePerson(tx, {
        firstName: primaryMember.firstName,
        lastName: primaryMember.lastName,
        phone: primaryMember.phone,
        email: primaryMember.email || undefined,
      })

      // Sauvegarder un paiement dans la base de données
      const payment = await tx.payment.create({
        data: {
          paymentReference: paymentIntent.id,
          amount: totalAmount,
          status: PaymentStatus.PAID,
          type: 'adhesion',
          paymentMethod: paymentIntent.payment_method_types[0],
          personId,
        },
      })

      // Sauvegarder une adhésion pour chaque membre
      for (const member of members) {
        const memberId = await findOrCreatePerson(tx, {
          firstName: member.firstName,
          lastName: member.lastName,
          phone: member.phone,
          email: member.email || undefined,
        })

        // Règle métier : une seule adhésion active par personne.
        // On désactive toute adhésion active existante avant de créer la nouvelle.
        await tx.memberShip.updateMany({
          where: {
            personId: memberId,
            isActive: true,
          },
          data: { isActive: false },
        })

        await tx.memberShip.create({
          data: {
            title: 'Adhésion',
            amount: totalAmount / members.length,
            year: Number.isFinite(Number(paymentIntent.metadata.membership_year))
              ? Number(paymentIntent.metadata.membership_year)
              : new Date().getFullYear(),
            isActive: true,
            personId: memberId,
            paymentId: payment.id,
          },
        })
      }

      // Sauvegarder l'historique de paiement
      await tx.paymentHistory.create({
        data: {
          paymentId: paymentIntent.id,
          personId,
          status: PaymentStatus.PAID,
          type: 'adhesion',
        },
      })
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
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentReference: session.id,
      },
    })

    if (existingPayment) {
      console.log(`Adhésion déjà enregistrée pour la session: ${session.id}`)
      return
    }

    // Operation transactionnelle
    await prisma.$transaction(async (tx) => {
      // Trouver ou créer la personne du premier membre (payeur principal)
      const primaryMember = members[0]
      const personId = await findOrCreatePerson(tx, {
        firstName: primaryMember.firstName,
        lastName: primaryMember.lastName,
        phone: primaryMember.phone,
        email: primaryMember.email || undefined,
      })

      // Sauvegarder un paiement dans la base de données
      const payment = await tx.payment.create({
        data: {
          paymentReference: session.id,
          amount: totalAmount,
          status: PaymentStatus.PAID,
          type: 'adhesion',
          paymentMethod: session.payment_method_types[0],
          personId,
        },
      })

      // Sauvegarder une adhésion pour chaque membre
      for (const member of members) {
        const memberId = await findOrCreatePerson(tx, {
          firstName: member.firstName,
          lastName: member.lastName,
          phone: member.phone,
          email: member.email || undefined,
        })

        // Règle métier : une seule adhésion active par personne.
        await tx.memberShip.updateMany({
          where: {
            personId: memberId,
            isActive: true,
          },
          data: { isActive: false },
        })

        await tx.memberShip.create({
          data: {
            title: 'Adhésion',
            amount: totalAmount / members.length,
            year:
              typeof session.metadata?.membership_year === "string" &&
              Number.isFinite(Number(session.metadata.membership_year))
                ? Number(session.metadata.membership_year)
                : new Date().getFullYear(),
            isActive: true,
            personId: memberId,
            paymentId: payment.id,
          },
        })
      }

      // Sauvegarder l'historique de paiement
      await tx.paymentHistory.create({
        data: {
          paymentId: session.id,
          personId,
          status: PaymentStatus.PAID,
          type: 'adhesion',
        },
      })
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

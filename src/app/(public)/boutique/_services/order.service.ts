import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@/types/paiement-status'
import { findOrCreatePerson } from '@/lib/person.utils'

/**
 * Sauvegarde une commande à partir d'un PaymentIntent Stripe complété
 * @param paymentIntent - Le PaymentIntent Stripe complété
 */
export async function saveOrderFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    // Vérifier que le PaymentIntent a les métadonnées nécessaires
    if (!paymentIntent.metadata) {
      throw new Error('Métadonnées manquantes dans le PaymentIntent Stripe')
    }

    const { items, customer, itemsCount } = paymentIntent.metadata

    if (!items || !customer || !itemsCount) {
      throw new Error('Données manquantes dans les métadonnées')
    }

    // Parser les données
    let parsedItems: Array<{ productId: string; productName: string; quantity: number; price: number }>
    let parsedCustomer: { firstName: string; lastName: string; phone?: string; email?: string }

    try {
      parsedItems = JSON.parse(items) as Array<{ productId: string; productName: string; quantity: number; price: number }>
      parsedCustomer = JSON.parse(customer) as { firstName: string; lastName: string; phone?: string; email?: string }
    } catch (err) {
      throw new Error(`Erreur lors du parsing des données: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
    }

    // Calculer le montant total
    const totalAmount = paymentIntent.amount / 100

    // Vérifier si la commande existe déjà (éviter les doublons)
    const existingPayment = await prisma.payment.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingPayment) {
      console.log(`Commande déjà enregistrée pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // Créer la commande
    await prisma.$transaction(async (tx) => {
      // Trouver ou créer la personne
      const personId = await findOrCreatePerson(tx, {
        firstName: parsedCustomer.firstName,
        lastName: parsedCustomer.lastName,
        phone: parsedCustomer.phone,
        email: parsedCustomer.email,
      })

      // Sauvegarder un paiement dans la base de données
      const payment = await tx.payment.create({
        data: {
          paymentReference: paymentIntent.id,
          amount: totalAmount,
          status: PaymentStatus.PAID,
          type: 'order',
          paymentMethod: paymentIntent.payment_method_types[0],
          personId,
        },
      })

      // Sauvegarder la commande dans la base de données
      await tx.order.create({
        data: {
          orderNumber,
          personId,
          totalAmount,
          paymentId: payment.id,
          items: {
            createMany: {
              data: parsedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price,
              })),
            },
          },
        },
      })

      // Sauvegarder l'historique de paiement
      await tx.paymentHistory.create({
        data: {
          paymentId: paymentIntent.id,
          personId,
          status: PaymentStatus.PAID,
          type: 'order',
        },
      })
    })

    console.log(`Commande sauvegardée: ${orderNumber}, montant: ${totalAmount}€, ${parsedItems.length} article(s)`)
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2002') {
      console.log(`Commande déjà enregistrée (doublon détecté) pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }
    console.error('Erreur dans saveOrderFromPaymentIntent:', err)
    throw err
  }
}

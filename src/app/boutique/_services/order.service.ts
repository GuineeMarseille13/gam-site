import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@/lib/generated/prisma/enums'

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
    const existingOrder = await prisma.order.findFirst({
      where: {
        paymentReference: paymentIntent.id,
      },
    })

    if (existingOrder) {
      console.log(`Commande déjà enregistrée pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    // Générer un numéro de commande unique
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customer: parsedCustomer as unknown as Record<string, unknown>,
        totalAmount,
        status: OrderStatus.paid,
        paymentMethod: 'stripe',
        paymentReference: paymentIntent.id,
        items: {
          create: parsedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    console.log(`Commande sauvegardée: ${orderNumber}, montant: ${totalAmount}€, ${parsedItems.length} article(s)`)
  } catch (err) {
    console.error('Erreur dans saveOrderFromPaymentIntent:', err)
    throw err
  }
}


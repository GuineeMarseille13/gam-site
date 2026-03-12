import { prisma } from '@/lib/prisma'

/**
 * En cas d’échec ou d’annulation Stripe : si un paiement a déjà été enregistré
 * (considéré comme succès), on le supprime ainsi que l’entité liée (adhésion, don ou commande)
 * via la cascade Prisma.
 * @param stripePaymentReference - ID Stripe (PaymentIntent id ou Session id)
 * @returns true si un paiement a été supprimé, false sinon
 */
export async function rollbackPaymentIfRecorded(
  stripePaymentReference: string,
  type: string
): Promise<boolean> {
  const payment = await prisma.payment.findUnique({
    where: { paymentReference: stripePaymentReference },
  })
  if (!payment) return false

  await prisma.payment.delete({
    where: { id: payment.id },
  })
  console.log(
    `[Rollback] Paiement et entité liée (${payment.type}) supprimés pour la référence Stripe: ${stripePaymentReference}`
  )

  if (type === 'adhesion') {
    await prisma.memberShip.delete({
      where: { paymentId: payment.id },
    })
  } else if (type === 'donation') {
    await prisma.donation.delete({
      where: { paymentId: payment.id },
    })
  } else if (type === 'order') {
    const order = await prisma.order.findUnique({
      where: { paymentId: payment.id },
    })
    if (order) {
      await prisma.orderItem.deleteMany({
        where: { orderId: order.id },
      })
    }
  }

  return true
}

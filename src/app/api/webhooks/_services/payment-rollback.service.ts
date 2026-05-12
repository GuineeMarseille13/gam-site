import { prisma } from "@/lib/prisma";

/**
 * En cas d’échec ou d’annulation Stripe : supprime l’entrée `payments` et les entités
 * en cascade (commande, don, adhésion…) ainsi que les lignes d’historique liées.
 *
 * @param stripePaymentReference — ID Stripe (`PaymentIntent` ou `Checkout.Session`)
 * @returns `true` si un paiement en base a été supprimé
 */
export async function rollbackPaymentIfRecorded(
  stripePaymentReference: string,
): Promise<boolean> {
  const payment = await prisma.payment.findUnique({
    where: { paymentReference: stripePaymentReference },
  });

  if (!payment) {
    return false;
  }

  await prisma.paymentHistory.deleteMany({
    where: {
      OR: [{ paymentId: payment.id }, { paymentId: stripePaymentReference }],
    },
  });

  await prisma.payment.delete({
    where: { id: payment.id },
  });

  return true;
}

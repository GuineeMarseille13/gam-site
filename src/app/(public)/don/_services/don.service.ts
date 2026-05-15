import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { persistDonRecords } from "./persist-don-records"
import { parseDonFromPaymentIntentMetadata } from "./parse-don-from-metadata"

/**
 * Sauvegarde un don à partir d'un PaymentIntent Stripe complété.
 */
export async function saveDonFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  try {
    if (!paymentIntent.metadata) {
      throw new Error("Métadonnées manquantes dans le PaymentIntent Stripe")
    }

    const donor = parseDonFromPaymentIntentMetadata(
      paymentIntent.metadata as Record<string, string>,
    )
    const totalAmount = paymentIntent.amount / 100

    const existingPayment = await prisma.payment.findFirst({
      where: { paymentReference: paymentIntent.id },
    })

    if (existingPayment) {
      console.log(`Don déjà enregistré pour le PaymentIntent: ${paymentIntent.id}`)
      return
    }

    await prisma.$transaction(async (tx) => {
      await persistDonRecords(tx, {
        donor,
        totalAmountEur: totalAmount,
        paymentReference: paymentIntent.id,
        paymentMethod: paymentIntent.payment_method_types[0] ?? "card",
      })
    })

    console.log(
      `Don sauvegardé: ${donor.firstName} ${donor.lastName}, montant: ${totalAmount}€`,
    )
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code: string }).code === "P2002") {
      console.log(
        `Don déjà enregistré (doublon détecté) pour le PaymentIntent: ${paymentIntent.id}`,
      )
      return
    }
    console.error("Erreur dans saveDonFromPaymentIntent:", err)
    throw err
  }
}

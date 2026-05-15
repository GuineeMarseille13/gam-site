import { prisma } from "@/lib/prisma"

import { MANUAL_PAYMENT_METHOD_LABELS } from "@/config/bureau-payment-methods"
import type { ManualDonPayload } from "../_schemas/don.schema"
import { persistDonRecords } from "./persist-don-records"

export interface SaveManualDonResult {
  readonly paymentReference: string
  readonly totalAmountEur: number
}

/**
 * Enregistre un don payé hors Stripe (espèces ou virement, saisie bureau).
 */
export async function saveManualDon(payload: ManualDonPayload): Promise<SaveManualDonResult> {
  const { paymentMethod, ...donor } = payload
  const totalAmountEur = donor.amount
  const paymentReference = `manual-donation-${crypto.randomUUID()}`
  const paymentMethodLabel = MANUAL_PAYMENT_METHOD_LABELS[paymentMethod]

  const existingPayment = await prisma.payment.findFirst({
    where: { paymentReference },
  })

  if (existingPayment) {
    return { paymentReference, totalAmountEur }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await persistDonRecords(tx, {
        donor,
        totalAmountEur,
        paymentReference,
        paymentMethod: paymentMethodLabel,
      })
    })
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code: string }).code === "P2002") {
      return { paymentReference, totalAmountEur }
    }
    throw err
  }

  return { paymentReference, totalAmountEur }
}

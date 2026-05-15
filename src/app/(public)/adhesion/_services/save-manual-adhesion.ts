import { prisma } from "@/lib/prisma"

import {
  MANUAL_ADHESION_PAYMENT_METHOD_LABELS,
  computeAdhesionTotalEur,
  resolveMembershipYear,
  type ManualAdhesionPayload,
} from "../_schemas/adhesion.schema"
import { persistAdhesionRecords } from "./persist-adhesion-records"

export interface SaveManualAdhesionResult {
  readonly paymentReference: string
  readonly membershipYear: number
  readonly totalAmountEur: number
}

/**
 * Enregistre une adhésion payée hors Stripe (espèces ou virement).
 */
export async function saveManualAdhesion(
  payload: ManualAdhesionPayload,
): Promise<SaveManualAdhesionResult> {
  const { members, paymentMethod, membershipYear } = payload
  const totalAmountEur = computeAdhesionTotalEur(members.length)
  const paymentReference = `manual-adhesion-${crypto.randomUUID()}`
  const paymentMethodLabel = MANUAL_ADHESION_PAYMENT_METHOD_LABELS[paymentMethod]
  const year = resolveMembershipYear(membershipYear)

  const existingPayment = await prisma.payment.findFirst({
    where: { paymentReference },
  })

  if (existingPayment) {
    return {
      paymentReference,
      membershipYear: year,
      totalAmountEur,
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await persistAdhesionRecords(tx, {
        members,
        totalAmountEur,
        paymentReference,
        paymentMethod: paymentMethodLabel,
        membershipYear: year,
      })
    })
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code: string }).code === "P2002") {
      return {
        paymentReference,
        membershipYear: year,
        totalAmountEur,
      }
    }
    throw err
  }

  return {
    paymentReference,
    membershipYear: year,
    totalAmountEur,
  }
}

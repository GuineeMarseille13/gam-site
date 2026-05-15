import type { PrismaClient } from "@/lib/generated/prisma/client"
import { PaymentStatus } from "@/types/paiement-status"
import { findOrCreatePerson } from "@/helpers/person.utils"
import type { DonPayload } from "../_schemas/don.schema"

type TransactionClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0]

export interface PersistDonRecordsInput {
  readonly donor: DonPayload
  readonly totalAmountEur: number
  readonly paymentReference: string
  readonly paymentMethod: string
}

/**
 * Enregistre paiement, don et historique (transaction Prisma).
 */
export async function persistDonRecords(
  tx: TransactionClient,
  input: PersistDonRecordsInput,
): Promise<void> {
  const { donor, totalAmountEur, paymentReference, paymentMethod } = input

  const personId = await findOrCreatePerson(tx, {
    firstName: donor.firstName,
    lastName: donor.lastName,
    phone: donor.phone || undefined,
    email: donor.email || undefined,
  })

  const payment = await tx.payment.create({
    data: {
      paymentReference,
      amount: totalAmountEur,
      status: PaymentStatus.PAID,
      type: "donation",
      paymentMethod,
      personId,
    },
  })

  await tx.donation.create({
    data: {
      personId,
      title: "Don",
      amount: totalAmountEur,
      message: donor.message || null,
      paymentId: payment.id,
    },
  })

  await tx.paymentHistory.create({
    data: {
      paymentId: paymentReference,
      personId,
      status: PaymentStatus.PAID,
      type: "donation",
    },
  })
}

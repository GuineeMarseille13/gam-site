import type { PrismaClient } from "@/lib/generated/prisma/client"
import { PaymentStatus } from "@/types/paiement-status"
import { findOrCreatePerson } from "@/helpers/person.utils"
import { resolveMembershipYear, type Member } from "../_schemas/adhesion.schema"

type TransactionClient = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0]

export interface PersistAdhesionRecordsInput {
  readonly members: Member[]
  readonly totalAmountEur: number
  readonly paymentReference: string
  readonly paymentMethod: string
  readonly membershipYear?: number
}

/**
 * Enregistre paiement, adhésions et historique (transaction Prisma).
 * Utilisé par le webhook Stripe et les paiements manuels bureau (espèces / virement).
 */
export async function persistAdhesionRecords(
  tx: TransactionClient,
  input: PersistAdhesionRecordsInput,
): Promise<void> {
  const { members, totalAmountEur, paymentReference, paymentMethod } = input
  const year = resolveMembershipYear(input.membershipYear)

  if (members.length === 0) {
    throw new Error("Aucun adhérent à enregistrer")
  }

  const primaryMember = members[0]
  const personId = await findOrCreatePerson(tx, {
    firstName: primaryMember.firstName,
    lastName: primaryMember.lastName,
    phone: primaryMember.phone,
    email: primaryMember.email || undefined,
  })

  const amountPerMember = totalAmountEur / members.length

  for (let index = 0; index < members.length; index++) {
    const member = members[index]
    const memberPersonId = await findOrCreatePerson(tx, {
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone,
      email: member.email || undefined,
    })

    const memberPaymentReference =
      members.length === 1 ? paymentReference : `${paymentReference}#${index}`

    const payment = await tx.payment.create({
      data: {
        paymentReference: memberPaymentReference,
        amount: amountPerMember,
        status: PaymentStatus.PAID,
        type: "adhesion",
        paymentMethod,
        personId,
      },
    })

    await tx.memberShip.updateMany({
      where: {
        personId: memberPersonId,
        isActive: true,
      },
      data: { isActive: false },
    })

    await tx.memberShip.create({
      data: {
        title: "Adhésion",
        amount: amountPerMember,
        year,
        isActive: true,
        personId: memberPersonId,
        paymentId: payment.id,
      },
    })
  }

  await tx.paymentHistory.create({
    data: {
      paymentId: paymentReference,
      personId,
      status: PaymentStatus.PAID,
      type: "adhesion",
    },
  })
}

import type { Member } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { resolveMembershipYear } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import type { AdhesionConfirmationEmailPayload } from "@/helpers/email/_schemas/transaction-email.schema"
import { normalizeRecipientEmail } from "@/helpers/email/_utils/normalize-recipient-email"

interface BuildAdhesionEmailPayloadInput {
  members: Member[]
  totalAmountEur: number
  paymentReference: string
  membershipYear?: number
  paymentMethodLabel?: string
}

/**
 * Construit le payload e-mail adhésion ou null si aucun destinataire valide.
 */
export function buildAdhesionEmailPayload(
  input: BuildAdhesionEmailPayloadInput,
): AdhesionConfirmationEmailPayload | null {
  const primaryMember = input.members[0]
  if (!primaryMember) {
    return null
  }

  const to =
    normalizeRecipientEmail(primaryMember.email) ??
    input.members
      .map((member) => normalizeRecipientEmail(member.email))
      .find((email): email is string => email !== null) ??
    null

  if (!to) {
    return null
  }

  return {
    to,
    recipientFirstName: primaryMember.firstName.trim(),
    members: input.members.map((member) => ({
      firstName: member.firstName.trim(),
      lastName: member.lastName.trim(),
      phone: member.phone.trim(),
    })),
    membershipYear: resolveMembershipYear(input.membershipYear),
    totalAmountEur: input.totalAmountEur,
    paymentReference: input.paymentReference,
    paymentMethodLabel: input.paymentMethodLabel,
  }
}

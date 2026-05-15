import { stripe } from "@/lib/stripe"

import {
  PRICE_PER_MEMBER_EUR,
  resolveMembershipYear,
  type Member,
} from "../_schemas/adhesion.schema"

export interface CreateAdhesionStripePaymentIntentInput {
  readonly members: Member[]
  readonly message?: string
  readonly membershipYear?: number
  readonly extraMetadata?: Record<string, string>
}

export interface CreateAdhesionStripePaymentIntentResult {
  readonly clientSecret: string | null
  readonly paymentIntentId: string
  readonly membershipYear: number
}

/**
 * Crée un PaymentIntent Stripe pour une adhésion (public, bureau ou renouvellement).
 */
export async function createAdhesionStripePaymentIntent(
  input: CreateAdhesionStripePaymentIntentInput,
): Promise<CreateAdhesionStripePaymentIntentResult> {
  const membershipYear = resolveMembershipYear(input.membershipYear)
  const quantity = input.members.length
  const amount = quantity * PRICE_PER_MEMBER_EUR * 100

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    metadata: {
      type: "adhesion",
      membership_year: String(membershipYear),
      members_count: quantity.toString(),
      members: JSON.stringify(input.members),
      message: input.message ?? "",
      ...input.extraMetadata,
    },
    payment_method_types: ["card"],
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    membershipYear,
  }
}

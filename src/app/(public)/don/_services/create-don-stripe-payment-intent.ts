import { stripe } from "@/lib/stripe"

import type { DonPayload } from "../_schemas/don.schema"

export interface CreateDonStripePaymentIntentInput {
  readonly donor: DonPayload
  readonly extraMetadata?: Record<string, string>
}

export interface CreateDonStripePaymentIntentResult {
  readonly clientSecret: string | null
  readonly paymentIntentId: string
}

/**
 * Crée un PaymentIntent Stripe pour un don (public ou bureau).
 */
export async function createDonStripePaymentIntent(
  input: CreateDonStripePaymentIntentInput,
): Promise<CreateDonStripePaymentIntentResult> {
  const { donor } = input
  const amountInCents = Math.round(donor.amount * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "eur",
    metadata: {
      type: "donation",
      firstName: donor.firstName,
      lastName: donor.lastName,
      email: donor.email ?? "",
      phone: donor.phone ?? "",
      amount: donor.amount.toString(),
      message: donor.message ?? "",
      ...input.extraMetadata,
    },
    payment_method_types: ["card"],
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  }
}

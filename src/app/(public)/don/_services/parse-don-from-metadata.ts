import { donPayloadSchema, type DonPayload } from "../_schemas/don.schema"

/**
 * Reconstruit et valide un don depuis les métadonnées Stripe.
 */
export function parseDonFromPaymentIntentMetadata(
  metadata: Record<string, string>,
): DonPayload {
  const { firstName, lastName, email, phone, amount, message } = metadata

  if (!firstName || !lastName || !amount) {
    throw new Error("Données manquantes dans les métadonnées")
  }

  return donPayloadSchema.parse({
    firstName,
    lastName,
    email: email || undefined,
    phone: phone || undefined,
    amount: parseFloat(amount),
    message: message || undefined,
  })
}

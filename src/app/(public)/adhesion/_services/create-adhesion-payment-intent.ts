import {
  adhesionPayloadWithYearSchema,
  type AdhesionPayloadWithYear,
} from "../_schemas/adhesion.schema";
import {
  paymentIntentResponseSchema,
  type PaymentIntentResponse,
} from "../_schemas/payment-intent.schema";
import { fetchAdhesionApiError } from "./fetch-adhesion-api-error";

export const ADHESION_PAYMENT_INTENT_CHANNELS = {
  public: "public",
  bureau: "bureau",
} as const;

export type AdhesionPaymentIntentChannel =
  (typeof ADHESION_PAYMENT_INTENT_CHANNELS)[keyof typeof ADHESION_PAYMENT_INTENT_CHANNELS];

const PAYMENT_INTENT_ENDPOINTS: Record<AdhesionPaymentIntentChannel, string> = {
  public: "/api/payment_intents",
  bureau: "/api/payment_intents/bureau-adhesion",
};

/**
 * Crée un PaymentIntent Stripe via l’API interne (public ou bureau).
 */
export async function createAdhesionPaymentIntent(
  payload: AdhesionPayloadWithYear,
  options?: { readonly channel?: AdhesionPaymentIntentChannel },
): Promise<PaymentIntentResponse> {
  const channel = options?.channel ?? ADHESION_PAYMENT_INTENT_CHANNELS.public;
  const validatedPayload = adhesionPayloadWithYearSchema.parse(payload);

  const res = await fetch(PAYMENT_INTENT_ENDPOINTS[channel], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedPayload),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      fetchAdhesionApiError(json, "Erreur lors de la création du paiement"),
    );
  }

  const parsed = paymentIntentResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error("Réponse de paiement invalide")
  }

  return parsed.data
}

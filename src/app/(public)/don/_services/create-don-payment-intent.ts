import { donPayloadSchema, type DonPayload } from "../_schemas/don.schema";
import {
  paymentIntentResponseSchema,
  type PaymentIntentResponse,
} from "../_schemas/payment-intent.schema";
import { fetchAdhesionApiError } from "@/app/(public)/adhesion/_services/fetch-adhesion-api-error";

export const DON_PAYMENT_INTENT_CHANNELS = {
  public: "public",
  bureau: "bureau",
} as const;

export type DonPaymentIntentChannel =
  (typeof DON_PAYMENT_INTENT_CHANNELS)[keyof typeof DON_PAYMENT_INTENT_CHANNELS];

const PAYMENT_INTENT_ENDPOINTS: Record<DonPaymentIntentChannel, string> = {
  public: "/api/payment_intents/don",
  bureau: "/api/payment_intents/bureau-don",
};

/**
 * Crée un PaymentIntent Stripe via l’API interne (public ou bureau).
 */
export async function createDonPaymentIntent(
  payload: DonPayload,
  options?: { readonly channel?: DonPaymentIntentChannel },
): Promise<PaymentIntentResponse> {
  const channel = options?.channel ?? DON_PAYMENT_INTENT_CHANNELS.public;
  const validatedPayload = donPayloadSchema.parse(payload);

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

  const parsed = paymentIntentResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Réponse de paiement invalide");
  }

  return parsed.data;
}

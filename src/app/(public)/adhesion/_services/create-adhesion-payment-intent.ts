import { adhesionPayloadSchema, type AdhesionPayload } from "../_schemas/adhesion.schema";
import {
  paymentIntentResponseSchema,
  type PaymentIntentResponse,
} from "../_schemas/payment-intent.schema";

/**
 * Service: createAdhesionPaymentIntent
 * Rôle: Créer un PaymentIntent Stripe via l’API interne /api/payment_intents.
 */
export async function createAdhesionPaymentIntent(
  payload: AdhesionPayload,
): Promise<PaymentIntentResponse> {
  const validatedPayload = adhesionPayloadSchema.parse(payload);

  const res = await fetch("/api/payment_intents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedPayload),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof json === "object" && json !== null && "error" in json
        ? String((json as { error?: unknown }).error ?? "")
        : "";
    throw new Error(message || "Erreur lors de la création du paiement");
  }

  return paymentIntentResponseSchema.parse(json);
}


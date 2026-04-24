import {
  orderPaymentPayloadSchema,
  orderPaymentResponseSchema,
  type OrderPaymentPayload,
  type OrderPaymentResponse,
} from "../_schemas/order-payment.schema";

/**
 * Service: createOrderPaymentIntent
 * Rôle: Créer un PaymentIntent Stripe pour une commande via /api/payment_intents/order.
 */
export async function createOrderPaymentIntent(
  payload: OrderPaymentPayload,
): Promise<OrderPaymentResponse> {
  const validatedPayload = orderPaymentPayloadSchema.parse(payload);

  const res = await fetch("/api/payment_intents/order", {
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

  return orderPaymentResponseSchema.parse(json);
}


"use client";

import { useMutation } from "@tanstack/react-query";

import {
  createAdhesionPaymentIntent,
  type AdhesionPaymentIntentChannel,
} from "../_services/create-adhesion-payment-intent";
import type { AdhesionPayloadWithYear } from "../_schemas/adhesion.schema";

interface UseCreateAdhesionPaymentIntentOptions {
  readonly channel?: AdhesionPaymentIntentChannel;
}

/**
 * Mutation TanStack Query : PaymentIntent d’adhésion (public ou bureau).
 */
export function useCreateAdhesionPaymentIntent(
  options?: UseCreateAdhesionPaymentIntentOptions,
) {
  const channel = options?.channel;

  return useMutation({
    mutationFn: (payload: AdhesionPayloadWithYear) =>
      createAdhesionPaymentIntent(payload, { channel }),
  });
}


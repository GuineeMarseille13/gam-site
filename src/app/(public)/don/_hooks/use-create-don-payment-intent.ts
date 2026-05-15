"use client";

import { useMutation } from "@tanstack/react-query";

import {
  createDonPaymentIntent,
  type DonPaymentIntentChannel,
} from "../_services/create-don-payment-intent";
import type { DonPayload } from "../_schemas/don.schema";

interface UseCreateDonPaymentIntentOptions {
  readonly channel?: DonPaymentIntentChannel;
}

/**
 * Mutation TanStack Query : PaymentIntent de don (public ou bureau).
 */
export function useCreateDonPaymentIntent(
  options?: UseCreateDonPaymentIntentOptions,
) {
  const channel = options?.channel;

  return useMutation({
    mutationFn: (payload: DonPayload) =>
      createDonPaymentIntent(payload, { channel }),
  });
}


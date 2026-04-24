"use client";

import { useMutation } from "@tanstack/react-query";

import { createDonPaymentIntent } from "../_services/create-don-payment-intent";

/**
 * Hook: useCreateDonPaymentIntent
 * Rôle: Mutation TanStack Query pour créer un PaymentIntent de don.
 */
export function useCreateDonPaymentIntent() {
  return useMutation({
    mutationFn: createDonPaymentIntent,
  });
}


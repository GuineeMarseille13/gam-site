"use client";

import { useMutation } from "@tanstack/react-query";

import { createAdhesionPaymentIntent } from "../_services/create-adhesion-payment-intent";

/**
 * Hook: useCreateAdhesionPaymentIntent
 * Rôle: Mutation TanStack Query pour créer un PaymentIntent d’adhésion.
 */
export function useCreateAdhesionPaymentIntent() {
  return useMutation({
    mutationFn: createAdhesionPaymentIntent,
  });
}


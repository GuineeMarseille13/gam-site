"use client";

import { useMutation } from "@tanstack/react-query";

import { createOrderPaymentIntent } from "../_services/create-order-payment-intent";

/**
 * Hook: useCreateOrderPaymentIntent
 * Rôle: Mutation TanStack Query pour créer un PaymentIntent de commande.
 */
export function useCreateOrderPaymentIntent() {
  return useMutation({
    mutationFn: createOrderPaymentIntent,
  });
}


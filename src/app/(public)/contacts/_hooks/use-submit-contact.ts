"use client";

import { useMutation } from "@tanstack/react-query";

import { submitContact } from "../_services/submit-contact";

/**
 * Hook: useSubmitContact
 * Rôle: Mutation TanStack Query pour envoyer le formulaire de contact.
 */
export function useSubmitContact() {
  return useMutation({
    mutationFn: submitContact,
  });
}


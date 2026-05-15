"use client"

import { useMutation } from "@tanstack/react-query"

import { submitManualAdhesion } from "../_services/submit-manual-adhesion"

/**
 * Mutation : enregistrement adhésion manuelle (espèces / virement, bureau).
 */
export function useSubmitManualAdhesion() {
  return useMutation({
    mutationFn: submitManualAdhesion,
  })
}

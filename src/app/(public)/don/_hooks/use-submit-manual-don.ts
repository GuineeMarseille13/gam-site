"use client"

import { useMutation } from "@tanstack/react-query"

import { submitManualDon } from "../_services/submit-manual-don"

/**
 * Mutation : enregistrement don manuel (espèces / virement, bureau).
 */
export function useSubmitManualDon() {
  return useMutation({
    mutationFn: submitManualDon,
  })
}

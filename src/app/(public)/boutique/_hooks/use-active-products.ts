"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchActiveProducts } from "../_services/fetch-active-products";

export const boutiqueKeys = {
  products: () => ["boutique", "products", { active: true }] as const,
};

/**
 * Hook: useActiveProducts
 * Rôle: Lire le catalogue actif via TanStack Query.
 */
export function useActiveProducts() {
  return useQuery({
    queryKey: boutiqueKeys.products(),
    queryFn: fetchActiveProducts,
  });
}


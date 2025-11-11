// Hooks TanStack Query pour l'association

import { useQuery } from "@tanstack/react-query";
import {
  fetchPresidentDataAPI,
  fetchPresidentImageAPI,
  fetchAboutUsDataAPI,
  fetchTeamDataAPI,
} from "@/services/associationAPI";

/**
 * Hook personnalisé pour récupérer les données du président avec TanStack Query
 */
export function usePresidentData() {
  return useQuery({
    queryKey: ["president", "data"],
    queryFn: fetchPresidentDataAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook personnalisé pour récupérer la photo du président avec TanStack Query
 */
export function usePresidentImage() {
  return useQuery({
    queryKey: ["president", "image"],
    queryFn: fetchPresidentImageAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook personnalisé pour récupérer les données "Qui sommes-nous" avec TanStack Query
 */
export function useAboutUsData() {
  return useQuery({
    queryKey: ["about-us", "data"],
    queryFn: fetchAboutUsDataAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook personnalisé pour récupérer les données de l'équipe avec TanStack Query
 */
export function useTeamData() {
  return useQuery({
    queryKey: ["team", "data"],
    queryFn: fetchTeamDataAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

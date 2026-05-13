// Services API pour l'association
// Fonctions pures pour les appels API (sans logique React)

import { publicTeamResponseSchema } from "@/lib/schemas/association-public-team.schema"
import { PresidentSectionData, AboutUsData, TeamData } from "@/types/association"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Récupère les données du président depuis l'API
 * @returns Promise<PresidentSectionData>
 */
export async function fetchPresidentDataAPI(): Promise<PresidentSectionData> {
  const response = await fetch(`${API_BASE_URL}/association/president`, {
    next: { revalidate: 300 }, // Revalidation toutes les 5 minutes
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Récupère l'URL de la photo du président depuis l'API
 * @returns Promise<string> URL de l'image
 */
export async function fetchPresidentImageAPI(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/association/president/image`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.imageUrl;
}

/**
 * Récupère les données "Qui sommes-nous" depuis l'API
 * @returns Promise<AboutUsData>
 */
export async function fetchAboutUsDataAPI(): Promise<AboutUsData> {
  const response = await fetch(`${API_BASE_URL}/association/about-us`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Récupère les données de l'équipe depuis l'API
 * @returns Promise<TeamData>
 */
export async function fetchTeamDataAPI(): Promise<TeamData> {
  const response = await fetch(`${API_BASE_URL}/association/team`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: unknown = await response.json()
  return publicTeamResponseSchema.parse(json)
}

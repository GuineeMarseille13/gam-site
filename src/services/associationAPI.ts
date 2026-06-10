// Services API pour l'association
// Fonctions pures pour les appels API (sans logique React)

import {
  aboutUsPublicSchema,
  presidentPublicSchema,
} from "@/helpers/association-content/_schemas/association-content.schema"
import { publicTeamResponseSchema } from "@/lib/schemas/association-public-team.schema"
import type { AboutUsData, PresidentSectionData, TeamData } from "@/types/association"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

/**
 * Récupère les données du président depuis l'API
 */
export async function fetchPresidentDataAPI(): Promise<PresidentSectionData> {
  const response = await fetch(`${API_BASE_URL}/association/president`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: unknown = await response.json()
  return presidentPublicSchema.parse(json)
}

/**
 * Récupère les données "Qui sommes-nous" depuis l'API
 */
export async function fetchAboutUsDataAPI(): Promise<AboutUsData> {
  const response = await fetch(`${API_BASE_URL}/association/about-us`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const json: unknown = await response.json()
  return aboutUsPublicSchema.parse(json)
}

/**
 * Récupère les données de l'équipe depuis l'API
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

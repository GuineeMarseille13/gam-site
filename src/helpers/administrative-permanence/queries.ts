import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"

import {
  administrativePermanenceSlotListSchema,
  type AdministrativePermanenceSlotRow,
} from "./administrative-permanence.schema"

function isMissingTable(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  )
}

function isMissingColumn(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2022"
  )
}

/**
 * Créneaux triés pour le site et le dashboard.
 * Retourne une liste vide si la table n’existe pas encore (build / migration en attente).
 */
export async function getAdministrativePermanenceSlots(): Promise<
  AdministrativePermanenceSlotRow[]
> {
  try {
    const rows = await prisma.administrativePermanenceSlot.findMany({
      orderBy: { slotDate: "asc" },
    })

    const mapped: AdministrativePermanenceSlotRow[] = rows.map((r) => ({
      id: r.id,
      date: r.slotDate.toISOString().slice(0, 10),
      startTime: r.startTime,
      endTime: r.endTime,
    }))

    return administrativePermanenceSlotListSchema.parse(mapped)
  } catch (error) {
    if (isMissingTable(error)) {
      return []
    }
    throw error
  }
}

export interface AdministrativePermanenceSettingsDto {
  horairesCardText: string | null
  showCampusFranceCard: boolean
}

/**
 * Texte optionnel carte Horaires.
 */
export async function getAdministrativePermanenceSettings(): Promise<AdministrativePermanenceSettingsDto> {
  try {
    const row = await prisma.administrativePermanenceSettings.findUnique({
      where: { id: "default" },
      select: { horairesCardText: true, showCampusFranceCard: true },
    })
    return {
      horairesCardText: row?.horairesCardText ?? null,
      showCampusFranceCard: row?.showCampusFranceCard ?? true,
    }
  } catch (error) {
    if (isMissingTable(error)) {
      return { horairesCardText: null, showCampusFranceCard: true }
    }
    if (isMissingColumn(error)) {
      return { horairesCardText: null, showCampusFranceCard: true }
    }
    throw error
  }
}

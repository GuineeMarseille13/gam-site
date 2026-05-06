"use server"

import { revalidatePath } from "next/cache"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdministrationDashboard } from "@/lib/auth-guard"
import { ADMINISTRATIVE_POLE_SLUG } from "@/helpers/administrative-permanence/constants"
import { DEFAULT_ADMINISTRATIVE_PERMANENCE_SLOTS_2026 } from "@/helpers/administrative-permanence/default-admin-slots"

import {
  administrativePermanenceSettingsInputSchema,
  deleteAdministrativePermanenceSlotInputSchema,
  saveAdministrativePermanenceSlotInputSchema,
} from "@/helpers/administrative-permanence/administrative-permanence.schema"

export type AdministrativePermanenceActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

function revalidatePublicAndAdmin(): void {
  revalidatePath(`/poles/${ADMINISTRATIVE_POLE_SLUG}`)
  revalidatePath("/administration/calendrier-permanence")
  revalidatePath("/administration")
}

/**
 * Crée un créneau ou met à jour celui désigné par `id` (modification réelle de la même ligne).
 */
export async function upsertAdministrativePermanenceSlotAction(
  raw: unknown,
): Promise<AdministrativePermanenceActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = saveAdministrativePermanenceSlotInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { id: rowId, date, startTime, endTime } = parsed.data
  const slotDate = new Date(`${date}T12:00:00.000Z`)

  try {
    if (rowId) {
      const existing = await prisma.administrativePermanenceSlot.findUnique({
        where: { id: rowId },
      })
      if (!existing) {
        return { success: false, error: "Ce créneau n’existe plus. Rechargez la page." }
      }
      await prisma.administrativePermanenceSlot.update({
        where: { id: rowId },
        data: {
          slotDate,
          startTime,
          endTime,
        },
      })
    } else {
      await prisma.administrativePermanenceSlot.upsert({
        where: { slotDate },
        create: {
          slotDate,
          startTime,
          endTime,
        },
        update: {
          startTime,
          endTime,
        },
      })
    }
    revalidatePublicAndAdmin()
    return { success: true }
  } catch (err) {
    console.error("[upsertAdministrativePermanenceSlotAction]", err)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        success: false,
        error: "Une permanence existe déjà à cette date. Choisissez un autre jour ou modifiez l’autre ligne.",
      }
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2021"
    ) {
      return {
        success: false,
        error:
          "La table des permanences n’existe pas encore en base. Exécutez : npx prisma migrate deploy",
      }
    }
    if (err instanceof TypeError && String(err.message).includes("upsert")) {
      return {
        success: false,
        error:
          "Client base de données obsolète : redémarrez le serveur de dev (npm run dev) puis réessayez.",
      }
    }
    return { success: false, error: "Enregistrement impossible. Réessayez." }
  }
}

/**
 * Supprime un créneau par date.
 */
export async function deleteAdministrativePermanenceSlotAction(
  raw: unknown,
): Promise<AdministrativePermanenceActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = deleteAdministrativePermanenceSlotInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Date invalide.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const slotDate = new Date(`${parsed.data.date}T12:00:00.000Z`)

  try {
    await prisma.administrativePermanenceSlot.deleteMany({
      where: { slotDate },
    })
    revalidatePublicAndAdmin()
    return { success: true }
  } catch (err) {
    console.error("[deleteAdministrativePermanenceSlotAction]", err)
    return { success: false, error: "Suppression impossible. Réessayez." }
  }
}

/**
 * Texte optionnel pour la carte « Horaires » sur le pôle (null = texte auto).
 */
export async function saveAdministrativePermanenceSettingsAction(
  raw: unknown,
): Promise<AdministrativePermanenceActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  const parsed = administrativePermanenceSettingsInputSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Texte invalide.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { horairesCardText, showCampusFranceCard } = parsed.data

  try {
    const existing = await prisma.administrativePermanenceSettings.findUnique({
      where: { id: "default" },
      select: { horairesCardText: true, showCampusFranceCard: true },
    })

    const nextHorairesCardText =
      horairesCardText !== undefined
        ? horairesCardText
        : (existing?.horairesCardText ?? null)

    const nextShowCampusFranceCard =
      showCampusFranceCard !== undefined
        ? showCampusFranceCard
        : (existing?.showCampusFranceCard ?? true)

    await prisma.administrativePermanenceSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        horairesCardText: nextHorairesCardText,
        showCampusFranceCard: nextShowCampusFranceCard,
      },
      update: {
        horairesCardText: nextHorairesCardText,
        showCampusFranceCard: nextShowCampusFranceCard,
      },
    })
    revalidatePublicAndAdmin()
    return { success: true }
  } catch (err) {
    console.error("[saveAdministrativePermanenceSettingsAction]", err)
    return { success: false, error: "Enregistrement impossible. Réessayez." }
  }
}

/**
 * Importe le calendrier 2026 par défaut (sans écraser les dates déjà présentes).
 */
export async function seedDefaultAdministrativePermanenceSlotsAction(): Promise<AdministrativePermanenceActionResult> {
  try {
    await requireAdministrationDashboard()
  } catch {
    return { success: false, error: "Session requise." }
  }

  try {
    await prisma.administrativePermanenceSlot.createMany({
      data: DEFAULT_ADMINISTRATIVE_PERMANENCE_SLOTS_2026.map((s) => ({
        slotDate: new Date(`${s.date}T12:00:00.000Z`),
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      skipDuplicates: true,
    })
    revalidatePublicAndAdmin()
    return { success: true }
  } catch (err) {
    console.error("[seedDefaultAdministrativePermanenceSlotsAction]", err)
    return { success: false, error: "Import impossible. Réessayez." }
  }
}

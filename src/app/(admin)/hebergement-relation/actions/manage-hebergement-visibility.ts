"use server"

import { prisma } from "@/lib/prisma"

export async function saveHebergementVisibilityAction({
  showHebergementForm,
}: {
  showHebergementForm: boolean
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await prisma.detailsPole.updateMany({
      data: { showHebergementForm },
    })
    return { success: true }
  } catch {
    return { success: false, error: "Erreur lors de la sauvegarde." }
  }
}
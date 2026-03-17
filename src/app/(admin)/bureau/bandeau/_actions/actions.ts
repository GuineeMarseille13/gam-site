"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export type ActionState = { error: string } | null

// ── Create ────────────────────────────────────────────────────────────────────

export async function createBanner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const isActive = formData.get("isActive") === "true"
    const title = (formData.get("title") as string).trim()
    if (!title) return { error: "Le titre est obligatoire" }

    if (isActive) await prisma.banner.updateMany({ data: { isActive: false } })

    await prisma.banner.create({
      data: {
        isActive,
        title,
        badge:    (formData.get("badge") as string) || null,
        date:     (formData.get("date") as string) || null,
        location: (formData.get("location") as string) || null,
      },
    })

    revalidatePath("/bureau/bandeau")
    revalidatePath("/")
    redirect("/bureau/bandeau")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createBanner]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateBanner(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const isActive = formData.get("isActive") === "true"
    const title = (formData.get("title") as string).trim()
    if (!title) return { error: "Le titre est obligatoire" }

    if (isActive) await prisma.banner.updateMany({ where: { id: { not: id } }, data: { isActive: false } })

    await prisma.banner.update({
      where: { id },
      data: {
        isActive,
        title,
        badge:    (formData.get("badge") as string) || null,
        date:     (formData.get("date") as string) || null,
        location: (formData.get("location") as string) || null,
      },
    })

    revalidatePath("/bureau/bandeau")
    revalidatePath("/")
    redirect("/bureau/bandeau")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updateBanner]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } })
  revalidatePath("/bureau/bandeau")
  revalidatePath("/")
}

// ── Toggle ────────────────────────────────────────────────────────────────────

export async function toggleBannerActive(id: string, isActive: boolean) {
  if (isActive) await prisma.banner.updateMany({ data: { isActive: false } })
  await prisma.banner.update({ where: { id }, data: { isActive } })
  revalidatePath("/bureau/bandeau")
  revalidatePath("/")
}

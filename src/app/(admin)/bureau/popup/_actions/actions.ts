"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { deleteSupersededPublicId } from "@/lib/cloudinary-replacement"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { requireBureau } from "@/lib/auth-guard"

export type ActionState = { error: string } | null

// ── Helpers ──────────────────────────────────────────────────────────────────

async function uploadSingle(formData: FormData, field: string, existing: string | null): Promise<string | null> {
  const file = formData.get(field) as File | null
  if (file && file.size > 0) {
    const res = await uploadImage(file, "gam/popups")
    return res.publicId
  }
  return existing
}

async function uploadMultiple(formData: FormData): Promise<string[]> {
  const existingIds = formData.getAll("existingProspectusId") as string[]
  const files = formData.getAll("prospectusFile") as File[]
  const newIds = await Promise.all(
    files.filter((f) => f.size > 0).map((f) => uploadImage(f, "gam/popups").then((r) => r.publicId))
  )
  return [...existingIds, ...newIds]
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createPopup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireBureau()
  try {
    const type = formData.get("type") as "IMAGE_TEXT" | "PROSPECTUS"
    const isActive = formData.get("isActive") === "true"

    if (isActive) await prisma.popup.updateMany({ data: { isActive: false } })

    if (type === "IMAGE_TEXT") {
      const imageId = await uploadSingle(formData, "imageFile", null)
      await prisma.popup.create({
        data: {
          type,
          isActive,
          imageId,
          badge:       (formData.get("badge") as string) || null,
          title:       (formData.get("title") as string) || null,
          subtitle:    (formData.get("subtitle") as string) || null,
          description: (formData.get("description") as string) || null,
          date:        (formData.get("date") as string) || null,
          location:    (formData.get("location") as string) || null,
          ctaLabel:    (formData.get("ctaLabel") as string) || null,
          ctaUrl:      (formData.get("ctaUrl") as string) || null,
        },
      })
    } else {
      const prospectusIds = await uploadMultiple(formData)
      await prisma.popup.create({ data: { type, isActive, prospectusIds } })
    }

    revalidatePath("/bureau/popup")
    revalidatePath("/")
    redirect("/bureau/popup")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[createPopup]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updatePopup(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireBureau()
  try {
    const existing = await prisma.popup.findUnique({ where: { id } })
    if (!existing) return { error: "Popup introuvable" }

    const type = formData.get("type") as "IMAGE_TEXT" | "PROSPECTUS"
    const isActive = formData.get("isActive") === "true"

    if (isActive) await prisma.popup.updateMany({ where: { id: { not: id } }, data: { isActive: false } })

    if (type === "IMAGE_TEXT") {
      const imageId = await uploadSingle(formData, "imageFile", existing.imageId)
      await prisma.popup.update({
        where: { id },
        data: {
          type,
          isActive,
          imageId,
          badge:        (formData.get("badge") as string) || null,
          title:        (formData.get("title") as string) || null,
          subtitle:     (formData.get("subtitle") as string) || null,
          description:  (formData.get("description") as string) || null,
          date:         (formData.get("date") as string) || null,
          location:     (formData.get("location") as string) || null,
          ctaLabel:     (formData.get("ctaLabel") as string) || null,
          ctaUrl:       (formData.get("ctaUrl") as string) || null,
          prospectusIds: [],
        },
      })
      if (existing.type !== "IMAGE_TEXT") {
        for (const pid of existing.prospectusIds) {
          await deleteImage(pid).catch(() => {})
        }
      }
      await deleteSupersededPublicId({
        previousPublicId: existing.imageId,
        nextPublicId: imageId,
        resourceType: "image",
      })
    } else {
      const prospectusIds = await uploadMultiple(formData)
      const prevProspects = existing.prospectusIds
      await prisma.popup.update({ where: { id }, data: { type, isActive, prospectusIds, imageId: null } })

      if (existing.type === "IMAGE_TEXT" && existing.imageId) {
        await deleteImage(existing.imageId).catch(() => {})
      }
      const removedProspects = prevProspects.filter((pid) => !prospectusIds.includes(pid))
      await Promise.all(removedProspects.map((pid) => deleteImage(pid).catch(() => {})))
    }

    revalidatePath("/bureau/popup")
    revalidatePath("/")
    redirect("/bureau/popup")
  } catch (err) {
    if (isRedirectError(err)) throw err
    console.error("[updatePopup]", err)
    return { error: err instanceof Error ? err.message : "Erreur inconnue" }
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deletePopup(id: string) {
  await requireBureau()
  const popup = await prisma.popup.findUnique({ where: { id } })
  await prisma.popup.delete({ where: { id } })
  if (popup?.imageId) await deleteImage(popup.imageId).catch(console.error)
  for (const pid of popup?.prospectusIds ?? []) {
    await deleteImage(pid).catch(console.error)
  }
  revalidatePath("/bureau/popup")
  revalidatePath("/")
}

// ── Toggle ────────────────────────────────────────────────────────────────────

export async function togglePopupActive(id: string, isActive: boolean) {
  await requireBureau()
  if (isActive) await prisma.popup.updateMany({ data: { isActive: false } })
  await prisma.popup.update({ where: { id }, data: { isActive } })
  revalidatePath("/bureau/popup")
  revalidatePath("/")
}

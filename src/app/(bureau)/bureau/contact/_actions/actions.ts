"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ContactSubmissionStatus } from "@/lib/generated/prisma/enums"

const REVALIDATE_PATHS = ["/bureau/contact", "/contacts"]

// ── Contact Info ──────────────────────────────────────────────────────────────

export async function upsertContact(formData: FormData) {
  const phone = (formData.get("phone") as string) || ""
  const email = (formData.get("email") as string) || ""
  const address = (formData.get("address") as string) || ""
  const city = (formData.get("city") as string) || ""
  const zipCode = (formData.get("zipCode") as string) || ""

  const existing = await prisma.contact.findFirst()

  if (existing) {
    await prisma.contact.update({
      where: { id: existing.id },
      data: { phone, email, address, city, zipCode },
    })
  } else {
    await prisma.contact.create({
      data: { phone, email, address, city, zipCode },
    })
  }

  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
}

// ── Social Media ──────────────────────────────────────────────────────────────

export async function createSocialMedia(formData: FormData) {
  const name = (formData.get("name") as string) || ""
  const url = (formData.get("url") as string) || ""
  const icon = (formData.get("icon") as string) || null
  const order = parseInt(formData.get("order") as string) || 0

  await prisma.socialMedia.create({ data: { name, url, icon, order } })

  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
  redirect("/bureau/contact")
}

export async function updateSocialMedia(id: string, formData: FormData) {
  const name = (formData.get("name") as string) || ""
  const url = (formData.get("url") as string) || ""
  const icon = (formData.get("icon") as string) || null
  const order = parseInt(formData.get("order") as string) || 0

  await prisma.socialMedia.update({ where: { id }, data: { name, url, icon, order } })

  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
  redirect("/bureau/contact")
}

export async function deleteSocialMedia(id: string) {
  await prisma.socialMedia.delete({ where: { id } })
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p))
}

// ── Contact Submissions ───────────────────────────────────────────────────────

export async function updateSubmissionStatus(id: string, status: ContactSubmissionStatus) {
  await prisma.contactSubmission.update({ where: { id }, data: { status } })
  revalidatePath("/bureau/contact/messages")
}

export async function deleteSubmission(id: string) {
  await prisma.contactSubmission.delete({ where: { id } })
  revalidatePath("/bureau/contact/messages")
}

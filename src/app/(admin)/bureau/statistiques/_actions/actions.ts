"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireBureauContenu } from "@/lib/auth-guard"

const REVALIDATE_PATHS = ["/bureau/statistiques", "/"]

export async function createStatistique(formData: FormData) {
  await requireBureauContenu()
  const label = (formData.get("label") as string) || null
  const valueRaw = formData.get("value") as string
  const value = valueRaw ? parseInt(valueRaw) : null
  const icon = (formData.get("icon") as string) || null
  const color = (formData.get("color") as string) || null
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.achievement.create({
    data: { label, value, icon, color, order, isActive },
  })

  REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
  redirect("/bureau/statistiques")
}

export async function updateStatistique(id: string, formData: FormData) {
  await requireBureauContenu()
  const label = (formData.get("label") as string) || null
  const valueRaw = formData.get("value") as string
  const value = valueRaw ? parseInt(valueRaw) : null
  const icon = (formData.get("icon") as string) || null
  const color = (formData.get("color") as string) || null
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.achievement.update({
    where: { id },
    data: { label, value, icon, color, order, isActive },
  })

  REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
  redirect("/bureau/statistiques")
}

export async function deleteStatistique(id: string) {
  await requireBureauContenu()
  await prisma.achievement.delete({ where: { id } })
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path))
}

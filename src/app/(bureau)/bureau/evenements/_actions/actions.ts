"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createEvenement(formData: FormData) {
  const title = formData.get("title") as string
  const description = (formData.get("description") as string) || null
  const location = (formData.get("location") as string) || null
  const imageId = (formData.get("imageId") as string) || null
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = new Date(formData.get("endDate") as string)

  await prisma.event.create({
    data: { title, description, location, imageId, startDate, endDate },
  })

  revalidatePath("/bureau/evenements")
  revalidatePath("/evenements")
  redirect("/bureau/evenements")
}

export async function updateEvenement(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = (formData.get("description") as string) || null
  const location = (formData.get("location") as string) || null
  const imageId = (formData.get("imageId") as string) || null
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = new Date(formData.get("endDate") as string)

  await prisma.event.update({
    where: { id },
    data: { title, description, location, imageId, startDate, endDate },
  })

  revalidatePath("/bureau/evenements")
  revalidatePath("/evenements")
  redirect("/bureau/evenements")
}

export async function deleteEvenement(id: string) {
  await prisma.event.delete({ where: { id } })
  revalidatePath("/bureau/evenements")
  revalidatePath("/evenements")
}

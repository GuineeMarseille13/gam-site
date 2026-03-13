"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPole(formData: FormData) {
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const imageId = (formData.get("imageId") as string) || null

  const details = await prisma.detailsPole.create({
    data: { title: name, description },
  })

  await prisma.pole.create({
    data: { name, description, imageId, detailsPoleId: details.id },
  })

  revalidatePath("/bureau/poles")
  redirect("/bureau/poles")
}

export async function updatePole(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const imageId = (formData.get("imageId") as string) || null

  await prisma.pole.update({
    where: { id },
    data: { name, description, imageId },
  })

  revalidatePath("/bureau/poles")
  redirect("/bureau/poles")
}

export async function deletePole(id: string) {
  await prisma.pole.delete({ where: { id } })
  revalidatePath("/bureau/poles")
}

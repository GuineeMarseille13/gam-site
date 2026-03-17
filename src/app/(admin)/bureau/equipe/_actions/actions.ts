"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createMembreEquipe(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const phone = formData.get("phone") as string
  const description = (formData.get("description") as string) || null
  const imageId = (formData.get("imageId") as string) || null
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  const person = await prisma.person.create({
    data: { firstName, lastName, email, phone },
  })

  await prisma.teamMember.create({
    data: { personId: person.id, description, imageId, order, isActive },
  })

  revalidatePath("/bureau/equipe")
  redirect("/bureau/equipe")
}

export async function updateMembreEquipe(id: string, formData: FormData) {
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) return

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const phone = formData.get("phone") as string
  const description = (formData.get("description") as string) || null
  const imageId = (formData.get("imageId") as string) || null
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.person.update({
    where: { id: member.personId },
    data: { firstName, lastName, email, phone },
  })

  await prisma.teamMember.update({
    where: { id },
    data: { description, imageId, order, isActive },
  })

  revalidatePath("/bureau/equipe")
  redirect("/bureau/equipe")
}

export async function deleteMembreEquipe(id: string) {
  await prisma.teamMember.delete({ where: { id } })
  revalidatePath("/bureau/equipe")
}

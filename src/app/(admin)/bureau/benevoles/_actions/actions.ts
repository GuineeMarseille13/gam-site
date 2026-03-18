"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireBureau } from "@/lib/auth-guard"

export async function createBenevole(formData: FormData) {
  await requireBureau()
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const phone = formData.get("phone") as string
  const isActive = formData.get("isActive") === "on"

  const person = await prisma.person.create({
    data: { firstName, lastName, email, phone, roles: ["VOLUNTEER"] },
  })

  await prisma.volunteer.create({
    data: { personId: person.id, isActive },
  })

  revalidatePath("/bureau/benevoles")
  redirect("/bureau/benevoles")
}

export async function updateBenevole(id: string, formData: FormData) {
  await requireBureau()
  const isActive = formData.get("isActive") === "on"

  const volunteer = await prisma.volunteer.findUnique({ where: { id } })
  if (!volunteer) return

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const phone = formData.get("phone") as string

  await prisma.person.update({
    where: { id: volunteer.personId },
    data: { firstName, lastName, email, phone },
  })

  await prisma.volunteer.update({
    where: { id },
    data: { isActive },
  })

  revalidatePath("/bureau/benevoles")
  redirect("/bureau/benevoles")
}

export async function deleteBenevole(id: string) {
  await requireBureau()
  await prisma.volunteer.delete({ where: { id } })
  revalidatePath("/bureau/benevoles")
}

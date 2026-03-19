"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireBureau } from "@/lib/auth-guard"

async function resolveImageId(formData: FormData): Promise<string | null> {
  const file = formData.get("imageFile") as File | null
  if (file && file.size > 0) {
    const result = await uploadImage(file, "gam/equipe")
    return result.publicId
  }
  return (formData.get("imageId") as string) || null
}

export async function createMembreEquipe(formData: FormData) {
  await requireBureau()
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const phone = formData.get("phone") as string
  const poste = (formData.get("poste") as string) || null
  const description = (formData.get("description") as string) || null
  const imageId = await resolveImageId(formData)
  const order = parseInt(formData.get("order") as string) || 0
  const showOnSite = formData.get("showOnSite") !== "false"

  const person = await prisma.person.create({
    data: { firstName, lastName, email, phone },
  })

  await prisma.teamMember.create({
    data: { personId: person.id, poste, description, imageId, order, showOnSite },
  })

  revalidatePath("/bureau/equipe")
  redirect("/bureau/equipe")
}

export async function updateMembreEquipe(id: string, formData: FormData) {
  await requireBureau()
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) return

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const phone = formData.get("phone") as string
  const poste = (formData.get("poste") as string) || null
  const description = (formData.get("description") as string) || null
  const imageId = await resolveImageId(formData)
  const order = parseInt(formData.get("order") as string) || 0
  const showOnSite = formData.get("showOnSite") !== "false"

  await prisma.person.update({
    where: { id: member.personId },
    data: { firstName, lastName, email, phone },
  })

  await prisma.teamMember.update({
    where: { id },
    data: { poste, description, imageId, order, showOnSite },
  })

  revalidatePath("/bureau/equipe")
  redirect("/bureau/equipe")
}

export async function deleteMembreEquipe(id: string) {
  await requireBureau()
  await prisma.teamMember.delete({ where: { id } })
  revalidatePath("/bureau/equipe")
}

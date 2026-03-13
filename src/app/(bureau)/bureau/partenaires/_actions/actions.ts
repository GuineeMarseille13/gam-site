"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPartenaire(formData: FormData) {
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const url = (formData.get("url") as string) || null
  const imageId = (formData.get("imageId") as string) || null

  await prisma.partner.create({
    data: { name, description, url, imageId },
  })

  revalidatePath("/bureau/partenaires")
  redirect("/bureau/partenaires")
}

export async function updatePartenaire(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const url = (formData.get("url") as string) || null
  const imageId = (formData.get("imageId") as string) || null

  await prisma.partner.update({
    where: { id },
    data: { name, description, url, imageId },
  })

  revalidatePath("/bureau/partenaires")
  redirect("/bureau/partenaires")
}

export async function deletePartenaire(id: string) {
  await prisma.partner.delete({ where: { id } })
  revalidatePath("/bureau/partenaires")
}

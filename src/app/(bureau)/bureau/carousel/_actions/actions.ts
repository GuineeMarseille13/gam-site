"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const REVALIDATE = ["/bureau/carousel", "/"]

function getPublicId(metadata: unknown): string | null {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    return (metadata as Record<string, unknown>).publicId as string | null ?? null
  }
  return null
}

export async function createCarouselSlide(formData: FormData) {
  const file = formData.get("imageFile") as File | null
  if (!file || file.size === 0) throw new Error("Image requise")

  // Ordre automatique : max existant + 1
  const agg = await prisma.image.aggregate({
    where: { page: "HOME", section: "CAROUSEL" },
    _max:  { order: true },
  })
  const nextOrder = (agg._max.order ?? -1) + 1

  const upload = await uploadImage(file, "gam/carousel")

  await prisma.image.create({
    data: {
      url:         upload.url,
      title:       (formData.get("title") as string)       || null,
      description: (formData.get("description") as string) || null,
      alt:         (formData.get("title") as string)       || "Carousel GAM",
      page:        "HOME",
      section:     "CAROUSEL",
      order:       nextOrder,
      isActive:    formData.get("isActive") !== null,
      format:      upload.format,
      width:       upload.width,
      height:      upload.height,
      size:        upload.size,
      metadata:    { publicId: upload.publicId },
    },
  })

  REVALIDATE.forEach((p) => revalidatePath(p))
  redirect("/bureau/carousel")
}

export async function updateCarouselSlide(id: string, formData: FormData) {
  const file = formData.get("imageFile") as File | null

  if (file && file.size > 0) {
    const existing   = await prisma.image.findUniqueOrThrow({ where: { id } })
    const oldPublicId = getPublicId(existing.metadata)
    if (oldPublicId) await deleteImage(oldPublicId)

    const upload = await uploadImage(file, "gam/carousel")

    await prisma.image.update({
      where: { id },
      data: {
        url:         upload.url,
        title:       (formData.get("title") as string)       || null,
        description: (formData.get("description") as string) || null,
        alt:         (formData.get("title") as string)       || "Carousel GAM",
        order:       parseInt(formData.get("order") as string) || 0,
        isActive:    formData.get("isActive") !== null,
        format:      upload.format,
        width:       upload.width,
        height:      upload.height,
        size:        upload.size,
        metadata:    { publicId: upload.publicId },
      },
    })
  } else {
    await prisma.image.update({
      where: { id },
      data: {
        title:       (formData.get("title") as string)       || null,
        description: (formData.get("description") as string) || null,
        alt:         (formData.get("title") as string)       || "Carousel GAM",
        order:       parseInt(formData.get("order") as string) || 0,
        isActive:    formData.get("isActive") !== null,
      },
    })
  }

  REVALIDATE.forEach((p) => revalidatePath(p))
  redirect("/bureau/carousel")
}

export async function deleteCarouselSlide(id: string) {
  const slide     = await prisma.image.findUniqueOrThrow({ where: { id } })
  const publicId  = getPublicId(slide.metadata)
  if (publicId) await deleteImage(publicId)
  await prisma.image.delete({ where: { id } })
  REVALIDATE.forEach((p) => revalidatePath(p))
}

export async function toggleCarouselSlideActive(id: string, isActive: boolean) {
  await prisma.image.update({ where: { id }, data: { isActive } })
  REVALIDATE.forEach((p) => revalidatePath(p))
}

"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireBureau } from "@/lib/auth-guard"

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseAddress(formData: FormData) {
  const address = formData.get("address") as string | null
  const zipCode = formData.get("zipCode") as string | null
  const city    = formData.get("city")    as string | null
  const country = (formData.get("country") as string | null)?.trim() || "France"
  const hasAddress = !!(address?.trim() && zipCode?.trim() && city?.trim())
  return { address, zipCode, city, country, hasAddress }
}

function countryCode(country: string) {
  return country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase()
}

// ── Créer ──────────────────────────────────────────────────────────────────────

export async function createBenevole(formData: FormData) {
  await requireBureau()

  const firstName  = formData.get("firstName") as string
  const lastName   = formData.get("lastName")  as string
  const email      = (formData.get("email") as string) || null
  const phone      = formData.get("phone") as string
  const showOnSite = formData.get("showOnSite") !== "false"
  const imageFile  = formData.get("imageFile") as File | null
  const { address, zipCode, city, country, hasAddress } = parseAddress(formData)

  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, "gam/persons")
    imageUrl = result.url
  }

  const addressRecord = hasAddress
    ? await prisma.address.create({
        data: {
          address: address!, zipCode: zipCode!, city: city!, country,
          state: "", countryCode: countryCode(country),
        },
      })
    : null

  const person = await prisma.person.create({
    data: {
      firstName, lastName, email, phone,
      roles: ["VOLUNTEER"],
      image: imageUrl,
      showOnSite,
      addressId: addressRecord?.id ?? null,
    },
  })

  await prisma.volunteer.create({
    data: { personId: person.id },
  })

  revalidatePath("/bureau/benevoles")
  redirect("/bureau/benevoles")
}

// ── Modifier ───────────────────────────────────────────────────────────────────

export async function updateBenevole(id: string, formData: FormData) {
  await requireBureau()

  const volunteer = await prisma.volunteer.findUnique({ where: { id } })
  if (!volunteer) return

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const email       = (formData.get("email") as string) || null
  const phone       = formData.get("phone") as string
  const showOnSite  = formData.get("showOnSite") !== "false"
  const imageFile   = formData.get("imageFile") as File | null
  const removeImage = formData.get("removeImage") === "true"
  const { address, zipCode, city, country, hasAddress } = parseAddress(formData)

  // Récupérer les données existantes
  const existing = await prisma.person.findUnique({
    where: { id: volunteer.personId },
    include: { address: true },
  })
  if (!existing) return

  // Photo
  let imageUrl: string | null | undefined = undefined
  if (removeImage) {
    imageUrl = null
  } else if (imageFile && imageFile.size > 0) {
    const result = await uploadImage(imageFile, "gam/persons")
    imageUrl = result.url
  }

  // Adresse
  let addressId: string | null = existing.addressId
  if (hasAddress) {
    if (existing.addressId) {
      await prisma.address.update({
        where: { id: existing.addressId },
        data: { address: address!, zipCode: zipCode!, city: city!, country, countryCode: countryCode(country) },
      })
    } else {
      const rec = await prisma.address.create({
        data: { address: address!, zipCode: zipCode!, city: city!, country, state: "", countryCode: countryCode(country) },
      })
      addressId = rec.id
    }
  } else {
    addressId = null
  }

  await prisma.person.update({
    where: { id: volunteer.personId },
    data: {
      firstName, lastName, email, phone, showOnSite, addressId,
      ...(imageUrl !== undefined ? { image: imageUrl } : {}),
    },
  })


  revalidatePath("/bureau/benevoles")
  redirect("/bureau/benevoles")
}

// ── Supprimer ──────────────────────────────────────────────────────────────────

export async function deleteBenevole(id: string) {
  await requireBureau()
  await prisma.volunteer.delete({ where: { id } })
  revalidatePath("/bureau/benevoles")
}

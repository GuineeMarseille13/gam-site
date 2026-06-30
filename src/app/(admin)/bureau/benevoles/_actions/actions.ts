"use server"

import { prisma } from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import { revalidatePath } from "next/cache"
import { requireBenevoleDelete, requireBenevolesWrite } from "@/lib/auth-guard"
import { getPosteIdByCode } from "@/helpers/poste-helpers"
import { benevoleFormSchema, type BenevoleFormInput } from "../_schemas/benevole-form.schema"
import { parseBenevoleFormFields } from "../_helpers/parse-benevole-form-data"
import { findVolunteerEmailConflict } from "../_services/find-volunteer-email-conflict"
import type { BenevoleActionResult } from "../_types/benevole-action-result"

const BENEVOLES_LIST_PATHS = ["/bureau/benevoles", "/administration/benevoles"] as const

function revalidateBenevolesLists() {
  for (const path of BENEVOLES_LIST_PATHS) {
    revalidatePath(path)
  }
}

function countryCode(country: string) {
  return country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase()
}

async function resolveImageUrl(
  formData: FormData,
  options: { removeImage?: boolean },
): Promise<string | null | undefined> {
  if (options.removeImage) return null

  const imageFile = formData.get("imageFile") as File | null
  if (!imageFile || imageFile.size === 0) return undefined

  const result = await uploadImage(imageFile, "gam/persons")
  return result.url
}

async function resolveAddressId(
  parsed: BenevoleFormInput,
  existingAddressId: string | null,
): Promise<string | null> {
  const hasAddress = !!(parsed.address && parsed.zipCode && parsed.city)

  if (!hasAddress) return null

  const { address, zipCode, city, country } = parsed

  if (existingAddressId) {
    await prisma.address.update({
      where: { id: existingAddressId },
      data: {
        address: address!,
        zipCode: zipCode!,
        city: city!,
        country,
        countryCode: countryCode(country),
      },
    })
    return existingAddressId
  }

  const addressRecord = await prisma.address.create({
    data: {
      address: address!,
      zipCode: zipCode!,
      city: city!,
      country,
      state: "",
      countryCode: countryCode(country),
    },
  })

  return addressRecord.id
}

// ── Créer ──────────────────────────────────────────────────────────────────────

export async function createBenevole(formData: FormData): Promise<BenevoleActionResult> {
  await requireBenevolesWrite()

  const parsed = benevoleFormSchema.safeParse(parseBenevoleFormFields(formData))
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Données invalides."
    return { error: message }
  }

  const emailConflict = await findVolunteerEmailConflict(parsed.data.email)
  if (emailConflict) {
    return { error: emailConflict }
  }

  try {
    const imageUrl = await resolveImageUrl(formData, {})
    const addressId = await resolveAddressId(parsed.data, null)

    const volunteerPosteId = await getPosteIdByCode(prisma, "VOLUNTEER")
    if (!volunteerPosteId) {
      return { error: "Configuration des postes incomplète (VOLUNTEER manquant)." }
    }

    const { firstName, lastName, email, phone, showOnSite } = parsed.data

    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        posteId: volunteerPosteId,
        image: imageUrl ?? null,
        showOnSite,
        addressId,
      },
    })

    await prisma.volunteer.create({
      data: { personId: person.id },
    })

    revalidateBenevolesLists()
    return { success: true }
  } catch {
    return { error: "Erreur lors de la création du bénévole." }
  }
}

// ── Modifier ───────────────────────────────────────────────────────────────────

export async function updateBenevole(
  id: string,
  formData: FormData,
): Promise<BenevoleActionResult> {
  await requireBenevolesWrite()

  const parsed = benevoleFormSchema.safeParse(parseBenevoleFormFields(formData))
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Données invalides."
    return { error: message }
  }

  const volunteer = await prisma.volunteer.findUnique({ where: { id } })
  if (!volunteer) {
    return { error: "Bénévole introuvable." }
  }

  const emailConflict = await findVolunteerEmailConflict(
    parsed.data.email,
    volunteer.personId,
  )
  if (emailConflict) {
    return { error: emailConflict }
  }

  try {
    const existing = await prisma.person.findUnique({
      where: { id: volunteer.personId },
      include: { address: true },
    })
    if (!existing) {
      return { error: "Bénévole introuvable." }
    }

    const removeImage = formData.get("removeImage") === "true"
    const imageUrl = await resolveImageUrl(formData, { removeImage })
    const addressId = await resolveAddressId(parsed.data, existing.addressId)

    const { firstName, lastName, email, phone, showOnSite } = parsed.data

    await prisma.person.update({
      where: { id: volunteer.personId },
      data: {
        firstName,
        lastName,
        email,
        phone,
        showOnSite,
        addressId,
        ...(imageUrl !== undefined ? { image: imageUrl } : {}),
      },
    })

    if (imageUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing.image,
        nextUrl: imageUrl ?? null,
      })
    }

    revalidateBenevolesLists()
    return { success: true }
  } catch {
    return { error: "Erreur lors de la mise à jour du bénévole." }
  }
}

// ── Supprimer ──────────────────────────────────────────────────────────────────

export async function deleteBenevole(id: string) {
  await requireBenevoleDelete()
  await prisma.volunteer.delete({ where: { id } })
  revalidateBenevolesLists()
}

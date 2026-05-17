"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPosteIdByCode } from "@/helpers/poste-helpers"
import {
  requireAdmin,
  requireBureauAdminBenevoles,
  requireBureauAdminDelete,
  requireBureauAdminMembres,
} from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import type { MembreBureauRow } from "../_components/membres-team-table"
import { revokeDashboardAccess } from "../../acces/_actions/dashboard-access-actions"

// ── Lister les utilisateurs ────────────────────────────────────────────────────

export async function listUsers() {
  await requireBureauAdminMembres()
  const result = await auth.api.listUsers({
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    headers: await headers(),
  })
  return result.users ?? []
}

// ── Comptes dashboard (`User` uniquement — personnes sans accès non listées ici) ─

export async function listComptes() {
  await requireBureauAdminMembres()
  const authUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  if (authUsers.length === 0) return []

  const userIds = authUsers.map((u) => u.id)
  const persons = await prisma.person.findMany({
    where: { userId: { in: userIds } },
    include: { poste: true },
  })
  const personIds = persons.map((p) => p.id)
  const teamMembers = personIds.length > 0
    ? await prisma.teamMember.findMany({ where: { personId: { in: personIds } } })
    : []

  return authUsers.map((u) => {
    const person = persons.find((p) => p.userId === u.id) ?? null
    const tm = person ? (teamMembers.find((tm) => tm.personId === person.id) ?? null) : null
    const imageFromTeamMember = tm?.imageId
      ? cloudinaryImageUrl(tm.imageId, "w_80,h_80,c_fill,q_auto,f_auto")
      : null
    const image = person?.image ?? imageFromTeamMember ?? u.image ?? null
    return { ...u, posteLabel: person?.poste?.labelFr ?? null, image }
  })
}

// ── Membres du bureau (table `team_members`, page Membres) ───────────────────

/**
 * Lignes `team_members` triées par `order`, avec personne, rôle GAM et compte d’accès optionnel.
 */
export async function listTeamMembersForMembresPage(): Promise<MembreBureauRow[]> {
  await requireBureauAdminMembres()
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
    include: {
      person: { include: { poste: true } },
    },
  })
  if (members.length === 0) return []

  const userIds = members.map((m) => m.person.userId).filter((id): id is string => id != null)
  const users =
    userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : []
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]))

  return members.map((tm) => {
    const person = tm.person
    const user = person.userId ? usersById[person.userId] ?? null : null
    const imageFromTeamMember = tm.imageId
      ? cloudinaryImageUrl(tm.imageId, "w_80,h_80,c_fill,q_auto,f_auto")
      : null
    const image = person.image ?? imageFromTeamMember ?? user?.image ?? null

    return {
      id: tm.id,
      personId: person.id,
      userId: person.userId,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email ?? user?.email ?? null,
      phone: person.phone,
      posteLabel: person.poste?.labelFr ?? null,
      image,
      dashboardRole: user?.role ?? null,
      banned: user?.banned === true,
    }
  })
}

// ── Modifier le rôle (compte dashboard uniquement) ───────────────────────────────

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin()

  await prisma.user.update({ where: { id: userId }, data: { role } })
  revalidatePath("/bureau/membres")
  revalidatePath("/bureau/acces")
}

// ── Bannir / débannir ──────────────────────────────────────────────────────────

export async function banUser(userId: string) {
  await requireAdmin()
  await auth.api.banUser({
    body: { userId },
    headers: await headers(),
  })
  revalidatePath("/bureau/membres")
  revalidatePath("/bureau/acces")
}

export async function unbanUser(userId: string) {
  await requireAdmin()
  await auth.api.unbanUser({
    body: { userId },
    headers: await headers(),
  })
  revalidatePath("/bureau/membres")
  revalidatePath("/bureau/acces")
}

/** Révoque l'accès dashboard : supprime le `User`, conserve la fiche `Person`. */
export async function deleteUser(userId: string) {
  return revokeDashboardAccess(userId)
}

// ── Lister les bénévoles (table `volunteers`) ────────────────────────────────

export async function listBenevoles() {
  await requireBureauAdminBenevoles()
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
    select: { personId: true },
  })

  const personIds = volunteers.map((v) => v.personId)
  if (personIds.length === 0) return []

  const persons = await prisma.person.findMany({
    where: { id: { in: personIds } },
  })

  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return personIds
    .map((id) => personsById[id] ?? null)
    .filter((p): p is NonNullable<typeof p> => p != null)
}

// ── Créer un bénévole (table Person) ──────────────────────────────────────────

export async function createBenevole(formData: FormData) {
  await requireBureauAdminBenevoles()

  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName")  as string
  const email     = formData.get("email")     as string | null
  const phone     = formData.get("phone")     as string

  const address    = (formData.get("address")  as string | null)?.trim() || null
  const zipCode    = (formData.get("zipCode")  as string | null)?.trim() || null
  const city       = (formData.get("city")     as string | null)?.trim() || null
  const country    = (formData.get("country")  as string | null)?.trim() || "France"
  const showOnSite = formData.get("showOnSite") !== "false"
  const imageFile  = formData.get("imageFile") as File | null

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  const hasAddress = !!(address && zipCode && city)
  if ((address || zipCode || city) && !hasAddress) {
    return { error: "Pour enregistrer l'adresse, renseignez la rue, le code postal et la ville." }
  }

  try {
    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/persons")
      imageUrl = result.url
    }

    const addressRecord = hasAddress
      ? await prisma.address.create({
          data: {
            address: address!,
            zipCode: zipCode!,
            city:    city!,
            country,
            state:       "",
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase(),
          },
        })
      : null

    const volunteerPosteId = await getPosteIdByCode(prisma, "VOLUNTEER")
    if (!volunteerPosteId) {
      return { error: "Configuration des postes incomplète (VOLUNTEER manquant)." }
    }

    await prisma.person.create({
      data: {
        firstName,
        lastName,
        email:      email || null,
        phone,
        posteId:    volunteerPosteId,
        addressId:  addressRecord?.id ?? null,
        image:      imageUrl,
        showOnSite,
      },
    })

    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la création du bénévole." }
  }
}

// ── Modifier un bénévole (table Person) ───────────────────────────────────────

export async function updateBenevole(personId: string, formData: FormData) {
  await requireBureauAdminBenevoles()

  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName")  as string
  const email     = formData.get("email")     as string | null
  const phone     = formData.get("phone")     as string

  const address    = (formData.get("address")  as string | null)?.trim() || null
  const zipCode    = (formData.get("zipCode")  as string | null)?.trim() || null
  const city       = (formData.get("city")     as string | null)?.trim() || null
  const country    = (formData.get("country")  as string | null)?.trim() || "France"
  const showOnSite = formData.get("showOnSite") !== "false"
  const imageFile  = formData.get("imageFile") as File | null
  const removeImage = formData.get("removeImage") === "true"

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  const hasAddress = !!(address && zipCode && city)
  if ((address || zipCode || city) && !hasAddress) {
    return { error: "Pour enregistrer l'adresse, renseignez la rue, le code postal et la ville." }
  }

  try {
    const existing = await prisma.person.findUnique({
      where: { id: personId },
      include: { address: true },
    })
    if (!existing) return { error: "Bénévole introuvable." }

    let imageUrl: string | null | undefined = undefined
    if (removeImage) {
      imageUrl = null
    } else if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/persons")
      imageUrl = result.url
    }

    let addressId: string | null = existing.addressId
    if (hasAddress) {
      if (existing.addressId) {
        await prisma.address.update({
          where: { id: existing.addressId },
          data: { address: address!, zipCode: zipCode!, city: city!, country,
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase() },
        })
      } else {
        const addressRecord = await prisma.address.create({
          data: {
            address: address!, zipCode: zipCode!, city: city!, country, state: "",
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase(),
          },
        })
        addressId = addressRecord.id
      }
    } else {
      addressId = null
    }

    await prisma.person.update({
      where: { id: personId },
      data: {
        firstName,
        lastName,
        email:     email || null,
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

    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la mise à jour du bénévole." }
  }
}

// ── Supprimer un bénévole (table Person) ──────────────────────────────────────

export async function deleteBenevole(personId: string) {
  await requireBureauAdminDelete()
  try {
    const existing = await prisma.person.findUnique({
      where: { id: personId },
      select: { image: true },
    })
    await prisma.person.delete({ where: { id: personId } })
    if (existing?.image) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing.image,
        nextUrl: null,
      })
    }
    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la suppression du bénévole." }
  }
}

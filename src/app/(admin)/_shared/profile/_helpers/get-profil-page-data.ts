import { prisma } from "@/lib/prisma"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

interface SessionUserForProfil {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly role: string | null | undefined
  readonly image?: string | null
}

/**
 * Données initiales du formulaire « Mon profil » (Person, poste, image).
 */
export async function getProfilPageData(sessionUser: SessionUserForProfil) {
  const person = await prisma.person.findUnique({
    where: { userId: sessionUser.id },
    include: { poste: true },
  })

  const teamMember = person
    ? await prisma.teamMember.findUnique({ where: { personId: person.id } })
    : null

  const imageFromTeamMember = teamMember?.imageId
    ? cloudinaryImageUrl(teamMember.imageId, "w_400,h_400,c_fill,q_auto,f_auto")
    : null

  const resolvedImage =
    person?.image ?? imageFromTeamMember ?? sessionUser.image ?? null

  const nameParts = sessionUser.name.split(" ")
  const fallbackFirst = nameParts[0] ?? ""
  const fallbackLast = nameParts.slice(1).join(" ") || ""

  return {
    firstName: person?.firstName ?? fallbackFirst,
    lastName: person?.lastName ?? fallbackLast,
    email: sessionUser.email,
    phone: person?.phone ?? "",
    role: sessionUser.role ?? null,
    poste: person?.poste?.labelFr ?? null,
    image: resolvedImage,
  }
}

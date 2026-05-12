import { prisma } from "@/lib/prisma";
import {
  adherentDetailSchema,
  type AdherentDetail,
} from "@/lib/schemas/adherent-detail.schema";

function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Fin d’adhésion : 31 décembre de l’année de cotisation. */
function membershipEndDateForYear(year: number): Date {
  return new Date(Date.UTC(year, 11, 31));
}

/**
 * Fiche détail : personne avec au moins une cotisation, et toutes ses adhésions + paiements.
 *
 * @returns `null` si la personne n’existe pas ou n’a aucune cotisation.
 */
export async function getAdherentDetailForDashboard(
  personId: string,
): Promise<AdherentDetail | null> {
  const person = await prisma.person.findFirst({
    where: {
      id: personId,
      memberShips: { some: {} },
    },
    include: {
      memberShips: {
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        include: {
          payment: {
            select: {
              id: true,
              paymentReference: true,
              paymentDate: true,
              status: true,
              amount: true,
            },
          },
        },
      },
    },
  });

  if (!person) {
    return null;
  }

  const raw: AdherentDetail = {
    personId: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    email: person.email,
    phone: person.phone,
    image: person.image,
    memberships: person.memberShips.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      amount: m.amount,
      year: m.year,
      isActive: m.isActive,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      membershipEndDateFormatted: formatDateFr(membershipEndDateForYear(m.year)),
      payment: {
        id: m.payment.id,
        paymentReference: m.payment.paymentReference,
        paymentDate: m.payment.paymentDate.toISOString(),
        status: m.payment.status,
        amount: m.payment.amount,
      },
    })),
  };

  return adherentDetailSchema.parse(raw);
}

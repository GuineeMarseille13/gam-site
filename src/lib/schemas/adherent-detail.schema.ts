import { z } from "zod";

/** Paiement lié à une cotisation (aperçu bureau). */
export const adherentMembershipPaymentSchema = z
  .object({
    id: z.string(),
    paymentReference: z.string(),
    paymentMethod: z.string(),
    paymentDate: z.string(),
    status: z.string(),
    amount: z.number().int(),
  })
  .strict();

export type AdherentMembershipPayment = z.infer<typeof adherentMembershipPaymentSchema>;

/** Une ligne de cotisation / adhésion pour la fiche détail. */
export const adherentMembershipLineSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    amount: z.number().int(),
    year: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    membershipEndDateFormatted: z.string(),
    payment: adherentMembershipPaymentSchema,
  })
  .strict();

export type AdherentMembershipLine = z.infer<typeof adherentMembershipLineSchema>;

/** Fiche adhérent : contact + toutes les cotisations. */
export const adherentDetailSchema = z
  .object({
    personId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().nullable(),
    phone: z.string(),
    image: z.string().nullable(),
    memberships: z.array(adherentMembershipLineSchema),
  })
  .strict();

export type AdherentDetail = z.infer<typeof adherentDetailSchema>;

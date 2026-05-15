import { z } from "zod";

// Validation téléphone français : 10 chiffres (peut commencer par 0 ou +33)
const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/;

function validateFrenchPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return frenchPhoneRegex.test(cleaned);
}

export const memberSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phone: z.string().refine(
    (val) => validateFrenchPhone(val.replace(/\s/g, "")),
    { message: "Numéro de téléphone français invalide (ex: 06 12 34 56 78)" }
  ),
  email: z
    .string()
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      { message: "Email invalide" }
    )
    .optional(),
});

export type Member = z.infer<typeof memberSchema>;

export const adhesionPayloadSchema = z.object({
  members: z.array(memberSchema).min(1, "Ajoutez au moins une personne"),
  message: z.string().max(500).optional().or(z.literal("")),
});

export type AdhesionPayload = z.infer<typeof adhesionPayloadSchema>;

export const adhesionPayloadWithYearSchema = adhesionPayloadSchema
  .extend({
    membershipYear: z.number().int().min(2000).max(2100).optional(),
  })
  .strict();

export type AdhesionPayloadWithYear = z.infer<typeof adhesionPayloadWithYearSchema>;

export const manualAdhesionPaymentMethodSchema = z.enum(["espece", "virement"]);

export type ManualAdhesionPaymentMethod = z.infer<
  typeof manualAdhesionPaymentMethodSchema
>;

export const MANUAL_ADHESION_PAYMENT_METHOD_LABELS: Record<
  ManualAdhesionPaymentMethod,
  string
> = {
  espece: "Espèces",
  virement: "Virement",
};

export const manualAdhesionPayloadSchema = adhesionPayloadWithYearSchema
  .extend({
    paymentMethod: manualAdhesionPaymentMethodSchema,
  })
  .strict();

export type ManualAdhesionPayload = z.infer<typeof manualAdhesionPayloadSchema>;

export const PRICE_PER_MEMBER_EUR = 10;

/** Année de cotisation : valeur explicite ou année civile en cours. */
export function resolveMembershipYear(explicit?: number): number {
  if (
    explicit !== undefined &&
    Number.isFinite(explicit) &&
    explicit >= 2000 &&
    explicit <= 2100
  ) {
    return explicit;
  }
  return new Date().getFullYear();
}

export function computeAdhesionTotalEur(memberCount: number): number {
  return memberCount * PRICE_PER_MEMBER_EUR;
}



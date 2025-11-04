import { z } from "zod";

// Validation téléphone français : 10 chiffres (peut commencer par 0 ou +33)
const frenchPhoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/;

function validateFrenchPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return frenchPhoneRegex.test(cleaned);
}

export const donSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phone: z
    .string()
    .refine(
      (val) => !val || val.trim() === "" || validateFrenchPhone(val.replace(/\s/g, "")),
      { message: "Numéro de téléphone français invalide (ex: 06 12 34 56 78)" }
    )
    .optional(),
  email: z
    .string()
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      { message: "Email invalide" }
    )
    .optional(),
  amount: z
    .number()
    .min(1, "Le montant minimum est de 1€")
    .max(10000, "Le montant maximum est de 10000€"),
  message: z.string().max(500).optional().or(z.literal("")),
});

export type Don = z.infer<typeof donSchema>;

export const donPayloadSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phone: z
    .string()
    .refine(
      (val) => !val || val.trim() === "" || validateFrenchPhone(val.replace(/\s/g, "")),
      { message: "Numéro de téléphone français invalide (ex: 06 12 34 56 78)" }
    )
    .optional(),
  email: z
    .string()
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      { message: "Email invalide" }
    )
    .optional(),
  amount: z
    .number()
    .min(1, "Le montant minimum est de 1€")
    .max(10000, "Le montant maximum est de 10000€"),
  message: z.string().max(500).optional().or(z.literal("")),
});

export type DonPayload = z.infer<typeof donPayloadSchema>;

export const MIN_DON_AMOUNT_EUR = 1;
export const MAX_DON_AMOUNT_EUR = 10000;
export const SUGGESTED_AMOUNTS = [10, 25, 50, 100, 250];


import { z } from "zod"

const emailAddressSchema = z
  .string()
  .trim()
  .min(3)
  .refine((value) => value.includes("@"), "Adresse e-mail invalide")

const emailEnvSchema = z
  .object({
    RESEND_API_KEY: z.string().trim().min(1).optional(),
    RESEND_FROM_EMAIL: emailAddressSchema.optional(),
    RESEND_FROM_NAME: z.string().trim().min(1).optional(),
    EMAIL_REPLY_TO: emailAddressSchema.optional(),
  })
  .strict()

export type EmailEnv = z.infer<typeof emailEnvSchema>

/**
 * Lit et valide les variables d’environnement liées à Resend.
 */
export function getEmailEnv(): EmailEnv {
  return emailEnvSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
    EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO,
  })
}

/**
 * Indique si l’envoi d’e-mails via Resend est configuré (clé API + expéditeur).
 */
export function isEmailConfigured(): boolean {
  const env = getEmailEnv()
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL)
}

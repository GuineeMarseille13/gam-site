import { z } from "zod"

const emailRecipientSchema = z.union([
  z.string().email("Destinataire invalide"),
  z.array(z.string().email("Destinataire invalide")).min(1).max(50),
])

export const sendEmailPayloadSchema = z
  .object({
    to: emailRecipientSchema,
    subject: z.string().trim().min(1, "Sujet requis").max(998),
    html: z.string().trim().min(1, "Contenu HTML requis"),
    text: z.string().trim().min(1).optional(),
    replyTo: z.union([z.string().email(), z.array(z.string().email())]).optional(),
    idempotencyKey: z.string().trim().min(1).max(256).optional(),
    tags: z
      .array(
        z
          .object({
            name: z.string().trim().min(1).max(256),
            value: z.string().trim().max(256),
          })
          .strict(),
      )
      .max(10)
      .optional(),
  })
  .strict()

export type SendEmailPayload = z.infer<typeof sendEmailPayloadSchema>

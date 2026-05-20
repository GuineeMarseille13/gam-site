import { z } from "zod"

const emailRecipientSchema = z.string().email()

const adhesionMemberLineSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    phone: z.string().trim().min(1).optional(),
  })
  .strict()

export const adhesionConfirmationEmailSchema = z
  .object({
    to: emailRecipientSchema,
    recipientFirstName: z.string().trim().min(1),
    members: z.array(adhesionMemberLineSchema).min(1),
    membershipYear: z.number().int().min(2000).max(2100),
    totalAmountEur: z.number().positive(),
    paymentReference: z.string().trim().min(1),
    paymentMethodLabel: z.string().trim().min(1).optional(),
  })
  .strict()

export type AdhesionConfirmationEmailPayload = z.infer<
  typeof adhesionConfirmationEmailSchema
>

export const donationConfirmationEmailSchema = z
  .object({
    to: emailRecipientSchema,
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    amountEur: z.number().positive(),
    message: z.string().trim().max(500).optional(),
    paymentReference: z.string().trim().min(1),
    paymentMethodLabel: z.string().trim().min(1).optional(),
  })
  .strict()

export type DonationConfirmationEmailPayload = z.infer<
  typeof donationConfirmationEmailSchema
>

const orderLineSchema = z
  .object({
    productName: z.string().trim().min(1),
    quantity: z.number().int().positive(),
    lineTotalCents: z.number().int().nonnegative(),
  })
  .strict()

export const orderConfirmationEmailSchema = z
  .object({
    to: emailRecipientSchema,
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    orderNumber: z.string().trim().min(1),
    lines: z.array(orderLineSchema).min(1),
    totalAmountCents: z.number().int().positive(),
    paymentReference: z.string().trim().min(1),
    paymentMethodLabel: z.string().trim().min(1).optional(),
  })
  .strict()

export type OrderConfirmationEmailPayload = z.infer<typeof orderConfirmationEmailSchema>

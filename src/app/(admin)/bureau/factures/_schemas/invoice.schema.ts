import { z } from "zod"

export const invoicePaymentParamsSchema = z
  .object({
    paymentId: z.string().min(1, "Identifiant de paiement invalide"),
  })
  .strict()

export type InvoicePaymentParams = z.infer<typeof invoicePaymentParamsSchema>

export const invoiceIssuerSchema = z
  .object({
    legalName: z.string(),
    tagline: z.string().optional(),
    addressLines: z.array(z.string()),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .strict()

export const invoiceCustomerSchema = z
  .object({
    fullName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    addressLines: z.array(z.string()),
  })
  .strict()

export const invoiceLineSchema = z
  .object({
    label: z.string(),
    quantity: z.number().int().positive(),
    unitAmountEur: z.number(),
    totalAmountEur: z.number(),
  })
  .strict()

export const invoiceBureauSectionSchema = z.enum(["dons", "adhesions", "commandes"])

export type InvoiceBureauSection = z.infer<typeof invoiceBureauSectionSchema>

export const invoiceDocumentSchema = z
  .object({
    invoiceNumber: z.string(),
    issuedAtIso: z.string(),
    paymentId: z.string(),
    paymentReference: z.string(),
    paymentMethodLabel: z.string(),
    paymentTypeLabel: z.string(),
    /** Liste bureau d’où contextualiser fil d’Ariane + retour */
    bureauSection: invoiceBureauSectionSchema,
    issuer: invoiceIssuerSchema,
    customer: invoiceCustomerSchema,
    lines: z.array(invoiceLineSchema),
    totalEur: z.number(),
    legalFooterLines: z.array(z.string()),
  })
  .strict()

export type InvoiceDocument = z.infer<typeof invoiceDocumentSchema>
export type InvoiceLine = z.infer<typeof invoiceLineSchema>

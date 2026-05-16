import { prisma } from "@/lib/prisma"
import { formatPaymentMethodLabel } from "@/config/bureau-payment-methods"
import {
  INVOICE_LEGAL_FOOTER_LINES,
  INVOICE_LEGAL_NAME,
  INVOICE_TAGLINE,
} from "@/config/invoice"
import {
  invoiceDocumentSchema,
  invoicePaymentParamsSchema,
  type InvoiceDocument,
  type InvoiceLine,
} from "../_schemas/invoice.schema"

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  adhesion: "Adhésion",
  donation: "Don",
  order: "Commande boutique",
}

function getPaymentTypeLabel(type: string): string {
  return PAYMENT_TYPE_LABELS[type] ?? type
}

function buildIssuerFromContact(contact: {
  address: string
  city: string
  zipCode: string
  email: string
  phone: string
}): InvoiceDocument["issuer"] {
  const addressLines: string[] = []
  if (contact.address.trim()) {
    addressLines.push(contact.address.trim())
  }
  const cityLine = [contact.zipCode.trim(), contact.city.trim()].filter(Boolean).join(" ")
  if (cityLine) {
    addressLines.push(cityLine)
  }
  if (addressLines.length === 0) {
    addressLines.push("Adresse à compléter (réglages Contact bureau)")
  }

  return {
    legalName: INVOICE_LEGAL_NAME,
    tagline: INVOICE_TAGLINE,
    addressLines,
    email: contact.email.trim() || undefined,
    phone: contact.phone.trim() || undefined,
  }
}

function buildCustomer(person: {
  firstName: string
  lastName: string
  email: string | null
  phone: string
  address: {
    address: string
    city: string
    zipCode: string
    country: string
  } | null
}): InvoiceDocument["customer"] {
  const addressLines: string[] = []
  if (person.address) {
    if (person.address.address.trim()) {
      addressLines.push(person.address.address.trim())
    }
    const line = [person.address.zipCode.trim(), person.address.city.trim()]
      .filter(Boolean)
      .join(" ")
    if (line) {
      addressLines.push(line)
    }
    if (person.address.country.trim()) {
      addressLines.push(person.address.country.trim())
    }
  }

  return {
    fullName: `${person.firstName} ${person.lastName}`.trim(),
    email: person.email?.trim() || undefined,
    phone: person.phone.trim() || undefined,
    addressLines,
  }
}

function buildLinesFromPayment(
  type: string,
  amountEur: number,
  data: {
    donations: Array<{ title: string; message: string | null; amount: number }>
    memberShips: Array<{ title: string; year: number; amount: number }>
    orders: Array<{
      orderNumber: string
      items: Array<{ quantity: number; price: number; subtotal: number; product: { title: string } }>
    }>
  },
): InvoiceLine[] {
  if (data.donations.length > 0) {
    return data.donations.map((d) => ({
      label: d.title || "Don",
      quantity: 1,
      unitAmountEur: d.amount,
      totalAmountEur: d.amount,
    }))
  }

  if (data.memberShips.length > 0) {
    return data.memberShips.map((m) => ({
      label: m.title || "Adhésion",
      quantity: 1,
      unitAmountEur: m.amount,
      totalAmountEur: m.amount,
    }))
  }

  if (data.orders.length > 0) {
    const order = data.orders[0]
    if (!order) {
      return []
    }

    return order.items.map((item) => ({
      label: item.product.title,
      quantity: item.quantity,
      unitAmountEur: item.price / 100,
      totalAmountEur: item.subtotal / 100,
    }))
  }

  return [
    {
      label: getPaymentTypeLabel(type),
      quantity: 1,
      unitAmountEur: amountEur,
      totalAmountEur: amountEur,
    },
  ]
}

function getBureauSectionFromPaymentType(type: string): InvoiceDocument["bureauSection"] {
  if (type === "donation") return "dons"
  if (type === "adhesion") return "adhesions"
  if (type === "order") return "commandes"
  return "dons"
}

function paymentAmountAsDisplayEur(type: string, rawAmount: number): number {
  if (type === "order") {
    return rawAmount / 100
  }
  return rawAmount
}

/**
 * Charge un paiement et construit le document facture / reçu (validé Zod).
 */
export async function fetchInvoiceDataByPaymentId(
  rawParams: unknown,
): Promise<{ success: true; data: InvoiceDocument } | { success: false; error: "NOT_FOUND" }> {
  const parsedParams = invoicePaymentParamsSchema.safeParse(rawParams)
  if (!parsedParams.success) {
    return { success: false, error: "NOT_FOUND" }
  }

  const { paymentId } = parsedParams.data

  const [payment, contact] = await Promise.all([
    prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        person: { include: { address: true } },
        donations: { orderBy: { createdAt: "asc" } },
        memberShips: { orderBy: { createdAt: "asc" } },
        orders: {
          orderBy: { createdAt: "asc" },
          include: {
            items: { include: { product: true } },
          },
        },
      },
    }),
    prisma.contact.findFirst(),
  ])

  if (!payment || !payment.person) {
    return { success: false, error: "NOT_FOUND" }
  }

  const issuer = buildIssuerFromContact(
    contact ?? {
      address: "",
      city: "",
      zipCode: "",
      email: "",
      phone: "",
    },
  )

  const customer = buildCustomer(payment.person)

  const displayTotalEur = paymentAmountAsDisplayEur(payment.type, payment.amount)
  const lines = buildLinesFromPayment(payment.type, displayTotalEur, {
    donations: payment.donations,
    memberShips: payment.memberShips,
    orders: payment.orders,
  })

  const issuedAt = payment.paymentDate ?? payment.createdAt
  const year = issuedAt.getFullYear()
  const invoiceNumber = `FAC-${year}-${payment.id.slice(-8).toUpperCase()}`

  const raw = {
    invoiceNumber,
    issuedAtIso: issuedAt.toISOString(),
    paymentId: payment.id,
    paymentReference: payment.paymentReference,
    paymentMethodLabel: formatPaymentMethodLabel(payment.paymentMethod),
    paymentTypeLabel: getPaymentTypeLabel(payment.type),
    bureauSection: getBureauSectionFromPaymentType(payment.type),
    issuer,
    customer,
    lines,
    totalEur: displayTotalEur,
    legalFooterLines: [...INVOICE_LEGAL_FOOTER_LINES],
  }

  const data = invoiceDocumentSchema.parse(raw)
  return { success: true, data }
}

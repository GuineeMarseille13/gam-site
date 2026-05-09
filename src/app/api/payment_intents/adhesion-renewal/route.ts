import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { z } from "zod"

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"
import { PRICE_PER_MEMBER_EUR } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { adhesionRenewalPayloadSchema } from "@/app/(admin)/bureau/adhesions/_schemas/adhesion-renewal.schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const RENEWAL_MESSAGE_MAX_LEN = 500

function getNextMembershipYear(currentYear: number): number {
  return currentYear + 1
}

function buildRenewalMessage(nextYear: number): string {
  const message = `Renouvellement d’adhésion ${nextYear}`
  return message.length > RENEWAL_MESSAGE_MAX_LEN
    ? message.slice(0, RENEWAL_MESSAGE_MAX_LEN)
    : message
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isBureauDashboardRole(session.user.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = adhesionRenewalPayloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const membership = await prisma.memberShip.findUnique({
    where: { id: parsed.data.memberShipId },
    include: { person: true },
  })

  if (!membership || !membership.person) {
    return NextResponse.json({ error: "Adhésion introuvable" }, { status: 404 })
  }

  const nextYear = getNextMembershipYear(membership.year)

  // Re-use le flow existant (PaymentIntent + webhook) : 1 membre = 1 adhésion.
  const amount = PRICE_PER_MEMBER_EUR * 100
  const members = [
    {
      firstName: membership.person.firstName,
      lastName: membership.person.lastName,
      phone: membership.person.phone,
      email: membership.person.email ?? "",
    },
  ]

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    metadata: {
      type: "adhesion",
      membership_year: String(nextYear),
      members_count: "1",
      members: JSON.stringify(members),
      message: buildRenewalMessage(nextYear),
      renewal_from_membership_id: membership.id,
    },
    payment_method_types: ["card"],
  })

  const responseSchema = z
    .object({
      clientSecret: z.string().min(1),
      paymentIntentId: z.string().min(1),
      nextYear: z.number().int(),
    })
    .strict()

  return NextResponse.json(
    responseSchema.parse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      nextYear,
    }),
  )
}


import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sessionCanAccessBureauPaiements } from "@/helpers/api-dashboard-auth"
import { adhesionRenewalPayloadSchema } from "@/app/(admin)/bureau/adhesions/_schemas/adhesion-renewal.schema"
import { createAdhesionStripePaymentIntent } from "@/app/(public)/adhesion/_services/create-adhesion-stripe-payment-intent"

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
  if (!session || !sessionCanAccessBureauPaiements(session.user.role)) {
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
  const members = [
    {
      firstName: membership.person.firstName,
      lastName: membership.person.lastName,
      phone: membership.person.phone,
      email: membership.person.email ?? "",
    },
  ]

  try {
    const result = await createAdhesionStripePaymentIntent({
      members,
      message: buildRenewalMessage(nextYear),
      membershipYear: nextYear,
      extraMetadata: {
        renewal_from_membership_id: membership.id,
      },
    })

    const responseSchema = z
      .object({
        clientSecret: z.string().min(1),
        paymentIntentId: z.string().min(1),
        nextYear: z.number().int(),
      })
      .strict()

    if (!result.clientSecret) {
      return NextResponse.json(
        { error: "Secret de paiement indisponible" },
        { status: 500 },
      )
    }

    return NextResponse.json(
      responseSchema.parse({
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        nextYear,
      }),
    )
  } catch (err) {
    console.error("[payment_intents/adhesion-renewal]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    )
  }
}

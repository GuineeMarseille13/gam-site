import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"

import { detailsPoleStatSchema } from "@/app/(admin)/bureau/poles/_schemas/details-pole-stat.schema"
import {
  detailsPoleStatUpsertSchema,
  type DetailsPoleStatUpsertInput,
} from "@/app/(admin)/bureau/poles/_schemas/details-pole-stat-form.schema"

const statIdSchema = z.string().min(1)

async function requireBureauApiAccess(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  return !!session && isBureauDashboardRole(session.user.role)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ statId: string }> },
): Promise<NextResponse> {
  const hasAccess = await requireBureauApiAccess()
  if (!hasAccess) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const { statId } = await params
  const parsedId = statIdSchema.safeParse(statId)
  if (!parsedId.success) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 })
  }

  const json: unknown = await request.json()
  const parsedInput = detailsPoleStatUpsertSchema.safeParse(json)
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: parsedInput.error.flatten() },
      { status: 400 },
    )
  }

  const data: DetailsPoleStatUpsertInput = parsedInput.data

  const updated = await prisma.detailsPoleStat.update({
    where: { id: parsedId.data },
    data: {
      label: data.label,
      value: data.value,
      unit: data.unit ?? null,
      helperText: data.helperText ?? null,
      order: data.order,
      isActive: data.isActive,
    },
  })

  const payload: unknown = {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }

  return NextResponse.json(detailsPoleStatSchema.parse(payload))
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ statId: string }> },
): Promise<NextResponse> {
  const hasAccess = await requireBureauApiAccess()
  if (!hasAccess) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const { statId } = await params
  const parsedId = statIdSchema.safeParse(statId)
  if (!parsedId.success) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 })
  }

  await prisma.detailsPoleStat.delete({ where: { id: parsedId.data } })
  return NextResponse.json({ success: true })
}


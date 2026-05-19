import { NextResponse } from "next/server"
import { z } from "zod"


import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"
import { hasPoleApiAccess } from "@/helpers/pole-api-auth"

import { detailsPoleStatListSchema } from "@/app/(admin)/bureau/poles/_schemas/details-pole-stat.schema"
import {
  detailsPoleStatUpsertSchema,
  type DetailsPoleStatUpsertInput,
} from "@/app/(admin)/bureau/poles/_schemas/details-pole-stat-form.schema"

const poleSlugSchema = z.string().min(1)


async function resolveDetailsPoleId(poleSlug: string): Promise<string | null> {
  const pole = await findPoleBySlugOrId(poleSlug)
  return pole?.detailsPoleId ?? null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ poleSlug: string }> },
): Promise<NextResponse> {
  const { poleSlug } = await params
  const parsedSlug = poleSlugSchema.safeParse(poleSlug)
  if (!parsedSlug.success) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 400 })
  }

  if (!(await hasPoleApiAccess(parsedSlug.data))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const detailsPoleId = await resolveDetailsPoleId(parsedSlug.data)
  if (!detailsPoleId) {
    return NextResponse.json({ error: "Pôle introuvable." }, { status: 404 })
  }

  const rows = await prisma.detailsPoleStat.findMany({
    where: { detailsPoleId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })

  // Prisma renvoie des Date → on sérialise en ISO pour matcher le schéma.
  const payload: unknown = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  const validated = detailsPoleStatListSchema.parse(payload)
  return NextResponse.json(validated)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ poleSlug: string }> },
): Promise<NextResponse> {
  const { poleSlug } = await params
  const parsedSlug = poleSlugSchema.safeParse(poleSlug)
  if (!parsedSlug.success) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 400 })
  }

  if (!(await hasPoleApiAccess(parsedSlug.data))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const detailsPoleId = await resolveDetailsPoleId(parsedSlug.data)
  if (!detailsPoleId) {
    return NextResponse.json({ error: "Pôle introuvable." }, { status: 404 })
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

  try {
    const created = await prisma.detailsPoleStat.create({
      data: {
        detailsPoleId,
        label: data.label,
        value: data.value,
        unit: data.unit ?? null,
        helperText: data.helperText ?? null,
        order: data.order,
        isActive: data.isActive,
      },
    })

    return NextResponse.json({
      ...created,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    })
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Cet ordre est déjà utilisé. Choisissez un autre ordre." },
        { status: 409 },
      )
    }
    throw error
  }
}


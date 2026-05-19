import { NextResponse } from "next/server"
import { z } from "zod"


import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { findPoleBySlugOrId } from "@/lib/api/pole-by-slug"
import { hasPoleApiAccess } from "@/helpers/pole-api-auth"

const poleSlugSchema = z.string().min(1)

const upsertSchema = z
  .object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères.").max(80),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères.")
      .max(1200, "La description ne peut pas dépasser 1200 caractères."),
    icon: z
      .string()
      .max(8, "L’icône ne peut pas dépasser 8 caractères.")
      .optional()
      .nullable()
      .transform((v) => (v?.trim() ? v.trim() : null)),
    order: z.coerce.number().int("L’ordre doit être un entier.").min(0).default(0),
    isActive: z.coerce.boolean().default(true),
  })
  .strict()


async function resolveDetailsPoleId(poleSlug: string): Promise<string | null> {
  const pole = await findPoleBySlugOrId(poleSlug)
  return pole?.detailsPoleId ?? null
}

function serializeRow(row: {
  id: string
  detailsPoleId: string
  title: string
  description: string
  icon: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
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

  const rows = await prisma.detailsPoleService.findMany({
    where: { detailsPoleId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })

  return NextResponse.json(rows.map(serializeRow))
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
  const parsedInput = upsertSchema.safeParse(json)
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: parsedInput.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const created = await prisma.detailsPoleService.create({
      data: {
        detailsPoleId,
        title: parsedInput.data.title,
        description: parsedInput.data.description,
        icon: parsedInput.data.icon ?? null,
        order: parsedInput.data.order,
        isActive: parsedInput.data.isActive,
      },
    })

    return NextResponse.json(serializeRow(created))
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


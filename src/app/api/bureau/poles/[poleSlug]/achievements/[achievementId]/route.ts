import { NextResponse } from "next/server"
import { z } from "zod"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { hasPoleApiAccess } from "@/helpers/pole-api-auth"

const poleSlugSchema = z.string().min(1)
const achievementIdSchema = z.string().min(1)

const imageUrlSchema = z
  .string()
  .min(1, "L’image est obligatoire.")
  .max(2048)
  .refine(
    (v) =>
      v.startsWith("http://") ||
      v.startsWith("https://") ||
      v.startsWith("/"),
    "URL d’image invalide.",
  )

const upsertSchema = z
  .object({
    title: z.string().min(2, "Le titre doit contenir au moins 2 caractères.").max(80),
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères.")
      .max(1200, "La description ne peut pas dépasser 1200 caractères."),
    imageUrl: imageUrlSchema,
    order: z.coerce.number().int("L’ordre doit être un entier.").min(0).default(0),
    isActive: z.coerce.boolean().default(true),
  })
  .strict()

function serializeRow(row: {
  id: string
  detailsPoleId: string
  title: string
  description: string
  imageUrl: string
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ poleSlug: string; achievementId: string }> },
): Promise<NextResponse> {
  const { poleSlug, achievementId } = await params
  const parsedSlug = poleSlugSchema.safeParse(poleSlug)
  if (!parsedSlug.success) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 400 })
  }

  if (!(await hasPoleApiAccess(parsedSlug.data))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const parsedId = achievementIdSchema.safeParse(achievementId)
  if (!parsedId.success) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 })
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
    const updated = await prisma.detailsPoleAchievement.update({
      where: { id: parsedId.data },
      data: {
        title: parsedInput.data.title,
        description: parsedInput.data.description,
        imageUrl: parsedInput.data.imageUrl.trim(),
        order: parsedInput.data.order,
        isActive: parsedInput.data.isActive,
      },
    })
    return NextResponse.json(serializeRow(updated))
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ poleSlug: string; achievementId: string }> },
): Promise<NextResponse> {
  const { poleSlug, achievementId } = await params
  const parsedSlug = poleSlugSchema.safeParse(poleSlug)
  if (!parsedSlug.success) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 400 })
  }

  if (!(await hasPoleApiAccess(parsedSlug.data))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const parsedId = achievementIdSchema.safeParse(achievementId)
  if (!parsedId.success) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 })
  }

  await prisma.detailsPoleAchievement.delete({ where: { id: parsedId.data } })
  return NextResponse.json({ success: true })
}

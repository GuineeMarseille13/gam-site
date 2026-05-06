import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"

const serviceIdSchema = z.string().min(1)

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

async function requireBureauApiAccess(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  return !!session && isBureauDashboardRole(session.user.role)
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
): Promise<NextResponse> {
  const hasAccess = await requireBureauApiAccess()
  if (!hasAccess) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const { serviceId } = await params
  const parsedId = serviceIdSchema.safeParse(serviceId)
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
    const updated = await prisma.detailsPoleService.update({
      where: { id: parsedId.data },
      data: {
        title: parsedInput.data.title,
        description: parsedInput.data.description,
        icon: parsedInput.data.icon ?? null,
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
  { params }: { params: Promise<{ serviceId: string }> },
): Promise<NextResponse> {
  const hasAccess = await requireBureauApiAccess()
  if (!hasAccess) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const { serviceId } = await params
  const parsedId = serviceIdSchema.safeParse(serviceId)
  if (!parsedId.success) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 })
  }

  await prisma.detailsPoleService.delete({ where: { id: parsedId.data } })
  return NextResponse.json({ success: true })
}


import { z } from "zod"

/**
 * Schéma: service public d’un pôle
 * Rôle: validation runtime des cartes "Nos services" affichées sur `/poles/[slug]`.
 */
export const detailsPoleServicePublicSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    icon: z.string().min(1),
  })
  .strict()

export type DetailsPoleServicePublic = z.infer<typeof detailsPoleServicePublicSchema>

export const detailsPoleServicePublicListSchema = detailsPoleServicePublicSchema.array()


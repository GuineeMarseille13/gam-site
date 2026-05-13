import { z } from "zod"

/**
 * Élément renvoyé par GET /api/association/team (membres bureau visibles sur le site).
 */
export const publicTeamMemberSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    role: z.string(),
    image: z.string(),
    order: z.number().int(),
    description: z
      .union([z.string(), z.null()])
      .optional()
      .transform((s) => {
        if (s == null) return undefined
        const t = s.trim()
        return t.length > 0 ? t : undefined
      }),
  })
  .strict()

export const publicTeamResponseSchema = z.array(publicTeamMemberSchema)

export type PublicTeamMember = z.infer<typeof publicTeamMemberSchema>

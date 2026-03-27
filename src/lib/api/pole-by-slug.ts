import { prisma } from '@/lib/prisma'

/**
 * Résout un paramètre d’URL `[slug]` vers un `Pôle` (id CUID ou nom insensible à la casse).
 */
export async function findPoleBySlugOrId(slug: string) {
  return prisma.pole.findFirst({
    where: {
      OR: [{ id: slug }, { name: { equals: slug, mode: 'insensitive' } }],
    },
  })
}

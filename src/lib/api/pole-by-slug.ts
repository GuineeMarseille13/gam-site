import { prisma } from '@/lib/prisma'

/**
 * Résout un paramètre d’URL `[slug]` vers un `Pôle` :
 * `public_slug` (site public / bureau), id CUID, ou nom insensible à la casse.
 */
export async function findPoleBySlugOrId(slug: string) {
  const byPublicSlug = await prisma.pole.findUnique({
    where: { publicSlug: slug },
  })
  if (byPublicSlug) {
    return byPublicSlug
  }

  return prisma.pole.findFirst({
    where: {
      OR: [{ id: slug }, { name: { equals: slug, mode: 'insensitive' } }],
    },
  })
}

import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter,
  })
}

type PrismaWithDelegates = PrismaClient & {
  permanenceAdminPresenceVolunteer?: { findMany: (...args: unknown[]) => unknown }
}

/**
 * En dev, le singleton global peut rester une ancienne instance après `prisma generate`
 * (HMR sans redémarrage) : les nouveaux modèles ne sont pas sur le client → délégués `undefined`.
 */
function getPrismaClient(): PrismaClient {
  const existing = globalForPrisma.prisma

  if (existing) {
    const hasPermanenceAdminPresenceVolunteer =
      typeof (existing as PrismaWithDelegates).permanenceAdminPresenceVolunteer?.findMany ===
      "function"
    if (hasPermanenceAdminPresenceVolunteer) {
      return existing
    }
    void existing.$disconnect().catch(() => {
      /* ignore */
    })
  }

  const client = createPrismaClient()
  globalForPrisma.prisma = client
  return client
}

const prisma = getPrismaClient()

export default prisma
export { prisma }

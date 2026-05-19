/**
 * Importe les `eventImages` statiques de `src/data/poles.ts` vers `details_pole_achievements`.
 *
 * Usage : npx tsx scripts/seed-pole-achievements.ts [publicSlug]
 * Exemple : npx tsx scripts/seed-pole-achievements.ts demarche-administrative
 */

import { PrismaClient } from "../src/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

import { poles } from "../src/data/poles"
import { findPoleBySlugOrId } from "../src/lib/api/pole-by-slug"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function run() {
  const publicSlug = process.argv[2] ?? "demarche-administrative"
  const staticPole = poles.find((p) => p.slug === publicSlug)

  if (!staticPole?.eventImages?.length) {
    console.error(`Aucune image statique pour le pôle « ${publicSlug} ».`)
    process.exit(1)
  }

  const pole = await findPoleBySlugOrId(publicSlug)
  if (!pole?.detailsPoleId) {
    console.error(`Pôle « ${publicSlug} » introuvable ou sans fiche détail en base.`)
    process.exit(1)
  }

  const existing = await prisma.detailsPoleAchievement.count({
    where: { detailsPoleId: pole.detailsPoleId },
  })

  if (existing > 0) {
    console.log(
      `Le pôle a déjà ${existing} réalisation(s) en base — import ignoré pour éviter les doublons.`,
    )
    process.exit(0)
  }

  for (const [index, image] of staticPole.eventImages.entries()) {
    await prisma.detailsPoleAchievement.create({
      data: {
        detailsPoleId: pole.detailsPoleId,
        title: image.title ?? `Réalisation ${index + 1}`,
        description: image.description ?? "",
        imageUrl: image.url,
        order: index,
        isActive: true,
      },
    })
    console.log(`✅ ${image.title ?? image.url}`)
  }

  console.log(`\n${staticPole.eventImages.length} réalisation(s) importée(s).`)
}

run()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

/**
 * Importe des réalisations historiques vers `details_pole_achievements`.
 *
 * Usage : npx tsx scripts/seed-pole-achievements.ts [publicSlug]
 * Exemple : npx tsx scripts/seed-pole-achievements.ts demarche-administrative
 */

import { PrismaClient } from "../src/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

import { findPoleBySlugOrId } from "../src/lib/api/pole-by-slug"

const LEGACY_ADMIN_ACHIEVEMENTS = [
  {
    url: "/images/events/admin/permanence-1.jpg",
    title: "Permanence Administrative",
    description:
      "Accueil et accompagnement personnalisé lors de nos permanences hebdomadaires",
  },
  {
    url: "/images/events/admin/atelier-info-1.jpg",
    title: "Atelier d'Information",
    description:
      "Session collective sur les démarches administratives et les droits des usagers",
  },
  {
    url: "/images/events/admin/accompagnement-1.jpg",
    title: "Accompagnement Personnalisé",
    description:
      "Soutien individuel pour la préparation et le suivi des dossiers administratifs",
  },
  {
    url: "/images/events/admin/formation-1.jpg",
    title: "Formation aux Démarches",
    description:
      "Atelier pratique pour apprendre à constituer ses dossiers en autonomie",
  },
  {
    url: "/images/events/admin/rencontre-1.jpg",
    title: "Rencontre avec les Bénévoles",
    description:
      "Échanges et partage d'expériences avec notre équipe de bénévoles dévoués",
  },
  {
    url: "/images/events/admin/success-1.jpg",
    title: "Célébration des Réussites",
    description:
      "Moments de joie partagés lors de l'aboutissement des démarches accompagnées",
  },
] as const

const LEGACY_ACHIEVEMENTS_BY_SLUG: Record<string, typeof LEGACY_ADMIN_ACHIEVEMENTS> = {
  "demarche-administrative": LEGACY_ADMIN_ACHIEVEMENTS,
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function run() {
  const publicSlug = process.argv[2] ?? "demarche-administrative"
  const staticImages = LEGACY_ACHIEVEMENTS_BY_SLUG[publicSlug]

  if (!staticImages?.length) {
    console.error(`Aucune image de seed pour le pôle « ${publicSlug} ».`)
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

  for (const [index, image] of staticImages.entries()) {
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
  }
}

run()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

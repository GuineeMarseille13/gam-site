/**
 * Script : Upload des images statiques des pôles vers Cloudinary
 * et mise à jour / création des pôles en base de données.
 *
 * Usage : npm run poles:upload
 */

import * as fs from 'fs'
import * as path from 'path'
import { PrismaClient } from '../src/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { uploadImage } from '../src/lib/cloudinary'
import { inferPolePublicSlugFromName } from '../src/lib/api/infer-pole-public-slug'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Correspondance : fichier image local → données du pôle
const POLES = [
  {
    file: 'e-pole.jpg',
    name: 'Événementiel',
    description:
      "Organisation d'événements culturels, festifs et caritatifs pour rassembler la communauté.",
  },
  {
    file: 'aa-pole.jpg',
    name: 'Démarche Administrative',
    description:
      'Accompagnement et assistance dans vos démarches administratives et vos formalités.',
  },
  {
    file: 'mr-pole.jpg',
    name: 'Hébergement et Mise en relation',
    description:
      'Facilitation des échanges et des connexions entre les membres de la communauté.',
  },
]

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')
const CLOUDINARY_FOLDER = 'gam/poles'

async function run() {
  console.log("🚀 Upload des images des pôles vers Cloudinary...\n")

  for (const pole of POLES) {
    const imagePath = path.join(IMAGES_DIR, pole.file)

    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️  Image introuvable : ${imagePath} — pôle ignoré`)
      continue
    }

    // 1. Upload vers Cloudinary
    console.log(`📤 Upload "${pole.file}"...`)
    const buffer = fs.readFileSync(imagePath)
    const result = await uploadImage(buffer, CLOUDINARY_FOLDER)
    const imageId = result.publicId
    console.log(`   ✅ imageId : ${imageId}`)

    // 2. Chercher un pôle existant (insensible à la casse)
    const existing = await prisma.pole.findFirst({
      where: { name: { equals: pole.name, mode: 'insensitive' } },
      select: { id: true, publicSlug: true },
    })

    const publicSlug = inferPolePublicSlugFromName(pole.name)

    if (existing) {
      await prisma.pole.update({
        where: { id: existing.id },
        data: {
          imageId,
          ...(publicSlug && !existing.publicSlug ? { publicSlug } : {}),
        },
      })
      console.log(`   🔄 Pôle "${pole.name}" mis à jour\n`)
    } else {
      const details = await prisma.detailsPole.create({
        data: { title: pole.name, description: pole.description },
      })
      await prisma.pole.create({
        data: {
          name: pole.name,
          description: pole.description,
          imageId,
          detailsPoleId: details.id,
          ...(publicSlug ? { publicSlug } : {}),
        },
      })
      console.log(`   ➕ Pôle "${pole.name}" créé\n`)
    }
  }

  console.log('✅ Terminé.')
  await prisma.$disconnect()
}

run().catch(async (err) => {
  console.error('❌ Erreur :', err)
  await prisma.$disconnect()
  process.exit(1)
})

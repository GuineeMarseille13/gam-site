/**
 * Seed script pour initialiser la base de données avec des données de test
 * 
 * Usage: npx tsx prisma/seed.ts
 * ou: npm run seed (si configuré dans package.json)
 */

import { PrismaClient, Section, Page } from '../src/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('🌱 Starting seed...')

  // Nettoyer la base de données (optionnel - commenter si vous voulez garder les données existantes)
  console.log('🧹 Cleaning database...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.memberShip.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.volunteer.deleteMany()
  await prisma.review.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.product.deleteMany()
  await prisma.event.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.pole.deleteMany()
  await prisma.reason.deleteMany()
  await prisma.aboutUs.deleteMany()
  await prisma.reportActivity.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.person.deleteMany()
  await prisma.address.deleteMany()
  await prisma.image.deleteMany()
  await prisma.video.deleteMany()
  await prisma.socialMedia.deleteMany()
  await prisma.detailsPole.deleteMany()

  // Supprimer les sections
  await prisma.teamMemberSection.deleteMany()
  await prisma.volunteerSection.deleteMany()
  await prisma.achievementSection.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.productSection.deleteMany()
  await prisma.reviewSection.deleteMany()
  await prisma.eventSection.deleteMany()
  await prisma.partnerSection.deleteMany()
  await prisma.poleSection.deleteMany()
  await prisma.welcomeSection.deleteMany()
  await prisma.reportActivitySection.deleteMany()
  await prisma.aboutUsSection.deleteMany()

  console.log('✅ Database cleaned')

  // ============================================
  // 1. ADDRESSES
  // ============================================
  console.log('📍 Creating addresses...')
  const address1 = await prisma.address.create({
    data: {
      address: '93 La Canebière',
      city: 'Marseille',
      country: 'France',
      zipCode: '13001',
      state: 'Provence-Alpes-Côte d\'Azur',
      countryCode: 'FR',
    },
  })

  const address2 = await prisma.address.create({
    data: {
      address: '15 Rue de la République',
      city: 'Marseille',
      country: 'France',
      zipCode: '13002',
      state: 'Provence-Alpes-Côte d\'Azur',
      countryCode: 'FR',
    },
  })

  // ============================================
  // 2. CONTACTS
  // ============================================
  console.log('📞 Creating contacts...')
  const contact = await prisma.contact.create({
    data: {
      phone: '+33 7 67 13 39 28',
      email: 'guineeamarseille13@gmail.com',
      address: '2 Boulevard Louis Frangin',
      city: 'Marseille',
      zipCode: '13005',
    },
  })

  // ============================================
  // 3. SOCIAL MEDIA
  // ============================================
  console.log('📱 Creating social media...')
  const socialMedias = await Promise.all([
    prisma.socialMedia.create({
      data: {
        name: 'Facebook',
        url: 'https://facebook.com/guineeamarseille',
        icon: 'facebook',
        order: 1,
      },
    }),
    prisma.socialMedia.create({
      data: {
        name: 'Instagram',
        url: 'https://instagram.com/guineeamarseille',
        icon: 'instagram',
        order: 2,
      },
    }),
    prisma.socialMedia.create({
      data: {
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/guineeamarseille',
        icon: 'linkedin',
        order: 3,
      },
    }),
  ])

  // ============================================
  // 4. SECTIONS
  // ============================================
  console.log('📑 Creating sections...')

  const welcomeSection = await prisma.welcomeSection.create({
    data: {
      title: 'Bienvenue à GAM',
      description: 'Section d\'accueil de l\'association',
    },
  })

  const poleSection = await prisma.poleSection.create({
    data: {
      title: 'Nos Pôles d\'Activité',
      description: 'Découvrez nos différents pôles',
    },
  })

  const partnerSection = await prisma.partnerSection.create({
    data: {
      title: 'Nos Partenaires',
      description: 'Partenaires de confiance',
    },
  })

  const eventSection = await prisma.eventSection.create({
    data: {
      title: 'Nos Événements',
      description: 'Événements organisés par GAM',
    },
  })

  const reviewSection = await prisma.reviewSection.create({
    data: {
      title: 'Témoignages',
      description: 'Avis de nos membres et partenaires',
    },
  })

  const productSection = await prisma.productSection.create({
    data: {
      title: 'Boutique GAM',
      description: 'Produits de l\'association',
    },
  })

  const productCategory = await prisma.productCategory.create({
    data: {
      title: 'Vêtements',
      description: 'Vêtements aux couleurs de GAM',
    },
  })

  const achievementSection = await prisma.achievementSection.create({
    data: {
      title: 'Nos Réalisations',
      description: 'Impact de GAM à Marseille',
    },
  })

  const volunteerSection = await prisma.volunteerSection.create({
    data: {
      title: 'Nos Bénévoles',
      description: 'Équipe de bénévoles dévoués',
    },
  })

  const teamMemberSection = await prisma.teamMemberSection.create({
    data: {
      title: 'Notre Équipe',
      description: 'Membres du bureau',
    },
  })

  const reportActivitySection = await prisma.reportActivitySection.create({
    data: {
      title: 'Rapports d\'Activité',
      description: 'Rapports annuels de l\'association',
    },
  })

  const aboutUsSection = await prisma.aboutUsSection.create({
    data: {
      title: 'À Propos de Nous',
      description: 'Présentation de l\'association',
    },
  })

  // ============================================
  // 5. REASONS (pour WelcomeSection)
  // ============================================
  console.log('💡 Creating reasons...')
  const reasons = await Promise.all([
    prisma.reason.create({
      data: {
        title: 'Solidarité',
        icon: '🤝',
        color: 'blue',
        order: 1,
        isActive: true,
        welcomeSectionId: welcomeSection.id,
      },
    }),
    prisma.reason.create({
      data: {
        title: 'Culture',
        icon: '🎭',
        color: 'green',
        order: 2,
        isActive: true,
        welcomeSectionId: welcomeSection.id,
      },
    }),
    prisma.reason.create({
      data: {
        title: 'Intégration',
        icon: '🌍',
        color: 'yellow',
        order: 3,
        isActive: true,
        welcomeSectionId: welcomeSection.id,
      },
    }),
  ])

  // ============================================
  // 6. DETAILS POLE
  // ============================================
  console.log('🏢 Creating pole details...')
  const detailsPole1 = await prisma.detailsPole.create({
    data: {
      title: 'Détails Pôle Événementiel',
      description: 'Informations détaillées sur le pôle événementiel',
      reason: 'Organisation d\'événements culturels',
      isActive: true,
    },
  })

  const detailsPole2 = await prisma.detailsPole.create({
    data: {
      title: 'Détails Pôle Administratif',
      description: 'Informations détaillées sur le pôle administratif',
      reason: 'Accompagnement dans les démarches',
      isActive: true,
    },
  })

  const detailsPole3 = await prisma.detailsPole.create({
    data: {
      title: 'Détails Pôle Mise en Relation',
      description: 'Informations détaillées sur le pôle mise en relation',
      reason: 'Facilitation des échanges',
      isActive: true,
    },
  })

  // ============================================
  // 7. POLES
  // ============================================
  console.log('🏛️ Creating poles...')
  const pole1 = await prisma.pole.create({
    data: {
      name: 'Événementiel',
      description: 'Organisation d\'événements culturels et festifs',
      poleSectionId: poleSection.id,
      detailsPoleId: detailsPole1.id,
    },
  })

  const pole2 = await prisma.pole.create({
    data: {
      name: 'Démarche Administrative',
      description: 'Accompagnement dans les démarches administratives',
      poleSectionId: poleSection.id,
      detailsPoleId: detailsPole2.id,
    },
  })

  const pole3 = await prisma.pole.create({
    data: {
      name: 'Mise en Relation',
      description: 'Facilitation des échanges et connexions',
      poleSectionId: poleSection.id,
      detailsPoleId: detailsPole3.id,
    },
  })

  // ============================================
  // 8. PARTNERS
  // ============================================
  console.log('🤝 Creating partners...')
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'Ville de Marseille',
        description: 'Partenariat avec la mairie de Marseille',
        url: 'https://marseille.fr',
        partnerSectionId: partnerSection.id,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Consulat de Guinée',
        description: 'Partenariat avec le consulat de Guinée',
        url: 'https://consulat-guinee.fr',
        partnerSectionId: partnerSection.id,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Association Solidarité',
        description: 'Partenariat avec une association locale',
        partnerSectionId: partnerSection.id,
      },
    }),
  ])

  // ============================================
  // 9. IMAGES
  // ============================================
  console.log('🖼️ Creating images...')
  const images = await Promise.all([
    prisma.image.create({
      data: {
        url: '/images/gam-logo.png',
        alt: 'Logo GAM',
        title: 'Logo de l\'association',
        page: Page.HOME,
        section: Section.CAROUSEL,
        order: 1,
        width: 800,
        height: 600,
        format: 'png',
        isActive: true,
      },
    }),
    prisma.image.create({
      data: {
        url: '/images/e-pole.jpg',
        alt: 'Pôle Événementiel',
        title: 'Pôle Événementiel',
        page: Page.HOME,
        section: Section.POLE,
        order: 1,
        width: 1200,
        height: 800,
        format: 'jpg',
        isActive: true,
        poleId: pole1.id,
      },
    }),
    prisma.image.create({
      data: {
        url: '/images/aa-pole.jpg',
        alt: 'Pôle Administratif',
        title: 'Pôle Administratif',
        page: Page.HOME,
        section: Section.POLE,
        order: 2,
        width: 1200,
        height: 800,
        format: 'jpg',
        isActive: true,
        poleId: pole2.id,
      },
    }),
    prisma.image.create({
      data: {
        url: '/images/mr-pole.jpg',
        alt: 'Pôle Mise en Relation',
        title: 'Pôle Mise en Relation',
        page: Page.HOME,
        section: Section.POLE,
        order: 3,
        width: 1200,
        height: 800,
        format: 'jpg',
        isActive: true,
        poleId: pole3.id,
      },
    }),
  ])

  // ============================================
  // 10. VIDEOS
  // ============================================
  console.log('🎥 Creating videos...')
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        url: '/videos/presentation-gam.mp4',
        title: 'Présentation de GAM',
        description: 'Vidéo de présentation de l\'association',
        thumbnail: '/images/video-thumbnail.jpg',
        page: Page.HOME,
        section: Section.PRESENTATION,
        order: 1,
        duration: 180,
        format: 'mp4',
        isActive: true,
        autoplay: false,
        loop: false,
        muted: true,
      },
    }),
  ])

  // ============================================
  // 11. EVENTS
  // ============================================
  console.log('📅 Creating events...')
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Soirée Culturelle Guinéenne',
        description: 'Une soirée exceptionnelle pour célébrer la richesse de la culture guinéenne',
        startDate: new Date('2024-03-15T19:00:00Z'),
        endDate: new Date('2024-03-15T23:00:00Z'),
        location: 'Marseille',
        eventSectionId: eventSection.id,
        imageId: images[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Journée d\'Intégration Étudiante',
        description: 'Accueil et accompagnement des nouveaux étudiants guinéens',
        startDate: new Date('2024-02-10T10:00:00Z'),
        endDate: new Date('2024-02-10T17:00:00Z'),
        location: 'Marseille',
        eventSectionId: eventSection.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Festival de la Solidarité',
        description: 'Grand événement rassemblant la communauté',
        startDate: new Date('2024-11-10T14:00:00Z'),
        endDate: new Date('2024-11-10T22:00:00Z'),
        location: 'Marseille',
        eventSectionId: eventSection.id,
      },
    }),
    // Événements 2026
    prisma.event.create({
      data: {
        title: 'Gala de Printemps GAM 2026',
        description: 'Soirée de gala annuelle de l\'association avec dîner, performances artistiques et remise de distinctions honorifiques.',
        startDate: new Date('2026-04-18T19:00:00Z'),
        endDate: new Date('2026-04-18T23:30:00Z'),
        location: 'Palais du Pharo, Marseille',
        eventSectionId: eventSection.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Journée de la Femme Guinéenne',
        description: 'Célébration et mise en valeur des femmes de la communauté guinéenne : témoignages, exposition et table ronde.',
        startDate: new Date('2026-03-08T10:00:00Z'),
        endDate: new Date('2026-03-08T18:00:00Z'),
        location: 'Maison de la Région, Marseille',
        eventSectionId: eventSection.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Tournoi Sportif Intercommunautaire',
        description: 'Tournoi de football et basketball réunissant plusieurs associations de la diaspora africaine à Marseille.',
        startDate: new Date('2026-06-14T09:00:00Z'),
        endDate: new Date('2026-06-14T18:00:00Z'),
        location: 'Stade Vallier, Marseille',
        eventSectionId: eventSection.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Forum de l\'Orientation et de l\'Emploi',
        description: 'Forum dédié à l\'insertion professionnelle des jeunes guinéens : ateliers CV, rencontres avec des employeurs et témoignages de parcours réussis.',
        startDate: new Date('2026-02-21T09:00:00Z'),
        endDate: new Date('2026-02-21T17:00:00Z'),
        location: 'CCI Marseille Provence',
        eventSectionId: eventSection.id,
      },
    }),
  ])

  // ============================================
  // 12. ACHIEVEMENTS
  // ============================================
  console.log('🏆 Creating achievements...')
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        label: 'Partenaires',
        value: 25,
        icon: '👥',
        color: 'blue',
        order: 1,
        isActive: true,
        achievementSectionId: achievementSection.id,
      },
    }),
    prisma.achievement.create({
      data: {
        label: 'Étudiants accompagnés',
        value: 245,
        icon: '🎓',
        color: 'red',
        order: 2,
        isActive: true,
        achievementSectionId: achievementSection.id,
      },
    }),
    prisma.achievement.create({
      data: {
        label: 'Mineurs non accompagnés aidés',
        value: 89,
        icon: '🤝',
        color: 'yellow',
        order: 3,
        isActive: true,
        achievementSectionId: achievementSection.id,
      },
    }),
    prisma.achievement.create({
      data: {
        label: 'Hébergements d\'urgence',
        value: 156,
        icon: '🏠',
        color: 'green',
        order: 4,
        isActive: true,
        achievementSectionId: achievementSection.id,
      },
    }),
    prisma.achievement.create({
      data: {
        label: 'Événements',
        value: 25,
        icon: '🎉',
        color: 'red',
        order: 5,
        isActive: true,
        achievementSectionId: achievementSection.id,
      },
    }),
  ])

  // ============================================
  // 13. PRODUCTS
  // ============================================
  console.log('🛍️ Creating products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: 'T-shirt GAM',
        description: 'T-shirt officiel de l\'association aux couleurs de la Guinée et de Marseille',
        price: 2000, // 20€ en centimes
        stock: 50,
        isActive: true,
        productSectionId: productSection.id,
        productCategoryId: productCategory.id,
        imageId: images[0].id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Sweat-shirt GAM',
        description: 'Sweat-shirt confortable avec logo GAM',
        price: 3500, // 35€ en centimes
        stock: 30,
        isActive: true,
        productSectionId: productSection.id,
        productCategoryId: productCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        title: 'Casquette GAM',
        description: 'Casquette aux couleurs de l\'association',
        price: 1500, // 15€ en centimes
        stock: 40,
        isActive: true,
        productSectionId: productSection.id,
        productCategoryId: productCategory.id,
      },
    }),
  ])

  // ============================================
  // 14. PERSONS
  // ============================================
  console.log('👥 Creating persons...')
  const persons = await Promise.all([
    prisma.person.create({
      data: {
        firstName: 'Moussa',
        lastName: 'CAMARA',
        email: 'moussa.camara@gam-marseille.fr',
        phone: '06-12-34-56-78',
        addressId: address1.id,
        roles: ['PRESIDENT'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Guillaume',
        lastName: 'MADEC',
        email: 'guillaume.madec@gam-marseille.fr',
        phone: '06-23-45-67-89',
        addressId: address1.id,
        roles: ['VICE_PRESIDENT'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Ibrahim',
        lastName: 'BAH',
        email: 'ibrahim.bah@gam-marseille.fr',
        phone: '06-34-56-78-90',
        addressId: address1.id,
        roles: ['VICE_PRESIDENT'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Michelle',
        lastName: 'DAO',
        email: 'michelle.dao@gam-marseille.fr',
        phone: '06-45-67-89-01',
        addressId: address1.id,
        roles: ['SECRETARY'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Mamadou Alpha',
        lastName: 'DIALLO',
        email: 'mamadou.diallo@gam-marseille.fr',
        phone: '06-56-78-90-12',
        addressId: address1.id,
        roles: ['SECRETARY'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Julie',
        lastName: 'DELABY',
        email: 'julie.delaby@gam-marseille.fr',
        phone: '06-67-89-01-23',
        addressId: address1.id,
        roles: ['TREASURER'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Aminata',
        lastName: 'FOFANA',
        email: 'aminata.fofana@gam-marseille.fr',
        phone: '06-78-90-12-34',
        addressId: address1.id,
        roles: ['TREASURER'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Fatoumata',
        lastName: 'DIALLO',
        email: 'fatoumata.diallo@example.com',
        phone: '06-89-01-23-45',
        addressId: address2.id,
        roles: ['MEMBER'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Amadou',
        lastName: 'CAMARA',
        email: 'amadou.camara@example.com',
        phone: '06-90-12-34-56',
        addressId: address2.id,
        roles: ['VOLUNTEER'],
      },
    }),
    prisma.person.create({
      data: {
        firstName: 'Aissatou',
        lastName: 'BAH',
        email: 'aissatou.bah@example.com',
        phone: '06-01-23-45-67',
        addressId: address2.id,
        roles: ['MEMBER'],
      },
    }),
  ])

  // ============================================
  // 15. TEAM MEMBERS
  // ============================================
  console.log('👔 Creating team members...')
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        personId: persons[0].id, // Moussa CAMARA
        description: 'Président et Fondateur de l\'association',
        order: 1,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
        imageId: images[0].id,
      },
    }),
    prisma.teamMember.create({
      data: {
        personId: persons[1].id, // Guillaume MADEC
        description: '1er vice-président',
        order: 2,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        personId: persons[2].id, // Ibrahim BAH
        description: '2e vice-président',
        order: 3,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        personId: persons[3].id, // Michelle DAO
        description: 'Secrétaire',
        order: 4,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        personId: persons[4].id, // Mamadou Alpha DIALLO
        description: 'Secrétaire adjoint',
        order: 5,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        personId: persons[5].id, // Julie DELABY
        description: 'Trésorière',
        order: 6,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        personId: persons[6].id, // Aminata FOFANA
        description: 'Trésorière adjointe',
        order: 7,
        isActive: true,
        teamMemberSectionId: teamMemberSection.id,
      },
    }),
  ])

  // ============================================
  // 16. VOLUNTEERS
  // ============================================
  console.log('🙋 Creating volunteers...')
  const volunteers = await Promise.all([
    prisma.volunteer.create({
      data: {
        personId: persons[8].id, // Amadou CAMARA
        isActive: true,
        volunteerSectionId: volunteerSection.id,
      },
    }),
    prisma.volunteer.create({
      data: {
        personId: persons[7].id, // Fatoumata DIALLO
        isActive: true,
        volunteerSectionId: volunteerSection.id,
      },
    }),
  ])

  // ============================================
  // 17. REVIEWS
  // ============================================
  console.log('⭐ Creating reviews...')
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        firstName: 'Fatoumata',
        lastName: 'Diallo',
        role: 'MEMBER',
        body: 'L\'association GAM m\'a permis de rencontrer une communauté chaleureuse et de participer à des actions solidaires qui ont du sens. Une expérience enrichissante !',
        avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
        country: '🇬🇳 Guinée',
        rating: 5,
        order: 1,
        isActive: true,
        isVerified: true,
        publishedAt: new Date(),
        reviewSectionId: reviewSection.id,
      },
    }),
    prisma.review.create({
      data: {
        firstName: 'Amadou',
        lastName: 'Camara',
        role: 'VOLUNTEER',
        body: 'Je suis fier de faire partie de cette association qui œuvre pour le développement culturel et social. Les événements organisés sont toujours de qualité.',
        avatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
        country: '🇬🇳 Guinée',
        rating: 5,
        order: 2,
        isActive: true,
        isVerified: true,
        publishedAt: new Date(),
        reviewSectionId: reviewSection.id,
      },
    }),
    prisma.review.create({
      data: {
        firstName: 'Aissatou',
        lastName: 'Bah',
        role: 'MEMBER',
        body: 'Grâce à GAM, j\'ai découvert ma culture sous un nouveau jour. Les activités sont variées et accessibles à tous. Je recommande vivement !',
        avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        country: '🇫🇷 France',
        rating: 5,
        order: 3,
        isActive: true,
        isVerified: true,
        publishedAt: new Date(),
        reviewSectionId: reviewSection.id,
      },
    }),
    prisma.review.create({
      data: {
        firstName: 'Moussa',
        lastName: 'Traoré',
        role: 'MEMBER',
        body: 'Une association transparente et efficace. Je vois concrètement l\'impact de mes dons dans les actions menées. Continuez ainsi !',
        avatarUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
        country: '🇬🇳 Guinée',
        rating: 5,
        order: 4,
        isActive: true,
        isVerified: true,
        publishedAt: new Date(),
        reviewSectionId: reviewSection.id,
      },
    }),
  ])

  // ============================================
  // 18. MEMBERSHIPS
  // ============================================
  console.log('💳 Creating memberships...')
  const membership1 = await prisma.memberShip.create({
    data: {
      title: 'Adhésion Annuelle 2024',
      description: 'Adhésion annuelle à l\'association GAM',
      amount: 2000,
      year: 2024,
      isActive: true,
      person: { connect: { id: persons[7].id } },
      payment: {
        create: {
          paymentReference: 'pi_seed_membership_001',
          amount: 2000,
          status: 'PAID',
          type: 'adhesion',
          paymentMethod: 'card',
          person: { connect: { id: persons[7].id } },
        },
      },
    },
  })

  const membership2 = await prisma.memberShip.create({
    data: {
      title: 'Adhésion Annuelle 2024',
      description: 'Adhésion annuelle à l\'association GAM',
      amount: 2000,
      year: 2024,
      isActive: true,
      person: { connect: { id: persons[8].id } },
      payment: {
        create: {
          paymentReference: 'pi_seed_membership_002',
          amount: 2000,
          status: 'PAID',
          type: 'adhesion',
          paymentMethod: 'card',
          person: { connect: { id: persons[8].id } },
        },
      },
    },
  })

  // ============================================
  // 19. DONATIONS
  // ============================================
  console.log('💰 Creating donations...')
  const donation1 = await prisma.donation.create({
    data: {
      title: 'Don pour les projets',
      message: 'Soutien aux projets de l\'association',
      amount: 5000,
      person: { connect: { id: persons[9].id } },
      payment: {
        create: {
          paymentReference: 'pi_seed_donation_001',
          amount: 5000,
          status: 'PAID',
          type: 'donation',
          paymentMethod: 'card',
          person: { connect: { id: persons[9].id } },
        },
      },
    },
  })

  // ============================================
  // 20. ORDERS
  // ============================================
  console.log('🛒 Creating orders...')
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'CMD-2024-001',
      totalAmount: 3500,
      person: { connect: { id: persons[7].id } },
      payment: {
        create: {
          paymentReference: 'pi_seed_order_001',
          amount: 3500,
          status: 'PAID',
          type: 'order',
          paymentMethod: 'card',
          person: { connect: { id: persons[7].id } },
        },
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'CMD-2024-002',
      totalAmount: 5500,
      person: { connect: { id: persons[8].id } },
      payment: {
        create: {
          paymentReference: 'pi_seed_order_002',
          amount: 5500,
          status: 'PAID',
          type: 'order',
          paymentMethod: 'card',
          person: { connect: { id: persons[8].id } },
        },
      },
    },
  })

  // ============================================
  // 21. ORDER ITEMS
  // ============================================
  console.log('📦 Creating order items...')
  const orderItems = await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: products[0].id, // T-shirt
        quantity: 1,
        price: 2000,
        subtotal: 2000,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: products[2].id, // Casquette
        quantity: 1,
        price: 1500,
        subtotal: 1500,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: products[1].id, // Sweat-shirt
        quantity: 1,
        price: 3500,
        subtotal: 3500,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: products[0].id, // T-shirt
        quantity: 1,
        price: 2000,
        subtotal: 2000,
      },
    }),
  ])

  // ============================================
  // 22. REPORT ACTIVITIES
  // ============================================
  console.log('📊 Creating report activities...')
  const reportActivities = await Promise.all([
    prisma.reportActivity.create({
      data: {
        label: 'Rapport d\'activités 2024',
        year: 2024,
        pdfUrl: '/reports/rapport-activites-2024.pdf',
        reportActivitySectionId: reportActivitySection.id,
      },
    }),
    prisma.reportActivity.create({
      data: {
        label: 'Rapport d\'activités 2023',
        year: 2023,
        pdfUrl: '/reports/rapport-activites-2023.pdf',
        reportActivitySectionId: reportActivitySection.id,
      },
    }),
  ])

  // ============================================
  // 23. ABOUT US
  // ============================================
  console.log('ℹ️ Creating about us...')
  const aboutUsItems = await Promise.all([
    prisma.aboutUs.create({
      data: {
        title: 'Qui sommes-nous ?',
        description: 'L\'association Guinée à Marseille (GAM) est née d\'une observation simple mais essentielle : de nombreux jeunes Guinéens et Africains arrivent à Marseille sans orientation ni accompagnement.',
        aboutUsSectionId: aboutUsSection.id,
        imageId: images[0].id,
      },
    }),
    prisma.aboutUs.create({
      data: {
        title: 'Que propose l\'association ?',
        description: 'GAM propose un projet ambitieux et complet qui s\'articule autour de plusieurs axes majeurs : organisation d\'activités sportives et culturelles, création d\'un réseau solide, aide aux personnes en difficulté, etc.',
        aboutUsSectionId: aboutUsSection.id,
      },
    }),
  ])

  console.log('✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  - Addresses: ${await prisma.address.count()}`)
  console.log(`  - Contacts: ${await prisma.contact.count()}`)
  console.log(`  - Social Media: ${await prisma.socialMedia.count()}`)
  console.log(`  - Sections: ${await prisma.welcomeSection.count() + await prisma.poleSection.count() + await prisma.partnerSection.count() + await prisma.eventSection.count() + await prisma.reviewSection.count() + await prisma.productSection.count() + await prisma.achievementSection.count() + await prisma.volunteerSection.count() + await prisma.teamMemberSection.count() + await prisma.reportActivitySection.count() + await prisma.aboutUsSection.count()}`)
  console.log(`  - Reasons: ${await prisma.reason.count()}`)
  console.log(`  - Poles: ${await prisma.pole.count()}`)
  console.log(`  - Partners: ${await prisma.partner.count()}`)
  console.log(`  - Images: ${await prisma.image.count()}`)
  console.log(`  - Videos: ${await prisma.video.count()}`)
  console.log(`  - Events: ${await prisma.event.count()}`)
  console.log(`  - Achievements: ${await prisma.achievement.count()}`)
  console.log(`  - Products: ${await prisma.product.count()}`)
  console.log(`  - Persons: ${await prisma.person.count()}`)
  console.log(`  - Team Members: ${await prisma.teamMember.count()}`)
  console.log(`  - Volunteers: ${await prisma.volunteer.count()}`)
  console.log(`  - Reviews: ${await prisma.review.count()}`)
  console.log(`  - Memberships: ${await prisma.memberShip.count()}`)
  console.log(`  - Donations: ${await prisma.donation.count()}`)
  console.log(`  - Orders: ${await prisma.order.count()}`)
  console.log(`  - Order Items: ${await prisma.orderItem.count()}`)
  console.log(`  - Report Activities: ${await prisma.reportActivity.count()}`)
  console.log(`  - About Us: ${await prisma.aboutUs.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


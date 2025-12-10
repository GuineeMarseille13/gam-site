import { PrismaClient, ReviewRating, StatisticColor, EventMediaType } from '../src/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

async function main() {
  console.log('🌱 Début du seed de la base de données...\n');

  // ============================================================================
  // CARROUSEL
  // ============================================================================
  console.log('📸 Création des éléments du carrousel...');
  const carouselItems = await Promise.all([
    prisma.carouselItem.upsert({
      where: { id: 'carousel-1' },
      update: {},
      create: {
        id: 'carousel-1',
        image: 'https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg',
        title: 'Association GAM',
        description: 'Découvrez notre association et nos actions en faveur de la communauté',
        order: 0,
        isActive: true,
      },
    }),
    prisma.carouselItem.upsert({
      where: { id: 'carousel-2' },
      update: {},
      create: {
        id: 'carousel-2',
        image: 'https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg',
        title: 'Nos Événements',
        description: 'Participez à nos événements culturels et caritatifs',
        order: 1,
        isActive: true,
      },
    }),
    prisma.carouselItem.upsert({
      where: { id: 'carousel-3' },
      update: {},
      create: {
        id: 'carousel-3',
        image: 'https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg',
        title: 'Adhésion',
        description: 'Rejoignez-nous pour contribuer à nos missions',
        order: 2,
        isActive: true,
      },
    }),
    prisma.carouselItem.upsert({
      where: { id: 'carousel-4' },
      update: {},
      create: {
        id: 'carousel-4',
        image: 'https://cdn.pixabay.com/photo/2025/07/05/02/55/together-9697018_1280.png',
        title: 'Solidarité',
        description: 'Ensemble pour une communauté plus forte',
        order: 3,
        isActive: true,
      },
    }),
    prisma.carouselItem.upsert({
      where: { id: 'carousel-5' },
      update: {},
      create: {
        id: 'carousel-5',
        image: 'https://cdn.pixabay.com/photo/2025/07/20/13/12/little-red-riding-hood-9724469_1280.jpg',
        title: 'Culture',
        description: 'Célébrons la richesse de notre culture',
        order: 4,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${carouselItems.length} éléments de carrousel créés\n`);

  // ============================================================================
  // PARTENAIRES
  // ============================================================================
  console.log('🤝 Création des partenaires...');
  const partners = await Promise.all([
    prisma.partner.upsert({
      where: { id: 'partner-1' },
      update: {},
      create: {
        id: 'partner-1',
        name: 'Partenaire 1',
        logo: 'https://picsum.photos/300/200?random=1',
        description: 'Description du partenaire 1',
        website: 'https://www.partenaire1.com',
        category: 'Catégorie 1',
        order: 0,
        isActive: true,
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-2' },
      update: {},
      create: {
        id: 'partner-2',
        name: 'Partenaire 2',
        logo: 'https://picsum.photos/300/200?random=2',
        description: 'Description du partenaire 2',
        website: 'https://www.partenaire2.com',
        category: 'Catégorie 2',
        order: 1,
        isActive: true,
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-3' },
      update: {},
      create: {
        id: 'partner-3',
        name: 'Partenaire 3',
        logo: 'https://picsum.photos/300/200?random=3',
        description: 'Description du partenaire 3',
        website: 'https://www.partenaire3.com',
        category: 'Catégorie 3',
        order: 2,
        isActive: true,
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-4' },
      update: {},
      create: {
        id: 'partner-4',
        name: 'Partenaire 4',
        logo: 'https://picsum.photos/300/200?random=4',
        description: 'Description du partenaire 4',
        website: 'https://www.partenaire4.com',
        category: 'Catégorie 4',
        order: 3,
        isActive: true,
      },
    }),
    prisma.partner.upsert({
      where: { id: 'partner-5' },
      update: {},
      create: {
        id: 'partner-5',
        name: 'Partenaire 5',
        logo: 'https://picsum.photos/300/200?random=5',
        description: 'Description du partenaire 5',
        website: 'https://www.partenaire5.com',
        category: 'Catégorie 5',
        order: 4,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${partners.length} partenaires créés\n`);

  // ============================================================================
  // ÉVÉNEMENTS
  // ============================================================================
  console.log('🎉 Création des événements...');
  
  // Vérifier si des événements existent déjà
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    const events = await Promise.all([
      prisma.event.create({
        data: {
          title: 'Soirée Culturelle Guinéenne',
          description: 'Une soirée exceptionnelle pour célébrer la richesse de la culture guinéenne avec des danses traditionnelles, des dégustations culinaires et des performances artistiques.',
          date: new Date('2024-03-15'),
          year: 2024,
          location: 'Marseille',
          isPublished: true,
          media: {
            create: {
              type: EventMediaType.image,
              url: 'https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg',
              order: 0,
            },
          },
        },
      }),
      prisma.event.create({
        data: {
          title: "Journée d'Intégration Étudiante",
          description: "Accueil et accompagnement des nouveaux étudiants guinéens avec des ateliers d'information, des rencontres et un réseau de soutien.",
          date: new Date('2024-02-10'),
          year: 2024,
          location: 'Marseille',
          isPublished: true,
          media: {
            create: {
              type: 'image',
              url: 'https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg',
              order: 0,
            },
          },
        },
      }),
      prisma.event.create({
        data: {
          title: 'Collecte de Fonds Solidaire',
          description: "Organisation d'une collecte de fonds pour soutenir des projets communautaires et des actions solidaires en Guinée et à Marseille.",
          date: new Date('2024-01-05'),
          year: 2024,
          location: 'Marseille',
          isPublished: true,
          media: {
            create: {
              type: 'image',
              url: 'https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg',
              order: 0,
            },
          },
        },
      }),
      prisma.event.create({
        data: {
          title: "Atelier d'Aide Administrative",
          description: "Séance d'accompagnement pour les démarches administratives, renouvellement de titres de séjour, inscriptions et autres formalités.",
          date: new Date('2023-12-20'),
          year: 2023,
          location: 'Marseille',
          isPublished: true,
          media: {
            create: {
              type: 'image',
              url: 'https://cdn.pixabay.com/photo/2025/07/05/02/55/together-9697018_1280.png',
              order: 0,
            },
          },
        },
      }),
      prisma.event.create({
        data: {
          title: 'Festival de la Solidarité',
          description: 'Grand événement rassemblant la communauté autour de stands, animations, concerts et partage de moments conviviaux.',
          date: new Date('2023-11-10'),
          year: 2023,
          location: 'Marseille',
          isPublished: true,
          media: {
            create: {
              type: 'image',
              url: 'https://cdn.pixabay.com/photo/2025/07/20/13/12/little-red-riding-hood-9724469_1280.jpg',
              order: 0,
            },
          },
        },
      }),
    ]);
    console.log(`✅ ${events.length} événements créés\n`);
  } else {
    console.log(`⏭️  ${existingEvents} événements existent déjà, passage...\n`);
  }

  // ============================================================================
  // TÉMOIGNAGES
  // ============================================================================
  console.log('💬 Création des témoignages...');
  
  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    const reviews = await Promise.all([
      prisma.review.create({
      data: {
        name: 'Fatoumata Diallo',
        role: 'Membre active',
        body: "L'association GAM m'a permis de rencontrer une communauté chaleureuse et de participer à des actions solidaires qui ont du sens. Une expérience enrichissante !",
        img: 'https://randomuser.me/api/portraits/women/32.jpg',
        country: '🇬🇳 Guinée',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Amadou Camara',
        role: 'Bénévole',
        body: "Je suis fier de faire partie de cette association qui œuvre pour le développement culturel et social. Les événements organisés sont toujours de qualité.",
        img: 'https://randomuser.me/api/portraits/men/51.jpg',
        country: '🇬🇳 Guinée',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Aissatou Bah',
        role: 'Participante',
        body: "Grâce à GAM, j'ai découvert ma culture sous un nouveau jour. Les activités sont variées et accessibles à tous. Je recommande vivement !",
        img: 'https://randomuser.me/api/portraits/women/68.jpg',
        country: '🇫🇷 France',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Moussa Traoré',
        role: 'Donateur',
        body: "Une association transparente et efficace. Je vois concrètement l'impact de mes dons dans les actions menées. Continuez ainsi !",
        img: 'https://randomuser.me/api/portraits/men/33.jpg',
        country: '🇬🇳 Guinée',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Mariama Sow',
        role: 'Membre fondatrice',
        body: 'GAM représente tout ce en quoi je crois : solidarité, culture et partage. C\'est un honneur de voir l\'association grandir et toucher de plus en plus de personnes.',
        img: 'https://randomuser.me/api/portraits/women/53.jpg',
        country: '🇬🇳 Guinée',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Ibrahima Barry',
        role: 'Bénévole',
        body: "L'engagement de l'équipe est remarquable. Chaque événement est préparé avec soin et l'accueil est toujours chaleureux. Bravo à toute l'équipe !",
        img: 'https://randomuser.me/api/portraits/men/22.jpg',
        country: '🇫🇷 France',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Kadiatou Diallo',
        role: 'Participante',
        body: "J'ai participé à plusieurs ateliers et événements. L'ambiance est conviviale et les organisateurs sont à l'écoute. Une belle expérience humaine !",
        img: 'https://randomuser.me/api/portraits/women/45.jpg',
        country: '🇬🇳 Guinée',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Ousmane Keita',
        role: 'Partenaire',
        body: 'Travailler avec GAM est un plaisir. Leur professionnalisme et leur engagement sont exemplaires. Une association qui mérite tout notre soutien.',
        img: 'https://randomuser.me/api/portraits/men/61.jpg',
        country: '🇫🇷 France',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
      prisma.review.create({
      data: {
        name: 'Aminata Touré',
        role: 'Membre',
        body: "Rejoindre GAM a été l'une des meilleures décisions. J'ai rencontré des personnes formidables et contribué à des projets qui me tiennent à cœur.",
        img: 'https://randomuser.me/api/portraits/women/85.jpg',
        country: '🇬🇳 Guinée',
        rating: ReviewRating.FIVE,
        isPublished: true,
        isFeatured: true,
      },
      }),
    ]);
    console.log(`✅ ${reviews.length} témoignages créés\n`);
  } else {
    console.log(`⏭️  ${existingReviews} témoignages existent déjà, passage...\n`);
  }

  // ============================================================================
  // STATISTIQUES
  // ============================================================================
  console.log('📊 Création des statistiques...');
  
  const existingStatistics = await prisma.statistic.count();
  if (existingStatistics === 0) {
    const statistics = await Promise.all([
      prisma.statistic.create({
      data: {
        label: 'Partenaires',
        value: 25,
        color: StatisticColor.blue,
        icon: '👥',
        order: 0,
        isActive: true,
      },
      }),
      prisma.statistic.create({
      data: {
        label: 'Projets',
        value: 25,
        color: StatisticColor.blue,
        icon: '💡',
        order: 1,
        isActive: true,
      },
      }),
      prisma.statistic.create({
      data: {
        label: 'Étudiants accompagnés',
        value: 245,
        color: StatisticColor.red,
        icon: '🎓',
        order: 2,
        isActive: true,
      },
      }),
      prisma.statistic.create({
      data: {
        label: "Mineurs non accompagnés aidés",
        value: 89,
        color: StatisticColor.yellow,
        icon: '🤝',
        order: 3,
        isActive: true,
      },
      }),
      prisma.statistic.create({
      data: {
        label: "Hébergements d'urgence",
        value: 156,
        color: StatisticColor.green,
        icon: '🏠',
        order: 4,
        isActive: true,
      },
      }),
      prisma.statistic.create({
      data: {
        label: 'Évènements',
        value: 25,
        color: StatisticColor.red,
        icon: '🎉',
        order: 5,
        isActive: true,
      },
      }),
    ]);
    console.log(`✅ ${statistics.length} statistiques créées\n`);
  } else {
    console.log(`⏭️  ${existingStatistics} statistiques existent déjà, passage...\n`);
  }

  // ============================================================================
  // BÉNÉVOLES
  // ============================================================================
  console.log('👥 Création des bénévoles...');
  
  const existingVolunteers = await prisma.volunteer.count();
  if (existingVolunteers === 0) {
    const volunteers = await Promise.all([
      prisma.volunteer.create({
      data: {
        name: 'Marie Dubois',
        image: 'https://randomuser.me/api/portraits/women/12.jpg',
        role: 'Coordinatrice',
        initials: 'MD',
        order: 0,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Pierre Martin',
        image: 'https://randomuser.me/api/portraits/men/15.jpg',
        role: 'Trésorier',
        initials: 'PM',
        order: 1,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Aminata Traoré',
        image: 'https://randomuser.me/api/portraits/women/25.jpg',
        role: 'Secrétaire',
        initials: 'AT',
        order: 2,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Jean-Luc Dupont',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Bénévole',
        initials: 'JD',
        order: 3,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Fatou Sow',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Bénévole',
        initials: 'FS',
        order: 4,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Ahmed Camara',
        image: 'https://randomuser.me/api/portraits/men/28.jpg',
        role: 'Bénévole',
        initials: 'AC',
        order: 5,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Sophie Leroy',
        image: 'https://randomuser.me/api/portraits/women/31.jpg',
        role: 'Bénévole',
        initials: 'SL',
        order: 6,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Mamadou Diallo',
        image: 'https://randomuser.me/api/portraits/men/42.jpg',
        role: 'Bénévole',
        initials: 'MD',
        order: 7,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Isabelle Laurent',
        image: 'https://randomuser.me/api/portraits/women/18.jpg',
        role: 'Bénévole',
        initials: 'IL',
        order: 8,
        isActive: true,
      },
      }),
      prisma.volunteer.create({
      data: {
        name: 'Ousmane Kaba',
        image: 'https://randomuser.me/api/portraits/men/55.jpg',
        role: 'Bénévole',
        initials: 'OK',
        order: 9,
        isActive: true,
      },
      }),
    ]);
    console.log(`✅ ${volunteers.length} bénévoles créés\n`);
  } else {
    console.log(`⏭️  ${existingVolunteers} bénévoles existent déjà, passage...\n`);
  }

  // ============================================================================
  // PRODUITS
  // ============================================================================
  console.log('🛍️ Création des produits...');
  
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    const products = await Promise.all([
      prisma.product.create({
      data: {
        name: 'T-shirt GAM — Classique',
        image: '/images/gam-logo.png',
        description: 'T-shirt coton avec logo de l\'association.',
        price: 20,
        category: 'Textile',
        inStock: true,
        featured: true,
        stockQuantity: 50,
        sku: 'TSHIRT-CLASSIC',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Mug Solidarité',
        image: '/images/gam-logo.png',
        description: 'Mug en céramique, soutien aux actions.',
        price: 12,
        originalPrice: 14,
        discount: 10,
        category: 'Goodies',
        inStock: true,
        stockQuantity: 30,
        sku: 'MUG-SOLIDARITY',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Tote bag éco-responsable',
        image: '/images/gam-logo.png',
        description: 'Sac réutilisable en coton bio.',
        price: 8,
        category: 'Accessoires',
        inStock: true,
        stockQuantity: 40,
        sku: 'BAG-TOTE',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Hoodie GAM — Premium',
        image: '/images/aa-pole.jpg',
        description: 'Sweat à capuche épais, idéal pour l\'hiver.',
        price: 38,
        originalPrice: 45,
        discount: 15,
        category: 'Textile',
        inStock: true,
        stockQuantity: 25,
        sku: 'HOODIE-PREMIUM',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Casquette GAM',
        image: '/images/mr-pole.jpg',
        description: 'Casquette réglable, broderie fine.',
        price: 16,
        category: 'Accessoires',
        inStock: true,
        stockQuantity: 35,
        sku: 'CAP-CLASSIC',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Pack d\'autocollants (x6)',
        image: '/images/gam-logo.png',
        description: 'Autocollants vinyles résistants à l\'eau.',
        price: 5,
        category: 'Goodies',
        inStock: true,
        stockQuantity: 100,
        sku: 'STICKER-PACK',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Carnet de notes A5',
        image: '/images/e-pole.jpg',
        description: 'Carnet 80 pages, papier recyclé.',
        price: 9,
        category: 'Papeterie',
        inStock: true,
        stockQuantity: 45,
        sku: 'NOTEBOOK-A5',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Gourde inox 500ml',
        image: '/images/gam-logo.png',
        description: 'Isotherme, sans BPA, réutilisable.',
        price: 22,
        category: 'Goodies',
        inStock: true,
        featured: true,
        stockQuantity: 20,
        sku: 'BOTTLE-STEEL',
        isActive: true,
      },
      }),
      prisma.product.create({
      data: {
        name: 'Pin\'s émaillé GAM',
        image: '/images/gam-logo.png',
        description: 'Petit pin\'s à accrocher, finition dorée.',
        price: 4,
        category: 'Goodies',
        inStock: true,
        stockQuantity: 150,
        sku: 'PIN-BADGE',
        isActive: true,
      },
      }),
    ]);
    console.log(`✅ ${products.length} produits créés\n`);
  } else {
    console.log(`⏭️  ${existingProducts} produits existent déjà, passage...\n`);
  }

  console.log('✨ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


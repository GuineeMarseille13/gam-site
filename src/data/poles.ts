export interface Pole {
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  description: string;
  features: string[];
  services: {
    title: string;
    description: string;
    icon: string;
  }[];
  contactInfo?: {
    email?: string;
    phone?: string;
    schedule?: string;
    address?: string;
  };
  permanenceDates?: string[]; // Format: "YYYY-MM-DD"
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const poles: Pole[] = [
  {
    slug: "evenementiel",
    title: "ÉVÉNEMENTIEL",
    shortDescription:
      "Organisation d'événements culturels, festifs et caritatifs pour rassembler la communauté.",
    image: "/images/e-pole.jpg",
    description: `Le pôle Événementiel de l'association GAM est au cœur de notre mission de rassemblement et de valorisation de la culture guinéenne à Marseille. Nous organisons régulièrement des événements qui créent des liens, célèbrent notre héritage culturel et renforcent la solidarité au sein de notre communauté.`,
    features: [
      "Organisation de soirées culturelles et festives",
      "Événements caritatifs et solidaires",
      "Célébrations des fêtes traditionnelles guinéennes",
      "Concerts et spectacles de musique traditionnelle",
      "Ateliers culinaires et dégustations",
      "Festivals et journées thématiques",
    ],
    services: [
      {
        title: "Soirées Culturelles",
        description:
          "Des soirées inoubliables pour découvrir et partager la richesse de la culture guinéenne à travers la danse, la musique et les traditions.",
        icon: "🎭",
      },
      {
        title: "Événements Caritatifs",
        description:
          "Organisation de collectes de fonds et d'événements solidaires pour soutenir des projets communautaires en Guinée et à Marseille.",
        icon: "❤️",
      },
      {
        title: "Festivals & Célébrations",
        description:
          "Grands événements rassemblant la communauté autour de moments festifs, de partage et de convivialité.",
        icon: "🎉",
      },
      {
        title: "Ateliers & Découvertes",
        description:
          "Des ateliers culinaires, artistiques et culturels pour tous les âges, permettant de découvrir et transmettre nos traditions.",
        icon: "🎨",
      },
    ],
    contactInfo: {
      email: "evenementiel@gam-marseille.fr",
      schedule: "Réunions chaque premier samedi du mois à 14h",
    },
    colorScheme: {
      primary: "from-blue-400 to-indigo-500",
      secondary: "from-indigo-400 to-purple-500",
      accent: "blue",
    },
  },
  {
    slug: "demarche-administrative",
    title: "DÉMARCHE ADMINISTRATIVE",
    shortDescription:
      "Accompagnement et assistance dans vos démarches administratives et vos formalités.",
    image: "/images/aa-pole.jpg",
    description: `Le pôle Démarche Administrative de GAM offre un accompagnement personnalisé et professionnel pour vous aider dans toutes vos formalités administratives en France. Notre équipe de bénévoles expérimentés et formés vous guide dans les démarches complexes liées à l'immigration, l'intégration, le logement, l'emploi et l'éducation. Nous comprenons les défis que vous pouvez rencontrer et nous nous engageons à vous fournir un soutien complet, de la préparation de vos dossiers jusqu'au suivi de vos démarches. Notre objectif est de rendre ces processus plus accessibles et moins stressants, en vous donnant les outils et les informations nécessaires pour réussir votre intégration.`,
    features: [
      "Conseil juridique, information et orientation",
      "Demande de carte consulaire, légalisation de document",
      "Explication en langue peulh, soussou et malinke",
      "Contact pour faire venir des documents de Guinée",
      "Aide au renouvellement et à l'obtention de titres de séjour",
      "Assistance complète pour les demandes de naturalisation française",
      "Accompagnement dans toutes les démarches de logement (APL, HLM, etc.)",
      "Soutien pour les inscriptions scolaires, universitaires et formations",
      "Aide à la recherche d'emploi, rédaction de CV et lettres de motivation",
      "Aide à la constitution de dossiers administratifs",
      "Traduction et interprétariat pour faciliter vos démarches",
    ],
    services: [
      {
        title: "Accompagnement Personnalisé",
        description:
          "Un bénévole dédié vous accompagne dans toutes vos démarches administratives avec un suivi personnalisé et adapté à votre situation. Nous vous aidons à comprendre les procédures, à préparer vos dossiers et à suivre l'avancement de vos démarches jusqu'à leur aboutissement.",
        icon: "🤝",
      },
      {
        title: "Permanences Régulières",
        description:
          "Des permanences hebdomadaires gratuites pour répondre à toutes vos questions et vous aider dans vos démarches urgentes. Nos bénévoles sont disponibles pour vous recevoir, analyser votre situation et vous orienter vers les solutions adaptées.",
        icon: "📅",
      },
      {
        title: "Ateliers d'Information",
        description:
          "Des sessions d'information collectives régulières sur vos droits, les démarches administratives, les ressources disponibles et les changements législatifs. Ces ateliers vous permettent d'acquérir les connaissances nécessaires pour être autonome dans vos démarches.",
        icon: "📚",
      },
      {
        title: "Réseau de Partenaires",
        description:
          "Mise en relation avec des professionnels qualifiés (avocats spécialisés en droit des étrangers, assistants sociaux, conseillers en insertion professionnelle) pour des conseils spécialisés et un accompagnement renforcé lorsque nécessaire.",
        icon: "🔗",
      },
      {
        title: "Aide à la Rédaction",
        description:
          "Assistance pour la rédaction de courriers administratifs, de demandes officielles, de lettres de motivation et de CV. Nous vous aidons à formuler vos demandes de manière claire et professionnelle.",
        icon: "✍️",
      },
      {
        title: "Suivi de Dossiers",
        description:
          "Accompagnement dans le suivi de vos dossiers administratifs, avec rappels des échéances importantes, aide à la préparation des rendez-vous et soutien dans les démarches de recours si nécessaire.",
        icon: "📋",
      },
    ],
    contactInfo: {
      email: "guineeamarseille13@gmail.com",
      phone: "07-67-13-39-28",
      schedule: "Permanences les samedis de 14h à 16h",
      address: "93 La Canebière, 13001 Marseille",
    },
    permanenceDates: [
      // Janvier 2025
      "2025-01-11",
      "2025-01-25",
      // Février 2025
      "2025-02-15",
      // Mars 2025
      "2025-03-01",
      "2025-03-15",
      "2025-03-29",
      // Avril 2025
      "2025-04-12",
      "2025-04-26",
      // Mai 2025
      "2025-05-10",
      "2025-05-24",
      // Juin 2025
      "2025-06-07",
      "2025-06-21",
      // Juillet 2025
      "2025-07-05",
      "2025-07-18", // Vendredi (changement d'horaire)
      // Août 2025
      "2025-08-01", // Vendredi
      "2025-08-29", // Vendredi
      // Septembre 2025
      "2025-09-06",
      "2025-09-20",
      // Octobre 2025
      "2025-10-11",
      "2025-10-25",
      // Novembre 2025
      "2025-11-08",
      "2025-11-22",
      // Décembre 2025
      "2025-12-06",
      "2025-12-20",
    ],
    colorScheme: {
      primary: "from-emerald-400 to-teal-500",
      secondary: "from-teal-400 to-cyan-500",
      accent: "green",
    },
  },
  {
    slug: "mise-en-relation",
    title: "MISE EN RELATION",
    shortDescription:
      "Facilitation des échanges et des connexions entre les membres de la communauté.",
    image: "/images/mr-pole.jpg",
    description: `Le pôle Mise en Relation crée des ponts entre les membres de notre communauté. Nous facilitons les rencontres, les échanges et la création de réseaux solides pour favoriser l'entraide, le partage d'expériences et le développement personnel et professionnel de chacun.`,
    features: [
      "Réseau de parrainage pour nouveaux arrivants",
      "Groupes d'échange et de discussion",
      "Mentorat étudiant et professionnel",
      "Mise en relation avec des entreprises",
      "Groupes d'activités et de loisirs",
      "Plateforme d'entraide communautaire",
    ],
    services: [
      {
        title: "Parrainage & Accueil",
        description:
          "Un système de parrainage pour faciliter l'intégration des nouveaux arrivants avec l'accompagnement d'un membre expérimenté de la communauté.",
        icon: "👥",
      },
      {
        title: "Mentorat Professionnel",
        description:
          "Mise en relation entre étudiants, jeunes professionnels et seniors pour partager expériences et conseils de carrière.",
        icon: "💼",
      },
      {
        title: "Groupes d'Échange",
        description:
          "Des groupes thématiques (étudiants, parents, entrepreneurs) pour échanger, partager et créer des liens durables.",
        icon: "💬",
      },
      {
        title: "Réseau d'Entraide",
        description:
          "Une plateforme communautaire pour s'entraider, partager des ressources et créer une solidarité active au quotidien.",
        icon: "🤲",
      },
    ],
    contactInfo: {
      email: "relation@gam-marseille.fr",
      schedule: "Événements de networking mensuels",
    },
    colorScheme: {
      primary: "from-amber-400 to-orange-500",
      secondary: "from-orange-400 to-rose-500",
      accent: "amber",
    },
  },
];

export function getPoleBySlug(slug: string): Pole | undefined {
  return poles.find((pole) => pole.slug === slug);
}

export function getAllPoleSlugs(): string[] {
  return poles.map((pole) => pole.slug);
}

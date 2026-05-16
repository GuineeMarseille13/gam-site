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
  /** Créneaux enrichis (heures) — renseignés quand la base synchronise le calendrier. */
  permanenceSlots?: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  /** Texte carte « Horaires » (prioritaire sur `contactInfo.schedule` si défini). */
  permanenceScheduleSummary?: string;
  statistics?: {
    title?: string;
    items: {
      value: number;
      label: string;
      description?: string;
    }[];
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  eventImages?: {
    url: string;
    title?: string;
    description?: string;
  }[];
  /** Textes `DetailsPole` (bureau) injectés sur la page publique. */
  detailsNarratives?: {
    services?: string | null;
    statistics?: string | null;
    achievements?: string | null;
  };
  /** Pôle administratif : contrôle affichage du bloc Campus France. */
  showCampusFranceCard?: boolean;
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
    eventImages: [],
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
      schedule:
        "Permanences régulières : horaires et dates précises sont affichés sur cette page (mis à jour depuis notre espace d’administration).",
      address: "93 La Canebière, 13001 Marseille",
    },
    colorScheme: {
      primary: "from-emerald-400 to-teal-500",
      secondary: "from-teal-400 to-cyan-500",
      accent: "green",
    },
    eventImages: [
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
    ],
  },
  {
    slug: "mise-en-relation",
    title: "HÉBERGEMENT ET MISE EN RELATION",
    shortDescription:
      "Facilitation des échanges et des connexions entre les membres de la communauté.",
    image: "/images/mr-pole.jpg",
    description: `Le pôle Hébergement et Mise en relation crée des ponts entre les membres de notre communauté. Nous facilitons les rencontres, les échanges et la création de réseaux solides pour favoriser l'entraide, le partage d'expériences et le développement personnel et professionnel de chacun.`,
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
    eventImages: [],
  },
];

export function getPoleBySlug(slug: string): Pole | undefined {
  return poles.find((pole) => pole.slug === slug);
}

export function getAllPoleSlugs(): string[] {
  return poles.map((pole) => pole.slug);
}

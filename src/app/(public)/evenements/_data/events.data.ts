/**
 * Données des événements
 * À remplacer par vos données réelles (API, base de données, etc.)
 */

import { EventsByYear } from "@/types/events";

export const eventsData: EventsByYear = {
  2024: [
    {
      id: 1,
      title: "Soirée Culturelle Guinéenne",
      description:
        "Une soirée exceptionnelle pour célébrer la richesse de la culture guinéenne avec des danses traditionnelles, des dégustations culinaires et des performances artistiques.",
      date: "15 Mars 2024",
      location: "Marseille",
      media: [
        {
          id: 1,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg",
          description: "Performance de danse traditionnelle",
        },
        {
          id: 2,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg",
          description: "Dégustation de plats guinéens",
        },
      ],
    },
    {
      id: 2,
      title: "Journée d'Intégration Étudiante",
      description:
        "Accueil et accompagnement des nouveaux étudiants guinéens avec des ateliers d'information, des rencontres et un réseau de soutien.",
      date: "10 Février 2024",
      location: "Marseille",
      media: [
        {
          id: 3,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg",
          description: "Atelier d'information pour les étudiants",
        },
      ],
    },
  ],
  2023: [
    {
      id: 3,
      title: "Collecte de Fonds Solidaire",
      description:
        "Organisation d'une collecte de fonds pour soutenir des projets communautaires et des actions solidaires en Guinée et à Marseille.",
      date: "5 Janvier 2023",
      location: "Marseille",
      media: [
        {
          id: 4,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2025/07/05/02/55/together-9697018_1280.png",
          description: "Moments de partage lors de la collecte",
        },
        {
          id: 5,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2025/07/20/13/12/little-red-riding-hood-9724469_1280.jpg",
          description: "Remise des dons collectés",
        },
      ],
    },
    {
      id: 4,
      title: "Atelier d'Aide Administrative",
      description:
        "Séance d'accompagnement pour les démarches administratives, renouvellement de titres de séjour, inscriptions et autres formalités.",
      date: "20 Décembre 2023",
      location: "Marseille",
      media: [
        {
          id: 6,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg",
          description: "Accompagnement personnalisé",
        },
      ],
    },
    {
      id: 5,
      title: "Festival de la Solidarité",
      description:
        "Grand événement rassemblant la communauté autour de stands, animations, concerts et partage de moments conviviaux.",
      date: "10 Novembre 2023",
      location: "Marseille",
      media: [
        {
          id: 7,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg",
          description: "Stand d'information",
        },
        {
          id: 8,
          type: "image",
          url: "https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg",
          description: "Animation musicale",
        },
      ],
    },
  ],
};


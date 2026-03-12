/**
 * Configuration de l'événement mis en avant dans l'overlay
 * Modifiez ce fichier pour changer l'événement affiché à chaque visite
 */

export interface FeaturedEvent {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  /** Lien vers la page de l'événement ou d'inscription */
  ctaLink?: string;
  ctaLabel?: string;
  /** Badge affiché en haut de la carte (ex: "Prochainement", "Ce samedi") */
  badge?: string;
}

export const featuredEvent: FeaturedEvent = {
  id: 1,
  title: "Soirée Culturelle Guinéenne",
  subtitle: "Une nuit de culture et de partage",
  description:
    "Rejoignez-nous pour une soirée exceptionnelle célébrant la richesse de la culture guinéenne : danses traditionnelles, dégustations culinaires et performances artistiques. Une occasion unique de se retrouver en communauté.",
  date: "Samedi 15 Juin 2026",
  location: "Marseille — Salle des Fêtes du Prado",
  image:
    "https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg",
  ctaLink: "/evenements",
  ctaLabel: "En savoir plus",
  badge: "Prochainement",
};

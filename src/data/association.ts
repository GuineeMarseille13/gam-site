// Données pour la page Notre Association

import type { TeamMember } from "@/types/association";

// Message du président
export const presidentMessage = `Chers membres, bénévoles et partenaires de l'association Guinée À Marseille,

Je suis ravi de vous présenter le rapport d'activité de notre association pour l'année 2024. Cette année a été marquée par un engagement collectif remarquable et des réalisations significatives qui témoignent de notre détermination à servir notre communauté.

Grâce à votre soutien indéfectible, nous avons pu accompagner des centaines de personnes dans leurs démarches d'intégration, organiser des événements culturels mémorables et renforcer nos partenariats locaux. Chaque action menée, chaque projet réalisé, contribue à construire un pont solide entre la Guinée et Marseille, tout en favorisant l'entraide et la solidarité.

Je tiens à remercier chaleureusement tous les membres actifs, les bénévoles dévoués et nos partenaires de confiance qui rendent possible cette belle aventure humaine. Votre engagement est la force motrice de notre association.

L'année 2025 s'annonce riche en défis et en opportunités. Nous continuerons à innover, à nous adapter aux besoins de notre communauté et à renforcer notre impact local. Ensemble, nous pouvons accomplir de grandes choses.

Avec toute ma gratitude et mes encouragements pour la suite,

Le Président de l'association Guinée À Marseille`;

// Informations du président
export const presidentInfo = {
  name: "Moussa CAMARA",
  role: "Président et Fondateur",
  image: "/images/president.jpg", // À remplacer par l'image réelle
};

// Membres de l'équipe
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Moussa CAMARA",
    role: "Président",
    image: "/images/team/moussa-camara.jpg",
    order: 1,
  },
  {
    id: "2",
    name: "Guillaume MADEC",
    role: "1er vice-président",
    image: "/images/team/guillaume-madec.jpg",
    order: 2,
  },
  {
    id: "3",
    name: "Ibrahim BAH",
    role: "2e vice-président",
    image: "/images/team/ibrahim-bah.jpg",
    order: 3,
  },
  {
    id: "4",
    name: "Michelle DAO",
    role: "Secrétaire",
    image: "/images/team/michelle-dao.jpg",
    order: 4,
  },
  {
    id: "5",
    name: "Mamadou Alpha DIALLO",
    role: "Secrétaire adjoint",
    image: "/images/team/mamadou-diallo.jpg",
    order: 5,
  },
  {
    id: "6",
    name: "Julie DELABY",
    role: "Trésorière",
    image: "/images/team/julie-delaby.jpg",
    order: 6,
  },
  {
    id: "7",
    name: "Aminata FOFANA",
    role: "Trésorière adjointe",
    image: "/images/team/aminata-fofana.jpg",
    order: 7,
  },
];

// Contenu "Qui sommes-nous"
export const aboutUsContent = {
  whoWeAre: {
    title: "Qui sommes-nous ?",
    text: `L'association Guinée à Marseille (GAM) est née d'une observation simple mais essentielle : de nombreux jeunes Guinéens et Africains arrivent à Marseille sans orientation ni accompagnement. Face à ce constat, Moussa Camara a ressenti l'urgence de créer une structure d'accueil et de soutien pour ces nouveaux arrivants.

Fondée le 17 mai 2021, GAM s'est rapidement imposée comme un acteur clé de l'intégration et de la solidarité dans la région marseillaise. Notre mission est de regrouper, informer et accompagner les Guinéens vivant à Marseille et ses environs, en leur offrant un réseau de soutien et des services adaptés à leurs besoins.`,
    image: "/images/about/who-we-are.jpg",
  },
  whatWeOffer: {
    title: "Que propose l'association ?",
    text: `GAM propose un projet ambitieux et complet qui s'articule autour de plusieurs axes majeurs :

• Organisation d'activités sportives et culturelles pour favoriser l'intégration et créer du lien social
• Création d'un réseau solide entre Guinéens et Marseillais pour faciliter l'entraide et les échanges
• Aide aux personnes en difficulté pour lutter activement contre le racisme et les discriminations
• Facilitation de l'intégration des Guinéens et des étrangers dans la ville de Marseille
• Maintien de liens étroits avec les collectifs et indépendants en Guinée
• Construction d'un pont entre l'Afrique et la France, leurs cultures et leurs peuples

Notre objectif est de créer un environnement accueillant où chacun peut trouver sa place, s'épanouir et contribuer à la richesse culturelle de Marseille.`,
    image: "/images/about/what-we-offer.jpg",
  },
};


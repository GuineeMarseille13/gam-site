// Types pour les données de l'association

export interface PresidentInfo {
  name: string;
  role: string;
  image: string;
  commitment?: string; // Texte d'engagement optionnel
}

export interface PresidentMessage {
  content: string;
  signature?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface PresidentSectionData {
  president: PresidentInfo;
  message: PresidentMessage;
}

// Types pour "Qui sommes-nous"
export interface AboutUsSection {
  title: string;
  text: string;
  image: string;
}

export interface AboutUsData {
  whoWeAre: AboutUsSection;
  whatWeOffer: AboutUsSection;
}

// Types pour "Notre équipe"
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order: number; // Pour l'ordre d'affichage (1 = président, 2-3 = vice-présidents, etc.)
  description?: string;
}

export type TeamData = TeamMember[];

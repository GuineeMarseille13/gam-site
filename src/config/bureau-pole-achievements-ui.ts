import {
  type BureauPoleContentSlug,
  getBureauPoleContentEntry,
  isBureauPoleContentSlug,
} from "@/config/bureau-poles-content"

export type BureauPoleAchievementsIntroUi = {
  fieldLabel: string
  editorHelper: string
  placeholder: string
}

export type BureauPoleAchievementsPanelUi = {
  title: string
  description: string
  emptyMessage: string
  addButton: string
  loadingMessage: string
  errorMessage: string
}

export type BureauPoleAchievementsEditorUi = {
  createTitle: string
  editTitle: string
  dialogDescription: string
  imageLabel: string
  chooseImageLabel: string
  uploadingImageLabel: string
  titlePlaceholder: string
  descriptionPlaceholder: string
}

export type BureauPoleAchievementsToastsUi = {
  createdTitle: string
  createdDescription: string
  updatedTitle: string
  updatedDescription: string
  deletedTitle: string
}

export type BureauPoleAchievementsUi = {
  pageDescription: string
  intro: BureauPoleAchievementsIntroUi
  panel: BureauPoleAchievementsPanelUi
  editor: BureauPoleAchievementsEditorUi
  toasts: BureauPoleAchievementsToastsUi
  /** Sous-titre par défaut sur `/poles/{slug}` si aucun texte bureau n’est enregistré. */
  publicDefaultSubtitle: string
}

const ACHIEVEMENTS_UI_BY_POLE = {
  "demarche-administrative": {
    pageDescription:
      "Texte d’introduction et galerie photo des permanences, ateliers et accompagnements administratifs.",
    intro: {
      fieldLabel: "Texte d’introduction « Nos réalisations »",
      editorHelper:
        "Sous-titre affiché au-dessus de la galerie sur la page Accompagnement administratif. Laissez vide pour le texte par défaut du site.",
      placeholder:
        "Ex. : Découvrez les moments forts de nos permanences et l’impact de notre accompagnement dans vos démarches…",
    },
    panel: {
      title: "Galerie des accompagnements",
      description:
        "Photos et légendes des permanences, ateliers d’information et moments marquants du pôle administratif.",
      emptyMessage:
        "Aucune réalisation pour le moment. Ajoutez une photo de permanence, d’atelier ou d’accompagnement de dossier.",
      addButton: "Ajouter une réalisation",
      loadingMessage: "Chargement des réalisations administratives…",
      errorMessage: "Impossible de charger les réalisations. Réessayez.",
    },
    editor: {
      createTitle: "Nouvelle réalisation",
      editTitle: "Modifier la réalisation",
      dialogDescription:
        "Illustrez une permanence, un atelier ou un accompagnement réussi (photo, titre, description).",
      imageLabel: "Photo de la réalisation",
      chooseImageLabel: "Choisir une photo",
      uploadingImageLabel: "Envoi de la photo…",
      titlePlaceholder: "Ex. : Permanence administrative",
      descriptionPlaceholder:
        "Ex. : Accueil et accompagnement personnalisé lors de nos permanences hebdomadaires…",
    },
    toasts: {
      createdTitle: "Réalisation créée.",
      createdDescription: "La carte apparaît dans la galerie du pôle administratif.",
      updatedTitle: "Réalisation mise à jour.",
      updatedDescription: "Les modifications sont visibles sur la page publique.",
      deletedTitle: "Réalisation supprimée.",
    },
    publicDefaultSubtitle:
      "Découvrez les moments forts de nos permanences et l’impact de notre accompagnement administratif.",
  },
  evenementiel: {
    pageDescription:
      "Texte d’introduction et galerie photo des événements culturels, festifs et solidaires.",
    intro: {
      fieldLabel: "Texte d’introduction « Nos réalisations »",
      editorHelper:
        "Sous-titre affiché au-dessus de la galerie sur la page Événementiel. Laissez vide pour le texte par défaut du site.",
      placeholder:
        "Ex. : Revivez nos soirées culturelles, festivals et actions solidaires qui rassemblent la communauté…",
    },
    panel: {
      title: "Galerie des événements",
      description:
        "Photos et légendes des soirées, festivals, ateliers et moments festifs organisés par le pôle.",
      emptyMessage:
        "Aucun événement publié pour le moment. Ajoutez une photo de soirée, festival ou action caritative.",
      addButton: "Ajouter un événement",
      loadingMessage: "Chargement des réalisations événementielles…",
      errorMessage: "Impossible de charger la galerie. Réessayez.",
    },
    editor: {
      createTitle: "Nouvel événement",
      editTitle: "Modifier l’événement",
      dialogDescription:
        "Mettez en avant un événement culturel, festif ou solidaire (photo, titre, description).",
      imageLabel: "Photo de l’événement",
      chooseImageLabel: "Choisir une photo",
      uploadingImageLabel: "Envoi de la photo…",
      titlePlaceholder: "Ex. : Soirée culturelle guinéenne",
      descriptionPlaceholder:
        "Ex. : Une soirée festive pour découvrir la musique, la danse et les traditions guinéennes…",
    },
    toasts: {
      createdTitle: "Événement ajouté.",
      createdDescription: "La carte apparaît dans la galerie du pôle Événementiel.",
      updatedTitle: "Événement mis à jour.",
      updatedDescription: "Les modifications sont visibles sur la page publique.",
      deletedTitle: "Événement supprimé.",
    },
    publicDefaultSubtitle:
      "Découvrez les moments forts de nos événements culturels, festifs et l’impact de notre travail.",
  },
  "mise-en-relation": {
    pageDescription:
      "Texte d’introduction et galerie photo des rencontres, parrainages et actions de mise en relation.",
    intro: {
      fieldLabel: "Texte d’introduction « Nos réalisations »",
      editorHelper:
        "Sous-titre affiché au-dessus de la galerie sur la page Hébergement et Mise en relation. Laissez vide pour le texte par défaut du site.",
      placeholder:
        "Ex. : Découvrez les rencontres, ateliers de networking et moments d’entraide qui renforcent notre communauté…",
    },
    panel: {
      title: "Galerie des rencontres",
      description:
        "Photos et légendes des parrainages, groupes d’échange, mentorats et actions de solidarité.",
      emptyMessage:
        "Aucune réalisation pour le moment. Ajoutez une photo de rencontre, atelier ou action d’entraide.",
      addButton: "Ajouter une réalisation",
      loadingMessage: "Chargement des réalisations…",
      errorMessage: "Impossible de charger les réalisations. Réessayez.",
    },
    editor: {
      createTitle: "Nouvelle réalisation",
      editTitle: "Modifier la réalisation",
      dialogDescription:
        "Illustrez une rencontre, un parrainage ou une action de mise en relation (photo, titre, description).",
      imageLabel: "Photo de la rencontre",
      chooseImageLabel: "Choisir une photo",
      uploadingImageLabel: "Envoi de la photo…",
      titlePlaceholder: "Ex. : Atelier de networking",
      descriptionPlaceholder:
        "Ex. : Échanges entre membres pour créer des liens professionnels et favoriser l’entraide…",
    },
    toasts: {
      createdTitle: "Réalisation créée.",
      createdDescription: "La carte apparaît dans la galerie du pôle Mise en relation.",
      updatedTitle: "Réalisation mise à jour.",
      updatedDescription: "Les modifications sont visibles sur la page publique.",
      deletedTitle: "Réalisation supprimée.",
    },
    publicDefaultSubtitle:
      "Découvrez les moments forts de nos actions de mise en relation et l’entraide au sein de la communauté.",
  },
} as const satisfies Record<BureauPoleContentSlug, BureauPoleAchievementsUi>

/**
 * Libellés bureau et textes par défaut publics pour la section « Nos réalisations » d’un pôle.
 */
export function getBureauPoleAchievementsUi(
  poleSlug: BureauPoleContentSlug,
): BureauPoleAchievementsUi {
  return ACHIEVEMENTS_UI_BY_POLE[poleSlug]
}

/**
 * Sous-titre public par défaut de la section « Nos réalisations ».
 */
export function getPoleAchievementsPublicDefaultSubtitle(poleSlug: string): string {
  if (isBureauPoleContentSlug(poleSlug)) {
    return getBureauPoleAchievementsUi(poleSlug).publicDefaultSubtitle
  }
  return "Découvrez les moments forts de nos actions et l’impact de notre travail."
}

/**
 * Description de page bureau « Nos réalisations » (titre dérivé de l’entrée pôle).
 */
export function getBureauPoleAchievementsPageDescription(
  poleSlug: BureauPoleContentSlug,
): string {
  return getBureauPoleAchievementsUi(poleSlug).pageDescription
}

/**
 * Titre métadonnée bureau : « Nos réalisations — {metaTitle} ».
 */
export function getBureauPoleAchievementsPageMetaTitle(
  poleSlug: BureauPoleContentSlug,
): string {
  const { metaTitle } = getBureauPoleContentEntry(poleSlug)
  return `Nos réalisations — ${metaTitle}`
}

/** Fallback si le slug n’est pas un pôle bureau éditable. */
export const DEFAULT_BUREAU_POLE_ACHIEVEMENTS_UI: BureauPoleAchievementsUi =
  ACHIEVEMENTS_UI_BY_POLE["demarche-administrative"]

/**
 * UI réalisations pour un slug bureau ; fallback générique sinon.
 */
export function resolveBureauPoleAchievementsUi(
  poleSlug: string,
): BureauPoleAchievementsUi {
  if (isBureauPoleContentSlug(poleSlug)) {
    return getBureauPoleAchievementsUi(poleSlug)
  }
  return DEFAULT_BUREAU_POLE_ACHIEVEMENTS_UI
}

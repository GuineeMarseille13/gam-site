import type { Icon } from "@tabler/icons-react"
import {
  IconCalendarEvent,
  IconChartBar,
  IconFileDescription,
  IconHandClick,
  IconLayoutGrid,
  IconLayoutNavbar,
  IconMail,
  IconPackage,
  IconQuote,
  IconSlideshow,
  IconSpeakerphone,
  IconVideo,
} from "@tabler/icons-react"

export type BureauNavItem = {
  title: string
  url: string
  icon: Icon
  adminOnly?: boolean
}

/** Bloc « Contenu du site » : jusqu’au lien Pôles (inclus). */
export const bureauNavContenuBeforeAccompagnement: BureauNavItem[] = [
  { title: "Popup / Annonce", url: "/bureau/popup", icon: IconSpeakerphone },
  { title: "Bandeau", url: "/bureau/bandeau", icon: IconLayoutNavbar },
  { title: "Carousel", url: "/bureau/carousel", icon: IconSlideshow },
  { title: "Événements", url: "/bureau/evenements", icon: IconCalendarEvent },
  { title: "Pôles", url: "/bureau/poles", icon: IconLayoutGrid },
]

/** Suite du bloc « Contenu du site » après les accordéons des pôles (contenu public). */
export const bureauNavContenuAfterAccompagnement: BureauNavItem[] = [
  { title: "Rapports d'activité", url: "/bureau/rapports-activite", icon: IconFileDescription },
  { title: "Partenaires", url: "/bureau/partenaires", icon: IconHandClick },
  { title: "Produits", url: "/bureau/produits", icon: IconPackage },
  { title: "Témoignages vidéo", url: "/bureau/temoignages-video", icon: IconVideo },
  { title: "Avis", url: "/bureau/avis", icon: IconQuote },
  { title: "Statistiques", url: "/bureau/statistiques", icon: IconChartBar },
  { title: "Contact", url: "/bureau/contact", icon: IconMail },
]

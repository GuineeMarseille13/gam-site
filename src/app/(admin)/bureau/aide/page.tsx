"use client"

import Link from "next/link"
import { useState } from "react"
import {
  IconSpeakerphone,
  IconLayoutNavbar,
  IconSlideshow,
  IconCalendarEvent,
  IconLayoutGrid,
  IconUsers,
  IconHandStop,
  IconHandClick,
  IconPackage,
  IconVideo,
  IconChartBar,
  IconMail,
  IconIdBadge2,
  IconHeart,
  IconShoppingCart,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconArrowRight,
  IconBook,
  IconBulb,
  IconLifebuoy,
  IconSparkles,
  IconCheck,
} from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── Types ──────────────────────────────────────────────────────────────────────

interface HelpItem {
  icon: React.ElementType
  title: string
  description: string
  url: string
  tips: string[]
  color: string
  iconBg: string
  iconColor: string
}

// ── Données ────────────────────────────────────────────────────────────────────

const contenuItems: HelpItem[] = [
  {
    icon: IconSpeakerphone,
    title: "Popup / Annonce",
    description: "Fenêtre qui s'affiche automatiquement à chaque visite du site. Idéale pour promouvoir un événement ou afficher des flyers.",
    url: "/bureau/popup",
    color: "violet",
    iconBg: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600",
    tips: [
      "Type « Image + Texte » : une affiche + titre, date, lieu et bouton d'action",
      "Type « Flyer(s) » : un ou plusieurs flyers défilants automatiquement",
      "Un seul popup peut être actif à la fois — activez celui que vous voulez",
      "Désactivez un popup sans le supprimer pour le réutiliser plus tard",
    ],
  },
  {
    icon: IconLayoutNavbar,
    title: "Bandeau",
    description: "Barre défilante affichée en haut du site (puis en bas lors du scroll). Parfaite pour une annonce urgente ou un événement imminent.",
    url: "/bureau/bandeau",
    color: "amber",
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600",
    tips: [
      "Renseignez badge, titre, date et lieu pour un bandeau complet",
      "Un seul bandeau actif à la fois — le précédent est désactivé automatiquement",
      "Le bandeau se fixe en bas de l'écran quand l'utilisateur scrolle",
    ],
  },
  {
    icon: IconSlideshow,
    title: "Carousel",
    description: "Diaporama d'images sur la page d'accueil. Chaque slide peut avoir un titre, un sous-titre et un bouton d'appel à l'action.",
    url: "/bureau/carousel",
    color: "sky",
    iconBg: "bg-sky-100 dark:bg-sky-950",
    iconColor: "text-sky-600",
    tips: [
      "Ordre d'affichage : glissez-déposez ou utilisez l'ordre de création",
      "Images recommandées : format paysage 16/9, haute résolution",
      "Le CTA est optionnel — laissez vide si non nécessaire",
    ],
  },
  {
    icon: IconCalendarEvent,
    title: "Événements",
    description: "Calendrier des événements de l'association affichés sur le site public.",
    url: "/bureau/evenements",
    color: "orange",
    iconBg: "bg-orange-100 dark:bg-orange-950",
    iconColor: "text-orange-600",
    tips: [
      "Renseignez toujours la date, le lieu et une description claire",
      "Ajoutez une image de couverture pour rendre l'événement plus attractif",
      "Les événements passés restent visibles — archivez-les si nécessaire",
    ],
  },
  {
    icon: IconLayoutGrid,
    title: "Pôles",
    description: "Sections thématiques de l'association (culture, sport, jeunesse…) présentées sur le site.",
    url: "/bureau/poles",
    color: "teal",
    iconBg: "bg-teal-100 dark:bg-teal-950",
    iconColor: "text-teal-600",
    tips: [
      "Chaque pôle a son propre slug (url) unique",
      "Ajoutez une description claire des activités du pôle",
      "L'image du pôle est affichée dans la liste et sur la page dédiée",
    ],
  },
  {
    icon: IconUsers,
    title: "Équipe",
    description: "Membres du bureau et équipe dirigeante affichés sur la page \"Notre association\".",
    url: "/bureau/equipe",
    color: "blue",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600",
    tips: [
      "Renseignez le rôle/poste de chaque membre",
      "Photo recommandée : portrait carré ou portrait vertical",
      "L'ordre d'affichage suit l'ordre de création",
    ],
  },
  {
    icon: IconHandStop,
    title: "Bénévoles",
    description: "Liste des bénévoles actifs affichés sur le site pour mettre en valeur leur engagement.",
    url: "/bureau/benevoles",
    color: "rose",
    iconBg: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-600",
    tips: [
      "Ajoutez une photo et une courte description pour chaque bénévole",
      "Le domaine d'intervention aide les visiteurs à comprendre leur rôle",
    ],
  },
  {
    icon: IconHandClick,
    title: "Partenaires",
    description: "Logos et liens des partenaires et sponsors de l'association.",
    url: "/bureau/partenaires",
    color: "indigo",
    iconBg: "bg-indigo-100 dark:bg-indigo-950",
    iconColor: "text-indigo-600",
    tips: [
      "Logos recommandés : fond transparent (PNG), haute résolution",
      "L'URL permet aux visiteurs d'accéder au site du partenaire",
      "Ordonnez les partenaires par niveau d'importance",
    ],
  },
  {
    icon: IconPackage,
    title: "Produits",
    description: "Articles disponibles dans la boutique en ligne de l'association.",
    url: "/bureau/produits",
    color: "lime",
    iconBg: "bg-lime-100 dark:bg-lime-950",
    iconColor: "text-lime-600",
    tips: [
      "Prix en centimes : 1000 = 10,00 €",
      "Ajoutez plusieurs photos pour présenter le produit sous différents angles",
      "Stock à 0 : le produit devient indisponible à la commande",
    ],
  },
  {
    icon: IconVideo,
    title: "Témoignages vidéo",
    description: "Vidéos de témoignages de membres, bénévoles ou bénéficiaires affichées sur le site.",
    url: "/bureau/temoignages-video",
    color: "pink",
    iconBg: "bg-pink-100 dark:bg-pink-950",
    iconColor: "text-pink-600",
    tips: [
      "Formats supportés : YouTube, Vimeo, ou upload direct",
      "Ajoutez un titre et une courte description pour contextualiser",
      "Les vidéos sont affichées en section dédiée sur la page d'accueil",
    ],
  },
  {
    icon: IconChartBar,
    title: "Statistiques",
    description: "Chiffres clés de l'association (membres, événements, bénévoles…) affichés sur le site.",
    url: "/bureau/statistiques",
    color: "cyan",
    iconBg: "bg-cyan-100 dark:bg-cyan-950",
    iconColor: "text-cyan-600",
    tips: [
      "Mettez à jour régulièrement pour refléter la réalité",
      "Utilisez des chiffres arrondis pour plus d'impact",
      "Un chiffre par entrée — créez autant d'entrées que nécessaire",
    ],
  },
  {
    icon: IconMail,
    title: "Contact",
    description: "Informations de contact et réseaux sociaux affichés dans le pied de page et la page de contact.",
    url: "/bureau/contact",
    color: "emerald",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600",
    tips: [
      "Mettez à jour l'adresse email et le numéro de téléphone en priorité",
      "Ajoutez tous vos réseaux sociaux pour maximiser la visibilité",
      "Les messages reçus via le formulaire sont accessibles dans « Messages »",
    ],
  },
]

const paiementsItems: HelpItem[] = [
  {
    icon: IconIdBadge2,
    title: "Adhésions",
    description: "Formulaires d'adhésion soumis via le site. Chaque adhésion est liée à une personne et à un montant.",
    url: "/bureau/adhesions",
    color: "amber",
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-600",
    tips: [
      "Les adhésions sont créées automatiquement lors d'un paiement Stripe",
      "Consultez le détail de chaque adhérent en cliquant sur la ligne",
      "Les montants sont en centimes dans la base de données (ex : 2000 = 20 €)",
    ],
  },
  {
    icon: IconHeart,
    title: "Dons",
    description: "Dons reçus via le formulaire de don en ligne. Chaque don est traité par Stripe.",
    url: "/bureau/dons",
    color: "rose",
    iconBg: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-600",
    tips: [
      "Les dons apparaissent automatiquement après confirmation Stripe",
      "Exportez la liste pour votre comptabilité si nécessaire",
      "Les dons sont non remboursables par défaut — contactez Stripe si besoin",
    ],
  },
  {
    icon: IconShoppingCart,
    title: "Commandes",
    description: "Achats effectués dans la boutique en ligne. Chaque commande contient les articles et l'adresse de livraison.",
    url: "/bureau/commandes",
    color: "blue",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600",
    tips: [
      "Vérifiez les commandes en attente régulièrement",
      "Le statut passe à « payé » automatiquement après confirmation Stripe",
      "Notez l'adresse de livraison avant d'expédier",
    ],
  },
]

// ── Principes généraux ─────────────────────────────────────────────────────────

const principles = [
  {
    icon: IconPlus,
    title: "Créer",
    description: "Cliquez sur « Nouveau » en haut à droite de chaque section pour ajouter un élément.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    icon: IconEdit,
    title: "Modifier",
    description: "Cliquez sur le bouton ✏️ de la ligne ou de la carte pour éditer un élément existant.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    icon: IconEye,
    title: "Activer / Désactiver",
    description: "Le toggle (interrupteur) permet d'afficher ou masquer un élément sur le site sans le supprimer.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/50",
  },
  {
    icon: IconTrash,
    title: "Supprimer",
    description: "Cliquez sur le bouton 🗑️ puis confirmez. La suppression est définitive — vérifiez bien avant.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/50",
  },
]

// ── Composants ─────────────────────────────────────────────────────────────────

function HelpCard({ item }: { item: HelpItem }) {
  const [open, setOpen] = useState(false)
  const Icon = item.icon

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-start gap-4 p-5 text-left"
      >
        <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
          <Icon className={`size-5 ${item.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{item.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground leading-snug">{item.description}</p>
        </div>
        <div className={`mt-1 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}>
          <IconArrowRight className="size-4 text-muted-foreground" />
        </div>
      </button>

      {/* Conseils dépliables */}
      {open && (
        <div className="border-t bg-muted/30 px-5 py-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Conseils pratiques
          </p>
          <ul className="space-y-1.5">
            {item.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <IconCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                {tip}
              </li>
            ))}
          </ul>
          <Link
            href={item.url}
            className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${item.iconColor} hover:underline`}
          >
            Accéder à cette section <IconArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

function PrincipleCard({ p }: { p: typeof principles[0] }) {
  const Icon = p.icon
  return (
    <div className={`flex items-start gap-3 rounded-xl p-4 ${p.bg}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${p.color}`} />
      <div>
        <p className="text-sm font-semibold text-foreground">{p.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{p.description}</p>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AidePage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8 max-w-5xl">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-lime-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-lime-950/40 border border-amber-200/60 dark:border-amber-800/30 p-6 sm:p-8">
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-amber-400/15 blur-2xl" />
        <div className="absolute -bottom-6 right-16 size-32 rounded-full bg-lime-400/15 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-400/30">
            <IconLifebuoy className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Centre d&apos;aide
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Bienvenue dans le guide du bureau administratif. Retrouvez ici toutes les explications
              pour gérer le contenu du site, les paiements et les annonces.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="relative mt-6 flex flex-wrap gap-3">
          {[
            { icon: IconBook, label: "12 sections expliquées" },
            { icon: IconBulb, label: "Conseils pratiques inclus" },
            { icon: IconSparkles, label: "Mis à jour régulièrement" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Principes généraux ── */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight">Principes de base</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Ces 4 actions sont disponibles dans toutes les sections du bureau.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((p) => (
            <PrincipleCard key={p.title} p={p} />
          ))}
        </div>
      </section>

      {/* ── Sections par onglet ── */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight">Guide par section</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Cliquez sur une carte pour afficher les conseils pratiques.</p>
        </div>

        <Tabs defaultValue="contenu">
          <TabsList className="mb-4 h-auto flex-wrap gap-1 bg-muted/50 p-1">
            <TabsTrigger value="contenu" className="gap-1.5 text-xs sm:text-sm">
              <IconLayoutGrid className="size-3.5" />
              Contenu du site
            </TabsTrigger>
            <TabsTrigger value="paiements" className="gap-1.5 text-xs sm:text-sm">
              <IconShoppingCart className="size-3.5" />
              Paiements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contenu">
            <div className="grid gap-3 sm:grid-cols-2">
              {contenuItems.map((item) => (
                <HelpCard key={item.title} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paiements">
            <div className="grid gap-3 sm:grid-cols-2">
              {paiementsItems.map((item) => (
                <HelpCard key={item.title} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── FAQ ── */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight">Questions fréquentes</h2>
        </div>
        <div className="divide-y rounded-2xl border bg-card">
          {[
            {
              q: "Pourquoi mes modifications n'apparaissent-elles pas sur le site ?",
              a: "Vérifiez que l'élément est bien activé (toggle vert). Si c'est le cas, attendez quelques secondes — le site se met à jour automatiquement.",
            },
            {
              q: "Puis-je avoir plusieurs popups actifs en même temps ?",
              a: "Non, un seul popup peut être actif à la fois. Activer un nouveau popup désactive automatiquement l'ancien.",
            },
            {
              q: "Comment modifier l'ordre des éléments dans une section ?",
              a: "L'ordre suit généralement la date de création (du plus récent au plus ancien). Pour certaines sections comme le carousel, un champ d'ordre est disponible.",
            },
            {
              q: "J'ai supprimé un élément par erreur, comment le récupérer ?",
              a: "La suppression est définitive. Contactez votre développeur si les données sont critiques — une restauration depuis la base de données reste possible à chaud.",
            },
            {
              q: "Les paiements Stripe ne s'affichent pas dans le bureau, que faire ?",
              a: "Vérifiez que le webhook Stripe est bien configuré et actif. Si le problème persiste, contactez votre développeur.",
            },
          ].map(({ q, a }) => (
            <FaqItem key={q} question={q} answer={a} />
          ))}
        </div>
      </section>

      {/* ── Contact développeur ── */}
      <section className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
        <IconLifebuoy className="mx-auto mb-3 size-8 text-muted-foreground/50" />
        <p className="text-sm font-semibold text-foreground">Besoin d&apos;aide supplémentaire ?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contactez votre développeur ou référent technique pour toute question non couverte par ce guide.
        </p>
      </section>

    </div>
  )
}

// ── FAQ item (client, dépliable) ───────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/40 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
      >
        {question}
        <IconArrowRight className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <p className="border-t bg-muted/20 px-5 py-3 text-sm text-muted-foreground">
          {answer}
        </p>
      )}
    </div>
  )
}

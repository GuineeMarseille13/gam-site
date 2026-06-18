"use client";

import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Award, Heart } from "lucide-react";
import { usePresidentData } from "@/hooks/use-association";
import { AssociationEmptyState } from "@/components/association/association-empty-state";
import { AssociationSectionTitle } from "@/components/association/association-section-title";
import { AssociationFormattedText } from "@/components/association/association-formatted-text";

// Constantes d'animation centralisées
const ANIMATION_CONFIG = {
  delays: {
    header: 0.1,
    title: 0.2,
    subtitle: 0.3,
    photo: 0.4,
    info: 0.5,
    message: 0.5,
    quote: 0.6,
    signature: 1.0,
  },
  durations: {
    fast: 0.5,
    normal: 0.6,
    slow: 0.7,
  },
} as const;

// Constantes de contenu
const CONTENT = {
  title: "Le mot du président",
  subtitle: "Les mots de notre fondateur, porteur d'espoir et de solidarité",
  badgeText: "Dévoué à aider et soutenir les autres",
  signaturePrefix: "Avec toute ma gratitude et mes encouragements,",
  photoBadge: "Fondateur & Président",
} as const;

export default function PresidentSection() {
  // Récupérer les données via TanStack Query
  const {
    data: presidentData,
    isLoading,
    error: dataError,
  } = usePresidentData();

  if (isLoading) {
    return <LoadingState />;
  }

  if (dataError || !presidentData) {
    return (
      <AssociationEmptyState
        title="Mot du président indisponible"
        description="Ce contenu n'a pas encore été publié ou est momentanément inaccessible."
      />
    );
  }

  const { president: presidentInfo, message } = presidentData;

  const nameParts = presidentInfo.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="relative w-full min-w-0 overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Éléments décoratifs de fond */}
      <BackgroundDecorations />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_CONFIG.durations.normal }}
        className="max-w-7xl mx-auto min-w-0 px-1 sm:px-0 relative z-10"
      >
        <HeaderSection />

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12 xl:gap-16">
          <PresidentInfoCard president={presidentInfo} />
          <MessageCard
            content={message.content}
            presidentRole={presidentInfo.role}
            firstName={firstName}
            lastName={lastName}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Composant pour les décorations de fond
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-100/30 via-green-200/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-100/30 via-green-200/20 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}

// Composant pour l'en-tête
function HeaderSection() {
  return (
    <AssociationSectionTitle
      title={CONTENT.title}
      description={CONTENT.subtitle}
      align="start"
      animationDelay={ANIMATION_CONFIG.delays.header}
    />
  );
}

// Composant pour la carte d'information du président
function PresidentInfoCard({ president }: { president: { name: string; role: string; image: string } }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.photo,
        duration: ANIMATION_CONFIG.durations.slow,
      }}
      className="lg:col-span-2 min-w-0 space-y-5 sm:space-y-8"
    >
      <PresidentPhoto image={president.image} name={president.name} />
      <PresidentDetailsCard name={president.name} role={president.role} />
    </motion.aside>
  );
}

// Composant pour la photo du président
function PresidentPhoto({ image, name }: { image: string; name: string }) {
  return (
    <div className="relative group mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none">
      <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700 ease-out" />

      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-50 via-green-100/50 to-green-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none" />

        <ImageWithFallback
          src={image}
          alt={`Photo de ${name}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 100vw, 40vw"
          priority
        />

        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: ANIMATION_CONFIG.delays.quote,
              duration: ANIMATION_CONFIG.durations.fast,
            }}
            className="flex items-center gap-2 text-white"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 fill-green-300" />
            <span className="text-xs sm:text-sm font-medium">{CONTENT.photoBadge}</span>
          </motion.div>
        </div>
      </div>

      <FloatingDecorations />
    </div>
  );
}

// Éléments décoratifs flottants
function FloatingDecorations() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -12, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-2xl -z-10"
      />
      <motion.div
        animate={{ y: [0, 12, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-full blur-2xl -z-10"
      />
    </>
  );
}

// Composant pour la carte de détails du président
function PresidentDetailsCard({ name, role }: { name: string; role: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.info,
        duration: ANIMATION_CONFIG.durations.normal,
      }}
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 text-white overflow-hidden relative hover:shadow-3xl transition-shadow duration-500">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <CardContent className="relative z-10 p-5 sm:p-8">
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-white via-white/80 to-white/40 sm:h-16" />
              <div className="min-w-0 flex-1">
                <h2 className="text-pretty text-xl font-bold leading-tight sm:text-2xl md:text-3xl">
                  {name}
                </h2>
                <div className="mt-2 flex items-start gap-2 text-green-50">
                  <Award className="mt-0.5 size-4 shrink-0 sm:size-5" />
                  <p className="text-pretty text-sm font-medium leading-relaxed sm:text-base md:text-lg">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4 sm:pt-5">
              <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15 sm:px-5 sm:py-2.5">
                <Heart className="size-4 shrink-0 fill-white text-white" />
                <span className="text-pretty text-xs font-medium sm:text-sm">
                  {CONTENT.badgeText}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Composant pour la carte de message
function MessageCard({
  content,
  presidentRole,
  firstName,
  lastName,
}: {
  content: string;
  presidentRole: string;
  firstName: string;
  lastName: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.message,
        duration: ANIMATION_CONFIG.durations.slow,
      }}
      className="min-w-0 lg:col-span-3"
    >
      <Card className="relative h-full min-w-0 overflow-hidden border-0 bg-white/90 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-green-50/20 to-transparent opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

        <CardContent className="relative z-10 p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14">
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: ANIMATION_CONFIG.delays.quote,
              duration: ANIMATION_CONFIG.durations.normal,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-6 sm:mb-10"
          >
            <Quote className="size-12 text-green-400/30 sm:size-16" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: ANIMATION_CONFIG.delays.quote + 0.1,
              duration: ANIMATION_CONFIG.durations.normal,
            }}
          >
            <AssociationFormattedText text={content} variant="quote" />
          </motion.div>

          <SignatureSection
            firstName={firstName}
            lastName={lastName}
            role={presidentRole}
          />
        </CardContent>
      </Card>
    </motion.article>
  );
}

// Composant pour la section de signature
function SignatureSection({
  firstName,
  lastName,
  role,
}: {
  firstName: string;
  lastName: string;
  role: string;
}) {
  return (
    <motion.footer
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.signature,
        duration: ANIMATION_CONFIG.durations.normal,
      }}
      className="relative mt-8 pt-6 sm:mt-14 sm:pt-10"
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200"
        aria-hidden
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-3">
          <p className="text-pretty text-sm leading-relaxed text-gray-500 italic sm:text-base">
            {CONTENT.signaturePrefix}
          </p>

          <div className="flex items-start gap-3">
            <div
              className="mt-2.5 h-px w-10 shrink-0 bg-gradient-to-r from-green-400 to-transparent sm:mt-3 sm:w-14"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-pretty text-xl font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
                {firstName}
              </p>
              <p className="text-pretty text-base font-medium text-gray-600 sm:text-lg md:text-xl">
                {lastName}
              </p>
              <p className="mt-1 text-pretty text-sm text-gray-500 sm:text-base">{role}</p>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex shrink-0 items-center gap-2 self-start text-green-600 sm:self-end"
        >
          <Heart className="size-5 fill-green-500 text-green-500 sm:size-6" />
          <span className="text-base font-semibold sm:text-lg">GAM</span>
        </motion.div>
      </div>
    </motion.footer>
  );
}

// Composant d'état de chargement avec skeletons modernes
function LoadingState() {
  return (
    <div className="relative w-full min-w-0 overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Décorations de fond */}
      <BackgroundDecorations />

      <div className="max-w-7xl mx-auto min-w-0 px-0 relative z-10">
        {/* Skeleton pour l'en-tête */}
        <HeaderSkeleton />

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12 xl:gap-16">
          {/* Skeleton pour la colonne gauche (photo + info) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <PhotoSkeleton />
            <InfoCardSkeleton />
          </div>

          {/* Skeleton pour la colonne droite (message) */}
          <div className="lg:col-span-3">
            <MessageCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton pour l'en-tête
function HeaderSkeleton() {
  return (
    <header className="mb-10 text-center sm:mb-14 md:mb-16">
      {/* Skeleton pour l'icône et les lignes décoratives - structure identique */}
      <div className="inline-flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-gray-200 to-gray-300 rounded-full" />
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-200 to-green-300 animate-pulse" />
        <div className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-gray-200 to-gray-300 rounded-full" />
      </div>

      {/* Skeleton pour le titre - même taille et largeur */}
      <div className="mb-4 sm:mb-6">
        <div className="h-12 sm:h-16 md:h-20 lg:h-24 w-3/4 sm:w-2/3 mx-auto bg-gradient-to-r from-green-200 via-green-300 to-green-200 rounded-lg animate-pulse" />
      </div>

      {/* Skeleton pour le sous-titre - même taille et largeur */}
      <div className="h-5 sm:h-6 md:h-7 w-2/3 sm:w-3/4 max-w-2xl mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
    </header>
  );
}

// Skeleton pour la photo
function PhotoSkeleton() {
  return (
    <div className="relative group mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none">
      <div className="absolute -inset-2 bg-gradient-to-r from-green-200/30 via-green-300/30 to-green-200/30 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700" />
      
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-50 via-green-100/50 to-green-50">
        {/* Animation de shimmer élégante */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        
        {/* Overlay gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent z-10" />
        
        {/* Badge skeleton en bas - correspond exactement à la structure réelle */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-6 bg-gradient-to-t from-gray-800/70 via-gray-700/50 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-300/30 animate-pulse" />
            <div className="h-3 sm:h-4 w-32 sm:w-40 bg-white/30 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Décorations flottantes skeleton - mêmes positions que le vrai */}
      <motion.div
        animate={{ y: [0, -12, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-200/20 to-green-300/20 rounded-full blur-2xl -z-10"
      />
      <motion.div
        animate={{ y: [0, 12, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-300/20 to-green-400/20 rounded-full blur-2xl -z-10"
      />
    </div>
  );
}

// Skeleton pour la carte d'information
function InfoCardSkeleton() {
  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 overflow-hidden relative hover:shadow-3xl transition-shadow duration-500">
      {/* Pattern décoratif - même que le vrai */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <CardContent className="relative z-10 p-5 sm:p-8">
        <div className="space-y-4 sm:space-y-5">
          {/* Skeleton pour nom et rôle - structure identique */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-white/30 via-white/20 to-white/10 sm:h-16" />
            <div className="min-w-0 flex-1 space-y-3">
              {/* Nom */}
              <div className="h-8 sm:h-10 w-3/4 bg-white/20 rounded-lg animate-pulse" />
              {/* Rôle avec icône */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 animate-pulse" />
                <div className="h-5 sm:h-6 w-2/3 bg-white/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Skeleton pour le badge - structure identique */}
          <div className="border-t border-white/20 pt-4 sm:pt-5">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm sm:px-5 sm:py-2.5">
              <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
              <div className="h-4 w-40 sm:w-48 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton pour la carte de message
function MessageCardSkeleton() {
  return (
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm relative overflow-hidden h-full hover:shadow-3xl transition-all duration-500">
      {/* Effet shimmer - même que le vrai */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/20 to-transparent animate-shimmer opacity-30" />
      {/* Bordure décorative - même que le vrai */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200" />

      <CardContent className="relative z-10 p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14">
        {/* Skeleton pour l'icône de citation - même taille et position */}
        <div className="mb-6 sm:mb-10">
          <div className="size-12 animate-pulse rounded-lg bg-gradient-to-br from-green-200/30 to-green-300/30 sm:size-16" />
        </div>

        {/* Skeleton pour les paragraphes - même espacement */}
        <div className="space-y-6 sm:space-y-7 md:space-y-8">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 sm:h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 sm:h-5 md:h-6 w-5/6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 sm:h-5 md:h-6 w-4/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Skeleton pour la signature - structure identique */}
        <div className="relative mt-8 pt-6 sm:mt-14 sm:pt-10">
          {/* Bordure gradient - même que le vrai */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0 space-y-3">
              {/* Texte de signature */}
              <div className="h-4 w-full max-w-xs animate-pulse rounded bg-gray-200 sm:h-5" />
              <div className="flex items-start gap-3">
                {/* Ligne décorative */}
                <div className="mt-2.5 h-px w-10 shrink-0 bg-gradient-to-r from-gray-300 to-transparent sm:mt-3 sm:w-14" />
                <div className="min-w-0 space-y-2">
                  {/* Prénom */}
                  <div className="h-7 w-32 animate-pulse rounded bg-gray-200 sm:h-8 md:h-10" />
                  {/* Nom */}
                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200 sm:h-6 md:h-7" />
                  {/* Rôle */}
                  <div className="h-4 w-48 max-w-full animate-pulse rounded bg-gray-200 sm:h-5" />
                </div>
              </div>
            </div>

            {/* Logo GAM skeleton */}
            <div className="flex shrink-0 items-center gap-2 self-start sm:self-end">
              <div className="size-5 animate-pulse rounded-full bg-green-200 sm:size-6" />
              <div className="h-5 w-12 animate-pulse rounded bg-green-200 sm:h-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

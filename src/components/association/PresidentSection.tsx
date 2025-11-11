"use client";

import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Award, Heart } from "lucide-react";
import { usePresidentData, usePresidentImage } from "@/hooks/use-association";
import { presidentInfo as defaultPresidentInfo, presidentMessage } from "@/data/association";

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
  title: "LE MOT DU PRÉSIDENT",
  subtitle: "Les mots de notre fondateur, porteur d'espoir et de solidarité",
  badgeText: "Dévoué à aider et soutenir les autres",
  signaturePrefix: "Avec toute ma gratitude et mes encouragements,",
  photoBadge: "Fondateur & Président",
} as const;

export default function PresidentSection() {
  // Récupérer les données via TanStack Query
  const {
    data: presidentData,
    isLoading: isLoadingData,
    error: dataError,
  } = usePresidentData();

  const {
    data: imageUrl,
    isLoading: isLoadingImage,
    error: imageError,
  } = usePresidentImage();

  // Utiliser les données de l'API ou fallback vers les données statiques
  const president = presidentData?.president;
  const message = presidentData?.message;

  const presidentInfo = {
    name: president?.name || defaultPresidentInfo.name,
    role: president?.role || defaultPresidentInfo.role,
    image: imageUrl || president?.image || defaultPresidentInfo.image,
  };

  const messageContent = message?.content || presidentMessage;

  // Diviser le message en paragraphes
  const messageParagraphs = messageContent
    .split("\n\n")
    .filter((p) => p.trim());

  // Extraire le prénom et nom pour la signature
  const nameParts = presidentInfo.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Afficher un état de chargement si les données sont en cours de chargement
  if (isLoadingData || isLoadingImage) {
    return <LoadingState />;
  }

  // Afficher un état d'erreur si les données n'ont pas pu être chargées
  if (dataError || imageError) {
    // On continue avec les données par défaut en cas d'erreur
    console.warn("Error loading president data, using fallback:", dataError || imageError);
  }

  return (
    <div className="w-full relative overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Éléments décoratifs de fond */}
      <BackgroundDecorations />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_CONFIG.durations.normal }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <HeaderSection />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16">
          <PresidentInfoCard president={presidentInfo} />
          <MessageCard
            paragraphs={messageParagraphs}
            presidentName={presidentInfo.name}
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
    <header className="text-center mb-12 sm:mb-16 md:mb-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: ANIMATION_CONFIG.delays.header,
          duration: ANIMATION_CONFIG.durations.normal,
        }}
        className="inline-flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <div className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-green-400 to-green-500" />
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        >
          <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600" />
        </motion.div>
        <div className="h-px w-12 sm:w-20 md:w-24 bg-gradient-to-l from-transparent via-green-400 to-green-500" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: ANIMATION_CONFIG.delays.title,
          duration: ANIMATION_CONFIG.durations.normal,
        }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6"
      >
        <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
          {CONTENT.title}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: ANIMATION_CONFIG.delays.subtitle,
          duration: ANIMATION_CONFIG.durations.normal,
        }}
        className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
      >
        {CONTENT.subtitle}
      </motion.p>
    </header>
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
      className="lg:col-span-2 space-y-6 sm:space-y-8"
    >
      <PresidentPhoto image={president.image} name={president.name} />
      <PresidentDetailsCard name={president.name} role={president.role} />
    </motion.aside>
  );
}

// Composant pour la photo du président
function PresidentPhoto({ image, name }: { image: string; name: string }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700 ease-out" />

      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-50 via-green-100/50 to-green-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none" />

        <ImageWithFallback
          src={image}
          alt={`Photo de ${name}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 40vw"
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

        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-1 h-14 sm:h-16 bg-gradient-to-b from-white via-white/80 to-white/40 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{name}</h2>
                <div className="flex items-center gap-2 text-green-50">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <p className="text-base sm:text-lg font-medium leading-relaxed">{role}</p>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-white/20">
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors duration-300">
                <Heart className="w-4 h-4 fill-white text-white" />
                <span className="text-sm font-medium">{CONTENT.badgeText}</span>
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
  paragraphs,
  presidentName,
  presidentRole,
  firstName,
  lastName,
}: {
  paragraphs: string[];
  presidentName: string;
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
      className="lg:col-span-3"
    >
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm relative overflow-hidden h-full hover:shadow-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/20 to-transparent animate-shimmer opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

        <CardContent className="p-8 sm:p-10 md:p-12 lg:p-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: ANIMATION_CONFIG.delays.quote,
              duration: ANIMATION_CONFIG.durations.normal,
              type: "spring",
              stiffness: 200,
            }}
            className="mb-8 sm:mb-10"
          >
            <Quote className="w-14 h-14 sm:w-16 sm:h-16 text-green-400/30" />
          </motion.div>

          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: ANIMATION_CONFIG.delays.quote + 0.1 + index * 0.12,
                  duration: ANIMATION_CONFIG.durations.normal,
                }}
                className="text-gray-700 leading-relaxed sm:leading-loose text-justify text-base sm:text-lg md:text-xl"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

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
      className="mt-12 sm:mt-14 pt-8 sm:pt-10 relative"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200" />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6">
        <div className="space-y-2">
          <p className="text-sm sm:text-base text-gray-500 italic">{CONTENT.signaturePrefix}</p>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-green-400 to-transparent" />
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{firstName}</p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium">{lastName}</p>
              <p className="text-sm sm:text-base text-gray-500 mt-1">{role}</p>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 text-green-600"
        >
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-green-500 text-green-500" />
          <span className="text-base sm:text-lg font-semibold">GAM</span>
        </motion.div>
      </div>
    </motion.footer>
  );
}

// Composant d'état de chargement avec skeletons modernes
function LoadingState() {
  return (
    <div className="w-full relative overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Décorations de fond */}
      <BackgroundDecorations />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Skeleton pour l'en-tête */}
        <HeaderSkeleton />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16">
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
    <header className="text-center mb-12 sm:mb-16 md:mb-20">
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
    <div className="relative group">
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

      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="space-y-5">
          {/* Skeleton pour nom et rôle - structure identique */}
          <div className="flex items-start gap-4">
            <div className="w-1 h-14 sm:h-16 bg-gradient-to-b from-white/30 via-white/20 to-white/10 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
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
          <div className="pt-5 border-t border-white/20">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
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

      <CardContent className="p-8 sm:p-10 md:p-12 lg:p-14 relative z-10">
        {/* Skeleton pour l'icône de citation - même taille et position */}
        <div className="mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-green-200/30 to-green-300/30 animate-pulse" />
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
        <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 relative">
          {/* Bordure gradient - même que le vrai */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6">
            <div className="space-y-2">
              {/* Texte de signature */}
              <div className="h-4 sm:h-5 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                {/* Ligne décorative */}
                <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-gray-300 to-transparent" />
                <div className="space-y-2">
                  {/* Prénom */}
                  <div className="h-7 sm:h-8 md:h-10 w-32 bg-gray-200 rounded animate-pulse" />
                  {/* Nom */}
                  <div className="h-5 sm:h-6 md:h-7 w-40 bg-gray-200 rounded animate-pulse" />
                  {/* Rôle */}
                  <div className="h-4 sm:h-5 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Logo GAM skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-200 animate-pulse" />
              <div className="h-5 sm:h-6 w-12 bg-green-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

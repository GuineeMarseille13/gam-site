"use client";

import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Globe, Target, Handshake, Sparkles, Eye } from "lucide-react";
import { useAboutUsData } from "@/hooks/use-association";
import { aboutUsContent } from "@/data/association";
import { AboutUsData } from "@/types/association";

// Constantes d'animation
const ANIMATION_CONFIG = {
  delays: {
    section: 0.1,
    title: 0.2,
    image: 0.3,
    content: 0.4,
  },
  durations: {
    fast: 0.5,
    normal: 0.6,
    slow: 0.7,
  },
} as const;

export default function AboutUsSection() {
  // Récupérer les données via TanStack Query
  const {
    data: aboutUsData,
    isLoading,
    error,
  } = useAboutUsData();

  // Utiliser les données de l'API ou fallback vers les données statiques
  const data: AboutUsData = aboutUsData || aboutUsContent;

  // Afficher un état de chargement si les données sont en cours de chargement
  if (isLoading) {
    return <LoadingState data={aboutUsContent} />;
  }

  // Logger l'erreur mais continuer avec les données par défaut
  if (error) {
    console.warn("Error loading about us data, using fallback:", error);
  }

  return (
    <div className="w-full relative overflow-hidden py-6 sm:py-10 md:py-12">
      {/* Éléments décoratifs de fond */}
      <BackgroundDecorations />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16 md:space-y-20">
        {/* Section "Qui sommes-nous ?" */}
        <WhoWeAreSection data={data.whoWeAre} />

        {/* Section "Que propose l'association ?" */}
        <WhatWeOfferSection data={data.whatWeOffer} />
      </div>
    </div>
  );
}

// Composant pour les décorations de fond
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-green-100/20 via-green-200/15 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-tl from-green-100/20 via-green-200/15 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}

// Section "Qui sommes-nous ?"
function WhoWeAreSection({ data }: { data: { title: string; text: string; image: string } }) {
  const paragraphs = data.text.split("\n\n").filter((p) => p.trim());

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.section,
        duration: ANIMATION_CONFIG.durations.normal,
      }}
      className="relative"
    >
      {/* Titre de section */}
      <SectionTitle title={data.title} icon={Users} delay={ANIMATION_CONFIG.delays.title} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: ANIMATION_CONFIG.delays.image,
            duration: ANIMATION_CONFIG.durations.slow,
          }}
          className="relative group cursor-pointer"
        >
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 group-hover:shadow-2xl transition-all duration-500">
            {/* Overlay gradient au hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:from-black/20" />
            
            {/* Overlay avec icône au hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </motion.div>
            
            <ImageWithFallback
              src={data.image}
              alt={data.title}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: ANIMATION_CONFIG.delays.content,
            duration: ANIMATION_CONFIG.durations.slow,
          }}
          className="flex items-center"
        >
          <Card className="w-full border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/10 to-transparent animate-shimmer opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

            <CardContent className="p-6 sm:p-8 md:p-10 relative z-10">
              <div className="space-y-5 sm:space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: ANIMATION_CONFIG.delays.content + 0.1 + index * 0.1,
                      duration: ANIMATION_CONFIG.durations.normal,
                    }}
                    className="text-gray-700 leading-relaxed sm:leading-loose text-justify text-base sm:text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Badge informatif */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: ANIMATION_CONFIG.delays.content + 0.3,
                  duration: ANIMATION_CONFIG.durations.normal,
                }}
                className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200"
              >
                <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-full border border-green-200">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Fondée le 17 mai 2021
                  </span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Section "Que propose l'association ?"
function WhatWeOfferSection({ data }: { data: { title: string; text: string; image: string } }) {
  // Extraire les points de la liste
  const textParts = data.text.split("\n\n");
  const intro = textParts[0] || "";
  const points = textParts[1]?.split("\n").filter((line) => line.trim().startsWith("•")) || [];
  const conclusion = textParts[2] || "";

  const icons = [Heart, Handshake, Globe, Target, Users, Sparkles];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.section + 0.2,
        duration: ANIMATION_CONFIG.durations.normal,
      }}
      className="relative"
    >
      {/* Titre de section */}
      <SectionTitle title={data.title} icon={Target} delay={ANIMATION_CONFIG.delays.title + 0.1} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: ANIMATION_CONFIG.delays.content + 0.2,
            duration: ANIMATION_CONFIG.durations.slow,
          }}
          className="flex items-center order-2 lg:order-1"
        >
          <Card className="w-full border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/10 to-transparent animate-shimmer opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />

            <CardContent className="p-6 sm:p-8 md:p-10 relative z-10">
              {/* Introduction */}
              {intro && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: ANIMATION_CONFIG.delays.content + 0.3,
                    duration: ANIMATION_CONFIG.durations.normal,
                  }}
                  className="text-gray-700 leading-relaxed sm:leading-loose text-justify text-base sm:text-lg mb-6 sm:mb-8"
                >
                  {intro}
                </motion.p>
              )}

              {/* Liste des points */}
              <div className="space-y-3 sm:space-y-4">
                {points.map((point, index) => {
                  const Icon = icons[index % icons.length];
                  const pointText = point.replace("•", "").trim();
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: ANIMATION_CONFIG.delays.content + 0.4 + index * 0.1,
                        duration: ANIMATION_CONFIG.durations.normal,
                      }}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-transparent hover:from-green-50 hover:to-green-100/50 transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg flex-1 pt-1">
                        {pointText}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Conclusion */}
              {conclusion && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: ANIMATION_CONFIG.delays.content + 0.8,
                    duration: ANIMATION_CONFIG.durations.normal,
                  }}
                  className="text-gray-700 leading-relaxed sm:leading-loose text-justify text-base sm:text-lg mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200"
                >
                  {conclusion}
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: ANIMATION_CONFIG.delays.image + 0.2,
            duration: ANIMATION_CONFIG.durations.slow,
          }}
          className="relative group cursor-pointer order-1 lg:order-2"
        >
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 group-hover:shadow-2xl transition-all duration-500">
            {/* Overlay gradient au hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:from-black/20" />
            
            {/* Overlay avec icône au hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
            </motion.div>
            
            <ImageWithFallback
              src={data.image}
              alt={data.title}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Composant pour le titre de section
function SectionTitle({
  title,
  icon: Icon,
  delay,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: ANIMATION_CONFIG.durations.normal,
      }}
      className="flex items-center gap-4 mb-6 sm:mb-8 md:mb-10"
    >
      <div className="h-10 sm:h-12 md:h-14 w-1 bg-gradient-to-b from-green-600 via-green-500 to-green-400 rounded-full flex-shrink-0" />
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
          <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
      </div>
    </motion.div>
  );
}

// Composant d'état de chargement avec skeletons
function LoadingState({ data }: { data: AboutUsData }) {
  // Préparer les données pour les skeletons
  const whoWeAreParagraphs = data.whoWeAre.text.split("\n\n").filter((p) => p.trim());
  const whatWeOfferParts = data.whatWeOffer.text.split("\n\n");
  const whatWeOfferPoints = whatWeOfferParts[1]?.split("\n").filter((line) => line.trim().startsWith("•")) || [];

  return (
    <div className="w-full relative overflow-hidden py-6 sm:py-10 md:py-12">
      <BackgroundDecorations />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16 md:space-y-20">
        {/* Skeleton pour "Qui sommes-nous ?" */}
        <SectionSkeleton 
          title={data.whoWeAre.title}
          paragraphs={whoWeAreParagraphs}
          hasBadge={true}
        />

        {/* Skeleton pour "Que propose l'association ?" */}
        <SectionSkeleton 
          title={data.whatWeOffer.title}
          paragraphs={whatWeOfferParts[0] ? [whatWeOfferParts[0]] : []}
          points={whatWeOfferPoints}
          conclusion={whatWeOfferParts[2] || ""}
          reverse
        />
      </div>
    </div>
  );
}

// Skeleton pour une section
function SectionSkeleton({ 
  reverse = false,
  title,
  paragraphs = [],
  points = [],
  conclusion = "",
  hasBadge = false,
}: { 
  reverse?: boolean;
  title: string;
  paragraphs?: string[];
  points?: string[];
  conclusion?: string;
  hasBadge?: boolean;
}) {
  // Calculer le nombre de lignes approximatif pour chaque paragraphe
  const getParagraphLines = (text: string) => {
    const words = text.split(" ");
    return Math.ceil(words.length / 15); // ~15 mots par ligne
  };

  return (
    <div className="relative">
      {/* Skeleton pour le titre */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8 md:mb-10">
        <div className="h-10 sm:h-12 md:h-14 w-1 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 rounded-full">
          <div className="h-full w-full bg-gradient-to-b from-green-200 via-green-300 to-green-200 rounded-full animate-shimmer" />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
            <div className="h-full w-full bg-gradient-to-br from-green-200 via-green-300 to-green-200 rounded-xl animate-shimmer" />
          </div>
          <div className="h-8 sm:h-10 md:h-12 w-48 sm:w-64 md:w-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10`}>
        {/* Skeleton pour l'image */}
        <div className={`relative ${reverse ? "order-1 lg:order-2" : ""}`}>
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-green-50 via-green-100 to-green-50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Skeleton pour le contenu */}
        <div className={`flex items-center ${reverse ? "order-2 lg:order-1" : ""}`}>
          <Card className="w-full border-0 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/10 to-transparent animate-shimmer opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-300 to-green-200" />

            <CardContent className="p-6 sm:p-8 md:p-10 relative z-10">
              {/* Paragraphes skeleton */}
              {paragraphs.length > 0 ? (
                <div className="space-y-5 sm:space-y-6">
                  {paragraphs.map((paragraph, index) => {
                    const lines = getParagraphLines(paragraph);
                    return (
                      <div key={index} className="space-y-3">
                        {Array.from({ length: lines }).map((_, lineIndex) => (
                          <div
                            key={lineIndex}
                            className={`h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden ${
                              lineIndex === lines - 1 ? "w-5/6" : "w-full"
                            }`}
                          >
                            <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-5 sm:space-y-6">
                  {[1, 2].map((index) => (
                    <div key={index} className="space-y-3">
                      <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden w-full">
                        <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                      </div>
                      <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden w-full">
                        <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                      </div>
                      <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden w-5/6">
                        <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Points skeleton (pour la deuxième section) */}
              {points.length > 0 && (
                <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                  {points.map((point, index) => {
                    const words = point.replace("•", "").trim().split(" ");
                    const lines = Math.ceil(words.length / 12);
                    return (
                      <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-50/30 to-transparent">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 flex-shrink-0 overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-br from-green-200 via-green-300 to-green-200 animate-shimmer" />
                        </div>
                        <div className="flex-1 space-y-2 pt-1">
                          {Array.from({ length: lines }).map((_, lineIndex) => (
                            <div
                              key={lineIndex}
                              className={`h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden ${
                                lineIndex === lines - 1 ? "w-4/5" : "w-full"
                              }`}
                            >
                              <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Conclusion skeleton */}
              {conclusion && (
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200 space-y-3">
                  {Array.from({ length: getParagraphLines(conclusion) }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden ${
                        index === getParagraphLines(conclusion) - 1 ? "w-5/6" : "w-full"
                      }`}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                    </div>
                  ))}
                </div>
              )}

              {/* Badge skeleton */}
              {hasBadge && (
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200">
                  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full border border-gray-300 overflow-hidden">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="h-full w-full bg-gradient-to-br from-green-200 to-green-300 animate-shimmer" />
                    </div>
                    <div className="h-4 w-32 sm:w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

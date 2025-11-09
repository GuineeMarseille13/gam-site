"use client";

import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // Format: "2024-03-15" ou "15 Mars 2024"
  image?: string;
  video?: string;
  location?: string;
}

interface EventsSectionProps {
  events?: Event[];
  className?: string;
  seeMoreLink?: string;
}

const defaultEvents: Event[] = [
  {
    id: 1,
    title: "Soirée Culturelle Guinéenne",
    description:
      "Une soirée exceptionnelle pour célébrer la richesse de la culture guinéenne avec des danses traditionnelles, des dégustations culinaires et des performances artistiques.",
    date: "15 Mars 2024",
    image:
      "https://cdn.pixabay.com/photo/2023/01/28/19/01/bird-7751561_1280.jpg",
    location: "Marseille",
  },
  {
    id: 2,
    title: "Journée d'Intégration Étudiante",
    description:
      "Accueil et accompagnement des nouveaux étudiants guinéens avec des ateliers d'information, des rencontres et un réseau de soutien.",
    date: "10 Février 2024",
    image:
      "https://cdn.pixabay.com/photo/2024/11/02/19/08/bird-9169969_1280.jpg",
    location: "Marseille",
  },
  {
    id: 3,
    title: "Collecte de Fonds Solidaire",
    description:
      "Organisation d'une collecte de fonds pour soutenir des projets communautaires et des actions solidaires en Guinée et à Marseille.",
    date: "5 Janvier 2024",
    image:
      "https://cdn.pixabay.com/photo/2022/12/06/14/56/cookie-cutters-7639169_1280.jpg",
    location: "Marseille",
  },
  {
    id: 4,
    title: "Atelier d'Aide Administrative",
    description:
      "Séance d'accompagnement pour les démarches administratives, renouvellement de titres de séjour, inscriptions et autres formalités.",
    date: "20 Décembre 2023",
    image:
      "https://cdn.pixabay.com/photo/2025/07/05/02/55/together-9697018_1280.png",
    location: "Marseille",
  },
  {
    id: 5,
    title: "Festival de la Solidarité",
    description:
      "Grand événement rassemblant la communauté autour de stands, animations, concerts et partage de moments conviviaux.",
    date: "10 Novembre 2023",
    image:
      "https://cdn.pixabay.com/photo/2025/07/20/13/12/little-red-riding-hood-9724469_1280.jpg",
    location: "Marseille",
  },
];

export default function EventsSection({
  events = defaultEvents,
  className = "",
  seeMoreLink = "/evenements",
}: EventsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Limiter à 4-5 événements les plus récents
  const recentEvents = events.slice(0, 5);

  if (!isMounted) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className={`relative w-full py-10 md:py-12 overflow-hidden ${className}`}
    >
      {/* Background avec gradient subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white pointer-events-none" />

      {/* Container principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de la section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent mb-4"
          >
            Nos Événements
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
          >
            Découvrez les derniers événements organisés par l&apos;association
            GAM
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Ligne verticale de la timeline (desktop) */}
          {!isMobile && (
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-lime-400 transform md:-translate-x-1/2" />
          )}

          {/* Ligne verticale de la timeline (mobile) */}
          {isMobile && (
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-lime-400" />
          )}

          {/* Liste des événements */}
          <div className="space-y-6 md:space-y-8">
            {recentEvents.map((event, index) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={index}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Bouton Voir plus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-8 md:mt-10"
        >
          <Link href={seeMoreLink} className="cursor-pointer">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-6 py-3 md:px-7 md:py-3.5 overflow-visible rounded-full font-semibold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 transition-all duration-300 cursor-pointer"
            >
              {/* Ombre principale cohérente */}
              <span className="absolute inset-0 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.2),0_1px_3px_rgba(250,204,21,0.15)] group-hover:shadow-[0_4px_16px_rgba(245,158,11,0.3),0_2px_8px_rgba(250,204,21,0.25)] transition-shadow duration-300" />

              {/* Masque pour créer l'effet de bordure élégant */}
              <span className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500 p-[2px]">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500" />
              </span>

              {/* Bordure intérieure principale avec effet de lumière moderne */}
              <span className="absolute inset-[2px] rounded-full border-2 border-white/25 group-hover:border-white/50 transition-all duration-300" />

              {/* Bordure de highlight moderne au survol */}
              <span className="absolute inset-[3px] rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.25),inset_0_0_10px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35),inset_0_0_15px_rgba(255,255,255,0.15)]" />

              {/* Effet de brillance au survol */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-full" />

              {/* Glow moderne au survol */}
              <span className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-400/40 to-lime-400/40 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10" />

              {/* Contenu du bouton */}
              <span className="relative flex items-center gap-2 text-xs md:text-sm">
                <span className="font-bold tracking-wide">
                  Voir plus d&apos;événements
                </span>
                <motion.svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  event: Event;
  index: number;
  isMobile: boolean;
}

function TimelineItem({ event, index, isMobile }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  // Déterminer si l'image doit être à gauche (index impair) ou à droite (index pair)
  const isImageOnLeft = index % 2 === 1; // 1, 3, 5... (2e, 4e, 6e éléments)

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Point sur la timeline (desktop) */}
      {!isMobile && (
        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 border-4 border-white shadow-lg z-10" />
      )}

      {/* Point sur la timeline (mobile) */}
      {isMobile && (
        <div className="absolute left-4 top-6 w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 border-2 border-white shadow-md z-10" />
      )}

      {/* Layout Desktop - Deux colonnes fixes pour garantir les espacements */}
      {!isMobile && (
        <div className="flex w-full items-center">
          {/* Colonne de gauche (50% de la largeur) */}
          <div className="w-1/2 flex justify-end pr-2">
            {!isImageOnLeft ? (
              // Texte à gauche
              <div className="max-w-md text-right pr-10">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                >
                  {event.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  className="text-sm sm:text-base text-gray-600 leading-relaxed"
                >
                  {event.description}
                </motion.p>
              </div>
            ) : (
              // Image à gauche (proche de la ligne)
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="flex-shrink-0 w-80 lg:w-96"
              >
                {/* Date et Location - Toujours au-dessus de l'image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  className="mb-3 flex flex-wrap items-center gap-2 justify-end"
                >
                  <span className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-md">
                    {event.date}
                  </span>
                  {event.location && (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <span>📍</span>
                      {event.location}
                    </span>
                  )}
                </motion.div>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl group">
                  {event.video ? (
                    <video
                      src={event.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                      <span className="text-4xl">📅</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Colonne de droite (50% de la largeur) */}
          <div className="w-1/2 flex justify-start pl-2">
            {isImageOnLeft ? (
              // Texte à droite
              <div className="max-w-md text-left pl-10">
                <motion.h3
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                >
                  {event.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                  className="text-sm sm:text-base text-gray-600 leading-relaxed"
                >
                  {event.description}
                </motion.p>
              </div>
            ) : (
              // Image à droite (proche de la ligne)
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="flex-shrink-0 w-80 lg:w-96"
              >
                {/* Date et Location - Toujours au-dessus de l'image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  className="mb-3 flex flex-wrap items-center gap-2"
                >
                  <span className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-md">
                    {event.date}
                  </span>
                  {event.location && (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <span>📍</span>
                      {event.location}
                    </span>
                  )}
                </motion.div>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl group">
                  {event.video ? (
                    <video
                      src={event.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      width={300}
                      height={200}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                      <span className="text-4xl">📅</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Layout Mobile */}
      {isMobile && (
        <div className="flex flex-col pl-12 gap-4">
          {/* Date et Location */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-md">
              {event.date}
            </span>
            {event.location && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <span>📍</span>
                {event.location}
              </span>
            )}
          </motion.div>

          {/* Titre */}
          <motion.h3
            initial={{ opacity: 0, x: 0 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            className="text-xl sm:text-2xl font-bold text-gray-900"
          >
            {event.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: 0 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4"
          >
            {event.description}
          </motion.p>

          {/* Media */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
            className="w-full"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl group">
              {event.video ? (
                <video
                  src={event.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  width={300}
                  height={200}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                  <span className="text-4xl">📅</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

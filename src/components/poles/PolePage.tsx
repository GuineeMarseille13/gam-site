"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import {
  ArrowLeft,
  Mail,
  Clock,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Pole } from "@/data/poles";
import { buildSlotsFromLegacyPole } from "@/helpers/administrative-permanence/build-pole-slots";
import { getPoleAchievementsPublicDefaultSubtitle } from "@/config/bureau-pole-achievements-ui";
import { getPolePublicDisplayTitle } from "@/config/pole-public-display";
import { ADMINISTRATIVE_POLE_SLUG } from "@/helpers/administrative-permanence/constants";
import { CampuceFranceStudentForm } from "@/app/(public)/poles/_components/campuce-france-student-form";
import PermanenceCalendar from "./PermanenceCalendar";

interface PolePageProps {
  pole: Pole;
}

export default function PolePage({ pole }: PolePageProps) {
  const descriptionRef = useRef<HTMLElement | null>(null);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const poleDisplayTitle = getPolePublicDisplayTitle(
    pole.slug,
    pole.displayTitle ?? pole.title,
  );

  const isAdministrativePole = pole.slug === ADMINISTRATIVE_POLE_SLUG;

  const calendarSlots = isAdministrativePole
    ? (pole.permanenceSlots ?? [])
    : pole.permanenceSlots?.length
      ? pole.permanenceSlots
      : buildSlotsFromLegacyPole(pole);

  const horairesDisplayText =
    pole.permanenceScheduleSummary ??
    pole.contactInfo?.schedule ??
    "Permanences les samedis de 14h à 16h";

  const servicesNarrative = pole.detailsNarratives?.services?.trim() ?? "";
  const statisticsNarrative =
    pole.detailsNarratives?.statistics?.trim() ?? "";
  const achievementsNarrative =
    pole.detailsNarratives?.achievements?.trim() ?? "";
  const showAchievementsSection =
    (pole.eventImages?.length ?? 0) > 0 || achievementsNarrative.length > 0;

  /** Pôle ADM : encadré coordonnées / horaires toujours visible ; calendrier seulement si créneaux en base. */
  const showPermanenceBlock =
    isAdministrativePole ||
    (pole.permanenceDates?.length ?? 0) > 0 ||
    (pole.permanenceSlots?.length ?? 0) > 0;

  useEffect(() => {
    if (!descriptionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsDescriptionVisible(true);
        }
      },
      { threshold: 0, rootMargin: "-50% 0px" }
    );

    observer.observe(descriptionRef.current);

    // Vérifier si déjà visible au chargement
    const rect = descriptionRef.current.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      setIsDescriptionVisible(true);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Hero Section - Design ultra-moderne avec effets avancés */}
      <section className="relative w-full h-[70vh] min-h-[600px] md:h-[80vh] overflow-hidden">
        {/* Image de fond avec parallaxe et effets modernes */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.05 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0"
          >
            <Image
              src={pole.image}
              alt={poleDisplayTitle}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          {/* Overlay avec gradient animé */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/50" />
        </div>

        {/* Contenu Hero - Repositionné pour plus d'élégance */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Navigation en haut - Design moderne avec glassmorphism */}
          <div className="flex-1 flex items-start">
            <div className="w-full pt-8 md:pt-12 pl-4 sm:pl-6 lg:pl-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/#poles"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl text-white/95 hover:text-white transition-all duration-300 border border-white/30 hover:border-white/50 hover:bg-white/15 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ x: -4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.div>
                  <span className="font-medium text-sm md:text-base">
                    Retour
                  </span>
                  {/* Effet de glow au hover */}
                  <div className="absolute -inset-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Contenu principal du hero - Centré verticalement */}
          <div className="flex-1 flex items-center">
            <div className="w-full pb-16 md:pb-24 pl-4 sm:pl-6 lg:pl-8">
              <div className="max-w-4xl">
                {/* Titre - Design ultra-moderne avec effet de gradient animé */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 md:mb-8 leading-tight"
                  style={{
                    letterSpacing: "-0.03em",
                  }}
                >
                  {/* Texte avec ombre portée moderne */}
                  <span
                    className="relative z-10 text-white block"
                    style={{
                      textShadow:
                        "0 4px 30px rgba(0,0,0,0.7), 0 2px 15px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.3)",
                    }}
                  >
                    {poleDisplayTitle}
                  </span>
                  {/* Effet de glow animé derrière le texte */}
                  <motion.span
                    className={`absolute inset-0 bg-gradient-to-r ${pole.colorScheme.primary} opacity-30 blur-3xl`}
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.h1>

                {/* Description courte - Design moderne avec animation */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative text-xl sm:text-2xl md:text-3xl text-white/95 max-w-3xl leading-relaxed font-light tracking-wide"
                  style={{
                    textShadow:
                      "0 2px 20px rgba(0,0,0,0.6), 0 1px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  {pole.shortDescription}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal - Espacement approprié sans superposition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Description détaillée - Section introductive avec design moderne */}
        <motion.section
          ref={descriptionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isDescriptionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative md:-mt-16 mb-12 md:mb-16"
        >
          <div className="relative group">
            {/* Carte principale avec design épuré */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={isDescriptionVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative bg-white rounded-2xl p-6 md:p-8 lg:p-10 border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
              style={{
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              {/* Effet de brillance au hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ width: "50%" }}
              />

              {/* Gradient subtil au hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative max-w-4xl mx-auto">
                {/* Badge "À propos" optimisé */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isDescriptionVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="inline-block mb-5 md:mb-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group/badge relative px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pole.colorScheme.primary} transition-all duration-300 cursor-default overflow-hidden`}
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      À propos
                    </span>
                    {/* Effet de glow animé */}
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${pole.colorScheme.primary} rounded-full blur-md`}
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Texte descriptif avec typographie optimisée */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isDescriptionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8"
                >
                  {pole.description}
                </motion.p>

                {/* CTA - Bouton pour contacter amélioré */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isDescriptionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href="/contacts"
                    className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm md:text-base text-white transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    {/* Fond avec gradient animé */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${pole.colorScheme.primary} rounded-full`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Glow animé autour du bouton */}
                    <motion.div
                      className={`absolute -inset-1 bg-gradient-to-r ${pole.colorScheme.primary} rounded-full blur-lg`}
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{ zIndex: -1 }}
                    />

                    {/* Effet de brillance au hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.6 }}
                      style={{ width: "50%" }}
                    />

                    {/* Texte et icône */}
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Nous contacter</span>
                      <motion.div
                        whileHover={{ x: 4, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </motion.div>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Horaires et Adresse - Juste avant le calendrier */}
        {showPermanenceBlock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-8"
          >
            <div
              className={`p-5 md:p-6 rounded-2xl bg-gradient-to-r ${pole.colorScheme.primary} text-white shadow-xl overflow-hidden relative`}
              style={{
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Effet de brillance animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                style={{ width: "50%" }}
              />

              <div className="relative z-10">
                {/* Grille à 2 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Colonne 1 : Horaires et Adresse */}
                  <div className="space-y-3">
                    {/* Horaires */}
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0 border border-white/30 shadow-sm">
                        <Clock className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg md:text-xl mb-1.5">
                          Horaires
                        </p>
                        <p className="text-white/95 text-sm md:text-base leading-relaxed">
                          {horairesDisplayText}
                        </p>
                      </div>
                    </div>

                    {/* Adresse */}
                    {pole.contactInfo?.address && (
                      <div className="flex items-start gap-3 pt-3 border-t border-white/20">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0 border border-white/30 shadow-sm">
                          <MapPin
                            className="w-5 h-5 text-white"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm md:text-base mb-0.5">
                            Adresse
                          </p>
                          <p className="text-white/95 text-sm md:text-base leading-relaxed">
                            {pole.contactInfo.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Colonne 2 : Téléphone et Email */}
                  <div className="space-y-3">
                    {/* Téléphone */}
                    {pole.contactInfo?.phone && (
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0 border border-white/30 shadow-sm">
                          <Phone
                            className="w-5 h-5 text-white"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm md:text-base mb-0.5">
                            Téléphone
                          </p>
                          <a
                            href={`tel:${pole.contactInfo.phone.replace(
                              /-/g,
                              ""
                            )}`}
                            className="text-white/95 text-sm md:text-base leading-relaxed hover:text-white transition-colors duration-200 underline"
                          >
                            {pole.contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {pole.contactInfo?.email && (
                      <div className="flex items-start gap-3 pt-3 border-t border-white/20">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0 border border-white/30 shadow-sm">
                          <Mail
                            className="w-5 h-5 text-white"
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm md:text-base mb-0.5">
                            Email
                          </p>
                          <a
                            href={`mailto:${pole.contactInfo.email}`}
                            className="text-white/95 text-sm md:text-base leading-relaxed hover:text-white transition-colors duration-200 underline"
                          >
                            {pole.contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Calendrier des Permanences - Uniquement pour le pôle administratif */}
        {showPermanenceBlock && calendarSlots.length > 0 && (
          <PermanenceCalendar
            slots={calendarSlots}
            colorScheme={pole.colorScheme}
            calendarYear={
              calendarSlots.length > 0
                ? Math.max(
                    ...calendarSlots.map(
                      (s) => new Date(s.date).getFullYear()
                    )
                  )
                : undefined
            }
          />
        )}

        {isAdministrativePole && pole.showCampusFranceCard !== false && (
          <CampuceFranceStudentForm colorScheme={pole.colorScheme} />
        )}

        {/* Statistics Section - Section statistique moderne et élégante */}
        {pole.statistics && pole.statistics.items.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-20 md:mb-28"
          >
            <div className="text-center mb-12 md:mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
              >
                Statistiques
              </motion.h2>
              {pole.statistics.title && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-600 mb-6 font-medium"
                >
                  {pole.statistics.title}
                </motion.p>
              )}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
              />
            </div>

            {statisticsNarrative ? (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed whitespace-pre-wrap"
              >
                {statisticsNarrative}
              </motion.p>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {pole.statistics.items.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group relative p-5 md:p-6 rounded-2xl bg-white border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                  style={{
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  {/* Effet de brillance au hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ width: "50%" }}
                  />

                  {/* Gradient subtil au hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="relative z-10">
                    {/* Valeur avec style optimisé */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.06 + 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mb-3 md:mb-4"
                    >
                      <div
                        className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${pole.colorScheme.primary} bg-clip-text text-transparent leading-none`}
                      >
                        {stat.value}
                      </div>
                    </motion.div>

                    {/* Label avec espacement optimisé */}
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight mb-1.5 group-hover:text-gray-950 transition-colors">
                      {stat.label}
                    </h3>

                    {/* Description optionnelle avec style épuré */}
                    {stat.description && (
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}


        {/* Services - Design amélioré avec meilleure présentation */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 md:mb-28"
        >
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            >
              Nos Services
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
            />
          </div>
          {servicesNarrative ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed whitespace-pre-wrap"
            >
              {servicesNarrative}
            </motion.p>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {pole.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative p-6 md:p-7 rounded-2xl bg-white border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                style={{
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                {/* Effet de brillance au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ width: "50%" }}
                />

                {/* Gradient subtil au hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="text-4xl md:text-5xl flex-shrink-0 relative"
                    >
                      {/* Effet de glow animé autour de l'icône */}
                      <motion.div
                        className={`absolute -inset-2 bg-gradient-to-r ${pole.colorScheme.primary} rounded-xl blur-xl`}
                        animate={{
                          opacity: [0.1, 0.25, 0.1],
                          scale: [1, 1.15, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative z-10">{service.icon}</span>
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight pt-1 group-hover:text-gray-950 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Galerie / texte — Nos réalisations */}
        {showAchievementsSection ? (
          <EventGallery
            images={pole.eventImages ?? []}
            colorScheme={pole.colorScheme}
            introOverride={achievementsNarrative || null}
            defaultSubtitle={getPoleAchievementsPublicDefaultSubtitle(pole.slug)}
          />
        ) : null}
      </div>
    </div>
  );
}

// Composant Galerie d'événements
interface EventGalleryProps {
  images: { url: string; title?: string; description?: string }[];
  colorScheme: Pole["colorScheme"];
  introOverride?: string | null;
  defaultSubtitle: string;
}

function EventGallery({
  images,
  colorScheme,
  introOverride,
  defaultSubtitle,
}: EventGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);
  const subtitle = introOverride?.trim() || defaultSubtitle;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20 md:mb-28"
    >
      <div className="text-center mb-12 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
        >
          Nos Réalisations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 mb-6 font-medium max-w-3xl mx-auto whitespace-pre-wrap"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
        />
      </div>

      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {images.map((image, index) => (
              <EventImageCard
                key={index}
                image={image}
                index={index}
                colorScheme={colorScheme}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedImage !== null && (
              <ImageModal
                key={selectedImage}
                images={images}
                currentIndex={selectedImage}
                onClose={() => setSelectedImage(null)}
                onNext={() =>
                  setSelectedImage((prev) =>
                    prev !== null && prev < images.length - 1 ? prev + 1 : 0
                  )
                }
                onPrev={() =>
                  setSelectedImage((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : images.length - 1
                  )
                }
              />
            )}
          </AnimatePresence>
        </>
      ) : null}
    </motion.section>
  );
}

// Carte d'image d'événement
interface EventImageCardProps {
  image: { url: string; title?: string; description?: string };
  index: number;
  colorScheme: Pole["colorScheme"];
  onClick: () => void;
}

function EventImageCard({
  image,
  index,
  colorScheme,
  onClick,
}: EventImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
      onClick={onClick}
    >
      {/* Image avec overlay au hover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image.url}
          alt={image.title || "Événement"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay gradient au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Effet de brillance au hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.8 }}
          style={{ width: "50%" }}
        />

        {/* Badge avec gradient coloré */}
        <div
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r ${colorScheme.primary} text-white text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        >
          Voir
        </div>
      </div>

      {/* Informations (si disponibles) */}
      {(image.title || image.description) && (
        <div className="p-4 sm:p-5">
          {image.title && (
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-950 transition-colors">
              {image.title}
            </h3>
          )}
          {image.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {image.description}
            </p>
          )}
        </div>
      )}

      {/* Glow effect au hover */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${colorScheme.primary} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10`}
      />
    </motion.div>
  );
}

// Modal pour afficher l'image en grand
interface ImageModalProps {
  images: { url: string; title?: string; description?: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function ImageModal({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  const currentImage = images[currentIndex];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-6xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-2xl font-bold z-10"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900">
          <ImageWithFallback
            src={currentImage.url}
            alt={currentImage.title || "Événement"}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>

        {/* Informations */}
        {(currentImage.title || currentImage.description) && (
          <div className="mt-4 text-center">
            {currentImage.title && (
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentImage.title}
              </h3>
            )}
            {currentImage.description && (
              <p className="text-gray-300">{currentImage.description}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all flex items-center justify-center"
            >
              ←
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all flex items-center justify-center"
            >
              →
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Clock, Phone, MapPin } from "lucide-react";
import { Pole } from "@/data/poles";
import PermanenceCalendar from "./PermanenceCalendar";

interface PolePageProps {
  pole: Pole;
}

export default function PolePage({ pole }: PolePageProps) {
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
              alt={pole.title}
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 md:pt-12">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 md:pb-24">
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
                    {pole.title}
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
        {/* Description détaillée - Section introductive avec design glassmorphism moderne */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative -mt-10 md:-mt-18 mb-15 md:mb-20"
        >
          <div className="relative group">
            {/* Effet de glow animé et dynamique */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className={`absolute -inset-0 bg-gradient-to-r ${pole.colorScheme.primary} rounded-3xl opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-700`}
              animate={{
                opacity: [0.2, 0.25, 0.2],
              }}
            />

            {/* Carte principale avec glassmorphism subtil */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-8 md:p-12 lg:p-16 border border-gray-100/50 overflow-hidden"
            >
              {/* Pattern moderne avec animation subtile */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                />
              </div>

              {/* Bordure lumineuse animée */}
              <motion.div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${pole.colorScheme.primary} opacity-0 group-hover:opacity-20 pointer-events-none`}
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                }}
              />

              <div className="relative max-w-4xl mx-auto">
                {/* Badge "À propos" amélioré */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="inline-block mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group/badge relative px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r ${pole.colorScheme.primary} transition-all duration-300 cursor-default overflow-hidden`}
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-white"
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
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Texte descriptif avec meilleure typographie */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-light tracking-wide"
                  style={{
                    textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {pole.description}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Horaires et Adresse - Juste avant le calendrier */}
        {pole.permanenceDates && pole.permanenceDates.length > 0 && (
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
                          {pole.contactInfo?.schedule ||
                            "Permanences les samedis de 14h à 16h"}
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
        {pole.permanenceDates && pole.permanenceDates.length > 0 && (
          <PermanenceCalendar
            dates={pole.permanenceDates}
            schedule={pole.contactInfo?.schedule || "14h à 18h"}
            colorScheme={pole.colorScheme}
          />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {pole.statistics.items.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-5 md:p-6 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-gray-200/50 hover:border-transparent transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl"
                  style={{
                    boxShadow:
                      "0 12px 40px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  {/* Effet de brillance au hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ width: "50%" }}
                  />

                  {/* Gradient animé en arrière-plan avec effet subtil */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-8 rounded-2xl transition-opacity duration-700 pointer-events-none`}
                  />

                  {/* Bordure lumineuse au hover */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 pointer-events-none`}
                  />

                  <div className="relative z-10">
                    {/* Valeur avec animation et effet de glow */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.08 + 0.2,
                        type: "spring",
                        stiffness: 150,
                        damping: 15,
                      }}
                      className="relative mb-4"
                    >
                      <motion.div
                        className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${pole.colorScheme.primary} bg-clip-text text-transparent leading-none`}
                        style={{
                          textShadow: "0 0 40px rgba(0,0,0,0.1)",
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      {/* Glow animé autour de la valeur */}
                      <motion.div
                        className={`absolute -inset-3 bg-gradient-to-r ${pole.colorScheme.primary} rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700`}
                        animate={{
                          opacity: [0, 0.1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>

                    {/* Label avec meilleure typographie */}
                    <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-gray-950 transition-colors">
                      {stat.label}
                    </h3>

                    {/* Description optionnelle avec style amélioré */}
                    {stat.description && (
                      <div className="pt-2 border-t border-gray-200/50">
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
                          {stat.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ombre flottante au hover avec effet multicouche */}
                  <motion.div
                    className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow:
                        "0 24px 72px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1)",
                    }}
                  />

                  {/* Particules décoratives */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="absolute bottom-6 right-8 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Features - Layout amélioré avec meilleure hiérarchie */}
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
              Nos Actions
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center items-stretch">
            {pole.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-transparent transition-all duration-500 ease-in-out shadow-md hover:shadow-2xl hover:-translate-y-3 overflow-hidden h-full flex flex-col"
              >
                {/* Effet de brillance au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.8 }}
                  style={{ width: "50%" }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                />
                {/* Bordure lumineuse au hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${pole.colorScheme.primary} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  }}
                />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-start gap-5 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${pole.colorScheme.primary} flex items-center justify-center text-white text-xl font-bold shadow-xl relative overflow-hidden`}
                    >
                      {/* Effet de brillance sur le badge */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative z-10">{index + 1}</span>
                    </motion.div>
                    <p className="text-gray-700 font-medium leading-relaxed pt-1 text-base md:text-lg group-hover:text-gray-900 transition-colors flex-1">
                      {feature}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {pole.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-white/90 backdrop-blur-sm border border-gray-200/60 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 overflow-hidden"
                style={{
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                {/* Effet de brillance animé */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 1.2 }}
                  style={{ width: "50%" }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pole.colorScheme.primary} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                />
                {/* Glow animé au hover */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${pole.colorScheme.primary} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
                />
                <div className="relative z-10">
                  <div className="flex items-start gap-5 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 15, y: -5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className="text-5xl md:text-6xl flex-shrink-0 relative"
                    >
                      {/* Effet de glow autour de l'icône */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${pole.colorScheme.primary} opacity-20 blur-2xl`}
                        animate={{
                          opacity: [0.1, 0.3, 0.1],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative z-10">{service.icon}</span>
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 pt-2 leading-tight group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-light group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

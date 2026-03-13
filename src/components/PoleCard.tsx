"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PoleCardProps {
  image?: string;
  title: string;
  description?: string;
  slug: string;
  className?: string;
  index?: number;
}

export const PoleCard = ({
  image,
  title,
  description,
  slug,
  className,
  index = 0,
}: PoleCardProps) => {
  return (
    <div className="pt-8 pb-4 px-4 sm:pt-10 sm:pb-6 sm:px-6 overflow-hidden">
      <Link href={`/poles/${slug}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ y: -12, scale: 1.02 }}
          className={cn(
            "group relative w-full max-w-[300px] sm:w-[280px] md:w-[300px] h-[420px] sm:h-[450px]",
            "rounded-2xl",
            "bg-gradient-to-br from-white via-gray-50 to-white",
            "border border-gray-200/60 group-hover:border-transparent",
            "transition-all duration-500 ease-out",
            "cursor-pointer",
            className
          )}
          style={{
            boxShadow: `
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 10px 15px -3px rgba(0, 0, 0, 0.08),
            0 20px 25px -5px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.02)
          `,
          }}
        >
          {/* Ombres multiples en couches pour effet de flottement */}
          <motion.div
            className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "transparent",
              boxShadow: `
            0 20px 25px -5px rgba(59, 130, 246, 0.15),
            0 10px 10px -5px rgba(59, 130, 246, 0.1),
            0 0 40px rgba(147, 51, 234, 0.2),
            0 0 60px rgba(236, 72, 153, 0.15)
          `,
              willChange: "opacity",
            }}
          />

          {/* Bordure dégradée moderne qui s'estompe progressivement au hover */}
          <motion.div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `
              conic-gradient(from 0deg at 50% 50%,
                rgba(59, 130, 246, 0.15) 0deg,
                rgba(147, 51, 234, 0.2) 90deg,
                rgba(236, 72, 153, 0.15) 180deg,
                rgba(147, 51, 234, 0.2) 270deg,
                rgba(59, 130, 246, 0.15) 360deg
              )
            `,
              maskImage: `
              radial-gradient(ellipse 100% 100% at 50% 50%, 
                transparent 45%, 
                black 48%, 
                black 52%, 
                transparent 55%
              )
            `,
              WebkitMaskImage: `
              radial-gradient(ellipse 100% 100% at 50% 50%, 
                transparent 45%, 
                black 48%, 
                black 52%, 
                transparent 55%
              )
            `,
              filter: "blur(1px)",
              willChange: "opacity",
            }}
          />

          {/* Effet de brillance au survol */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-2xl pointer-events-none"
            style={{ willChange: "transform" }}
          />

          {/* Conteneur principal avec ombre portée */}
          <motion.div
            className="relative h-full flex flex-col bg-white rounded-2xl overflow-hidden"
            style={{
              boxShadow: `
            0 1px 3px 0 rgba(0, 0, 0, 0.05),
            0 4px 6px -1px rgba(0, 0, 0, 0.06),
            0 10px 15px -3px rgba(0, 0, 0, 0.08)
          `,
            }}
            whileHover={{
              boxShadow: `
            0 10px 15px -3px rgba(0, 0, 0, 0.12),
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 30px 40px -10px rgba(59, 130, 246, 0.15)
          `,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Section image avec overlay - hauteur fixe identique pour toutes les images */}
            <div className="relative w-full h-[280px] overflow-hidden">
              {image ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 3}
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-6xl font-bold text-gray-300">
                    {title[0]}
                  </span>
                </div>
              )}

              {/* Overlay gradient au survol */}
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Section contenu */}
            <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50/50">
              <div>
                {/* Titre avec effet de gradient */}
                <motion.h3 className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                  {title}
                </motion.h3>

                {/* Description optionnelle */}
                {description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                    className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2"
                  >
                    {description}
                  </motion.p>
                )}
              </div>

              {/* Bouton d'action avec animation */}
              <motion.div
                className="mt-4 flex items-center gap-2 text-blue-600 group-hover:text-indigo-600 transition-colors duration-300"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-sm font-semibold">En savoir plus</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.div>
            </div>

            {/* Effet de glow au survol avec ombre colorée */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-25 blur-2xl pointer-events-none transition-opacity duration-500"
              style={{
                boxShadow: `
              0 0 20px rgba(59, 130, 246, 0.3),
              0 0 40px rgba(147, 51, 234, 0.2),
              0 0 60px rgba(236, 72, 153, 0.15)
            `,
                willChange: "opacity",
              }}
            />
          </motion.div>
        </motion.div>
      </Link>
    </div>
  );
};

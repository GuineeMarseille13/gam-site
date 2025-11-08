"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PoleCardProps {
  image: string;
  title: string;
  description?: string;
  className?: string;
  index?: number;
}

export const PoleCard = ({
  image,
  title,
  description,
  className,
  index = 0,
}: PoleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        "group relative w-full max-w-[300px] sm:w-[280px] md:w-[300px] h-[420px] sm:h-[450px]",
        "overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-white via-gray-50 to-white",
        "shadow-xl shadow-gray-200/50",
        "border border-gray-200/60",
        "transition-all duration-300 ease-out",
        "hover:shadow-2xl hover:shadow-blue-500/20",
        className
      )}
    >
      {/* Bordure animée avec gradient */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5))",
        }}
      />

      {/* Effet de brillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-2xl"
      />

      {/* Conteneur principal */}
      <div className="relative h-full flex flex-col bg-white rounded-2xl overflow-hidden">
        {/* Section image avec overlay - hauteur fixe identique pour toutes les images */}
        <div className="relative w-full h-[280px] overflow-hidden">
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

          {/* Overlay gradient au survol */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Section contenu */}
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50/50">
          <div>
            {/* Titre avec effet de gradient */}
            <motion.h3
              className="text-xl sm:text-2xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all duration-300"
            >
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

        {/* Effet de glow au survol */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-500"
        />
      </div>
    </motion.div>
  );
};

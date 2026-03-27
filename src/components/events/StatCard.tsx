/**
 * Composant réutilisable pour afficher une statistique
 */

"use client";

import { motion } from "framer-motion";
import { STYLE_CONFIG, ANIMATION_CONFIG } from "@/app/(public)/evenements/_config/events.config";

interface StatCardProps {
  value: number | string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      whileHover={ANIMATION_CONFIG.stats.card.whileHover}
      className={STYLE_CONFIG.stats.card}
    >
      <div className={STYLE_CONFIG.stats.value}>{value}</div>
      <div className={STYLE_CONFIG.stats.label}>{label}</div>
    </motion.div>
  );
}


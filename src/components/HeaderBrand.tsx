"use client";

import GuineeFlag from "./GuineeFlag";
import FranceFlag from "./FranceFlag";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ParticleTextEffect } from "./interactive-text-particle";

export default function HeaderBrand() {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {/* Drapeau de la Guinée */}
      {!isMobile && <GuineeFlag />}

      {/* Titre principal */}
      {/* <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100">
        Guinée à Marseille
      </h1> */}
      <ParticleTextEffect
        text="Guinée à Marseille"
        colors={["ff6b6b", "feca57", "48dbfb", "1dd1a1"]}
      />

      {/* Drapeau de la France */}
      {!isMobile && <FranceFlag />}
    </div>
  );
}

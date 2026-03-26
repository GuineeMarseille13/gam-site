"use client";

import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  /** Sous `md` (768px) : barre compacte ; sinon navigation desktop complète. */
  const breakpoint = 768;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Vérification initiale
    checkIsMobile();

    // Listener pour les changements de taille
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}

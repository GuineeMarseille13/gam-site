"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface Pointer {
  x?: number;
  y?: number;
}

interface Particle {
  ox: number;
  oy: number;
  cx: number;
  cy: number;
  or: number;
  cr: number;
  pv: number;
  ov: number;
  f: number;
  rgb: number[];
}

interface TextBox {
  str: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface ParticleTextEffectProps {
  text?: string;
  colors?: string[];
  className?: string;
  animationForce?: number;
  particleDensity?: number;
}

const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({
  text = "Guinée à Marseille",
  colors = [
    "ffad70",
    "f7d297",
    "edb9a1",
    "e697ac",
    "b38dca",
    "9c76db",
    "705cb5",
    "43428e",
    "2c2142",
  ],
  className = "",
  animationForce = 10,
  particleDensity = 2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<ParticleClass[]>([]);
  const pointerRef = useRef<Pointer>({});
  const hasPointerRef = useRef<boolean>(false);
  const interactionRadiusRef = useRef<number>(100);
  const isInitializedRef = useRef<boolean>(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    fontSize: number;
  }>({
    width: 400, // ✅ Valeurs par défaut non nulles
    height: 80,
    fontSize: 32,
  });

  const [isReady, setIsReady] = useState<boolean>(false); // ✅ État pour tracking de l'initialisation

  const [textBox] = useState<TextBox>({ str: text });

  const isMobile = useIsMobile();

  const rand = (max = 1, min = 0, dec = 0): number => {
    return +(min + Math.random() * (max - min)).toFixed(dec);
  };

  // Fonction pour calculer les dimensions responsives
  const calculateDimensions = useCallback(() => {
    // ✅ Valeurs par défaut plus robustes
    const fallbackDimensions = {
      width: 400,
      height: 80,
      fontSize: isMobile ? 32 : 48,
    };

    if (!containerRef.current) return fallbackDimensions;

    const containerWidth = containerRef.current.offsetWidth || 400;
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;

    // Taille de police responsive - augmentée pour mobile
    let fontSize: number;
    if (viewportWidth < 480) {
      fontSize = Math.min(32, containerWidth * 0.09);
    } else if (viewportWidth < 768) {
      fontSize = Math.min(40, containerWidth * 0.1);
    } else if (viewportWidth < 1024) {
      fontSize = Math.min(48, containerWidth * 0.11);
    } else {
      fontSize = Math.min(56, containerWidth * 0.12);
    }

    // Calculer la largeur exacte du texte
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      const textWidth = ctx.measureText(text).width;

      return {
        width: Math.ceil(textWidth + 20),
        height: Math.max(fontSize * 1.4, 50),
        fontSize: fontSize,
      };
    }

    return fallbackDimensions;
  }, [text, isMobile]);

  class ParticleClass implements Particle {
    ox: number;
    oy: number;
    cx: number;
    cy: number;
    or: number;
    cr: number;
    pv: number;
    ov: number;
    f: number;
    rgb: number[];

    constructor(
      x: number,
      y: number,
      rgb: number[] = [rand(128), rand(128), rand(128)]
    ) {
      this.ox = x;
      this.oy = y;
      this.cx = x;
      this.cy = y;
      this.or = rand(2, 0.5);
      this.cr = this.or;
      this.pv = 0;
      this.ov = 0;
      this.f = rand(animationForce + 15, animationForce - 15);
      this.rgb = rgb.map((c) => Math.max(0, c + rand(13, -13)));
    }

    draw() {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.fillStyle = `rgb(${this.rgb.join(",")})`;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.cr, 0, 2 * Math.PI);
      ctx.fill();
    }

    move(interactionRadius: number, hasPointer: boolean) {
      let moved = false;

      if (
        hasPointer &&
        pointerRef.current.x !== undefined &&
        pointerRef.current.y !== undefined
      ) {
        const dx = this.cx - pointerRef.current.x;
        const dy = this.cy - pointerRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < interactionRadius && dist > 0) {
          const force = Math.min(
            this.f,
            ((interactionRadius - dist) / dist) * 2
          );
          this.cx += (dx / dist) * force;
          this.cy += (dy / dist) * force;
          moved = true;
        }
      }

      const odx = this.ox - this.cx;
      const ody = this.oy - this.cy;
      const od = Math.hypot(odx, ody);

      if (od > 1) {
        const restore = Math.min(od * 0.1, 3);
        this.cx += (odx / od) * restore;
        this.cy += (ody / od) * restore;
        moved = true;
      }

      this.draw();
      return moved;
    }
  }

  const dottify = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !textBox.x || !textBox.y || !textBox.w || !textBox.h)
      return;

    const data = ctx.getImageData(
      textBox.x,
      textBox.y,
      textBox.w,
      textBox.h
    ).data;
    const pixels = data
      .reduce(
        (
          arr: Array<{ x: number; y: number; rgb: Uint8ClampedArray }>,
          _,
          i,
          d
        ) => {
          if (i % 4 === 0) {
            arr.push({
              x: (i / 4) % textBox.w!,
              y: Math.floor(i / 4 / textBox.w!),
              rgb: d.slice(i, i + 4),
            });
          }
          return arr;
        },
        []
      )
      .filter(
        (p) => p.rgb[3] && !(p.x % particleDensity) && !(p.y % particleDensity)
      );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pixels.forEach((p, i) => {
      particlesRef.current[i] = new ParticleClass(
        textBox.x! + p.x,
        textBox.y! + p.y,
        Array.from(p.rgb.slice(0, 3))
      );
      particlesRef.current[i].draw();
    });

    particlesRef.current.splice(pixels.length, particlesRef.current.length);
  }, [particleDensity]);

  const write = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    textBox.str = text;
    textBox.h = dimensions.fontSize;

    interactionRadiusRef.current = Math.max(20, textBox.h * 1.5);

    ctx.font = `600 ${textBox.h}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    textBox.w = Math.round(ctx.measureText(textBox.str).width);
    textBox.x = Math.max(0, (canvas.width - textBox.w) / 2);
    textBox.y = Math.max(0, (canvas.height - textBox.h) / 2);

    const gradient = ctx.createLinearGradient(
      textBox.x,
      textBox.y,
      textBox.x + textBox.w,
      textBox.y + textBox.h
    );
    const N = colors.length - 1;
    colors.forEach((c, i) => gradient.addColorStop(i / N, `#${c}`));
    ctx.fillStyle = gradient;

    ctx.fillText(textBox.str, canvas.width / 2, canvas.height / 2);
    dottify();
  }, [text, dimensions.fontSize, colors, dottify]);

  const animate = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current.forEach((p) =>
      p.move(interactionRadiusRef.current, hasPointerRef.current)
    );
    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || dimensions.width === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    write();
    isInitializedRef.current = true;
    setIsReady(true); // ✅ Marquer comme prêt
  }, [dimensions, write]);

  // ✅ Effet pour initialiser les dimensions immédiatement
  useEffect(() => {
    const initDimensions = () => {
      const newDimensions = calculateDimensions();
      setDimensions(newDimensions);
    };

    // Initialisation immédiate
    initDimensions();

    // Petit délai pour s'assurer que le DOM est stable
    const timer = setTimeout(initDimensions, 100);

    return () => clearTimeout(timer);
  }, [calculateDimensions]);

  // Gérer le redimensionnement
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = calculateDimensions();
      setDimensions(newDimensions);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [calculateDimensions]);

  // Initialiser le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctxRef.current = ctx;

    // ✅ Nettoyage du timeout précédent
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // ✅ Initialisation avec délai adaptatif
    initTimeoutRef.current = setTimeout(
      () => {
        initialize();
      },
      isReady ? 10 : 150
    ); // Délai plus court si déjà prêt

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [dimensions, initialize, isReady]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isInitializedRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    pointerRef.current.x = (e.clientX - rect.left) * scaleX;
    pointerRef.current.y = (e.clientY - rect.top) * scaleY;
    hasPointerRef.current = true;

    if (!animationIdRef.current) animate();
  };

  const handlePointerLeave = () => {
    hasPointerRef.current = false;
    pointerRef.current.x = undefined;
    pointerRef.current.y = undefined;

    if (!animationIdRef.current && isInitializedRef.current) animate();
  };

  const handlePointerEnter = () => {
    hasPointerRef.current = true;
  };

  return (
    <div
      ref={containerRef}
      className={`${
        isMobile ? "w-full" : "w-auto"
      } flex justify-center items-center ${className}`}
      style={{ minHeight: `${dimensions.height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="cursor-none"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: "auto",
          // ✅ Assurer la visibilité pendant l'initialisation
          opacity: isReady ? 1 : 0.8,
          transition: "opacity 0.3s ease-in-out",
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
      />
    </div>
  );
};

export { ParticleTextEffect };

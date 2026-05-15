'use client'
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import type { MagicTextRevealVariant } from '@/hooks/use-magic-text-reveal-typography';

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  floatingOffsetX: number;
  floatingOffsetY: number;
  floatingSpeed: number;
  floatingAngle: number;
  targetOpacity: number;
  sparkleSpeed: number;
}

/**
 * Vertical du wrapper : `hero` (pleine page), `section` (titres d’onglet / blocs),
 * `display` (mot aligné sur une ligne de titre voisin, ex. « équipe »).
 */
const TITLE_LAYOUT_METRICS: Record<
  MagicTextRevealVariant,
  {
    readonly padXMul: number;
    readonly padYMul: number;
    readonly coreHeightEmMul: number;
    readonly outerHeightPadMul: number;
    readonly minWrapperEm: number;
    readonly spreadHeightMul: number;
  }
> = {
  hero: {
    padXMul: 1.02,
    padYMul: 0.52,
    coreHeightEmMul: 0.88,
    outerHeightPadMul: 0.62,
    minWrapperEm: 0.96,
    spreadHeightMul: 0.1,
  },
  section: {
    padXMul: 1.06,
    padYMul: 0.42,
    coreHeightEmMul: 0.76,
    outerHeightPadMul: 0.26,
    minWrapperEm: 0.96,
    spreadHeightMul: 0.08,
  },
  display: {
    padXMul: 1,
    padYMul: 0.26,
    coreHeightEmMul: 0.7,
    outerHeightPadMul: 0.14,
    minWrapperEm: 0.88,
    spreadHeightMul: 0.05,
  },
};

interface MagicTextRevealProps {
  text?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  spread?: number;
  speed?: number;
  density?: number;
  /** Multiplicateur d’opacité des particules (défaut 1). */
  particleIntensity?: number;
  resetOnMouseLeave?: boolean;
  /** Réduit la hauteur du canvas / wrapper selon le contexte du titre. */
  titleLayout?: MagicTextRevealVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const MagicTextReveal: React.FC<MagicTextRevealProps> = ({
  text = "Magic Text",
  color = "rgba(255, 255, 255, 1)",
  fontSize = 70,
  fontFamily = "Jakarta Sans, sans-serif",
  fontWeight = 600,
  spread = 40,
  speed = 0.5,
  density = 4,
  particleIntensity = 1,
  resetOnMouseLeave = true,
  titleLayout = "hero",
  className = "",
  style = {}
}) => {
  const layoutMetrics = TITLE_LAYOUT_METRICS[titleLayout];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });

  const transformedDensity = 6 - density;
  /** Échelle backing-store du canvas : DPR réel plafonné (évite ×1.5 arbitraire et surfaces énormes sur écrans 3x). */
  const canvasResolutionScale = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const dpr = window.devicePixelRatio || 1;
    return Math.min(2.25, Math.max(1, dpr));
  }, []);

  /**
   * Dimensions CSS du bloc : mesure canvas 2D alignée sur la typo affichée,
   * avec marges pour ascenders/descenders et pour le jeu des particules (`spread`).
   */
  const measureTextBlock = useCallback(
    (
      value: string,
      sizePx: number,
      weight: number,
      family: string,
      particleSpread: number,
      layout: MagicTextRevealVariant,
    ) => {
      const lm = TITLE_LAYOUT_METRICS[layout];
      if (typeof window === "undefined") {
        return { width: 200, height: Math.ceil(sizePx * lm.minWrapperEm) };
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return { width: 200, height: Math.ceil(sizePx * lm.minWrapperEm) };
      }

      ctx.font = `${weight} ${sizePx}px ${family}`;
      const metrics = ctx.measureText(value);
      const ascent =
        metrics.actualBoundingBoxAscent ?? metrics.fontBoundingBoxAscent ?? sizePx * 0.72;
      const descent =
        metrics.actualBoundingBoxDescent ?? metrics.fontBoundingBoxDescent ?? sizePx * 0.22;
      const abl = metrics.actualBoundingBoxLeft;
      const abr = metrics.actualBoundingBoxRight;
      const inkWidth =
        typeof abl === "number" && typeof abr === "number"
          ? Math.max(metrics.width, Math.abs(abl) + abr)
          : metrics.width;

      const coreWidth = Math.max(inkWidth, sizePx * 0.45);
      const coreHeight = Math.max(ascent + descent, sizePx * lm.coreHeightEmMul);

      const padX = Math.max(
        12,
        Math.round((sizePx * 0.22 + particleSpread * 0.32) * lm.padXMul),
      );
      const padY = Math.max(
        4,
        Math.round((sizePx * 0.18 + particleSpread * 0.28) * lm.padYMul),
      );

      return {
        width: Math.ceil(coreWidth + padX * 2),
        height: Math.ceil(coreHeight + padY * 2),
      };
    },
    [],
  );

  useEffect(() => {
    const dimensions = measureTextBlock(text, fontSize, fontWeight, fontFamily, spread, titleLayout);
    setTextDimensions(dimensions);
  }, [text, fontSize, fontWeight, fontFamily, spread, titleLayout, measureTextBlock]);

  // Create particles from text
  const createParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    text: string,
    textX: number,
    textY: number,
    font: string,
    color: string,
    transformedDensity: number,
    resolutionScale: number,
    intensity: number,
  ): Particle[] => {
    const particles: Particle[] = [];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.imageSmoothingEnabled = true;
    
    // Render text for sampling
    ctx.fillText(text, textX, textY);
    
    // Sample the rendered text
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Calculate sampling rate based on DPR
    const baseSampleRate = Math.max(2, Math.round(resolutionScale));
    const sampleRate = baseSampleRate * transformedDensity;
    
    // Calculate text bounds
    let minX = canvas.width;
    let maxX = 0;
    let minY = canvas.height;
    let maxY = 0;
    
    // First pass: find text bounds
    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 0) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    
    // Calculate spread area
    const textWidth = maxX - minX;
    const textHeight = maxY - minY;
    const spreadRadius = Math.max(textWidth, textHeight) * 0.1;
    
    // Second pass: create particles with random initial positions
    for (let y = 0; y < canvas.height; y += sampleRate) {
      for (let x = 0; x < canvas.width; x += sampleRate) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 0) {
          const originalAlpha = alpha / 255;
          
          // Calculate random initial position within spread radius
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * spreadRadius;
          const initialX = x + Math.cos(angle) * distance;
          const initialY = y + Math.sin(angle) * distance;
          
          const particle: Particle = {
            x: initialX,
            y: initialY,
            originalX: x,
            originalY: y,
            color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
            opacity: Math.min(1, originalAlpha * 0.65 * intensity),
            originalAlpha: Math.min(1, originalAlpha * intensity),
            velocityX: 0,
            velocityY: 0,
            angle: Math.random() * Math.PI * 2,
            speed: 0,
            floatingOffsetX: 0,
            floatingOffsetY: 0,
            floatingSpeed: Math.random() * 2 + 1,
            floatingAngle: Math.random() * Math.PI * 2,
            targetOpacity: Math.min(
              1,
              (Math.random() * 0.45 + 0.35) * originalAlpha * intensity,
            ),
            sparkleSpeed: Math.random() * 2 + 1
          };
          particles.push(particle);
        }
      }
    }
    
    // Clear canvas after sampling
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return particles;
  }, []);

  // Update particles animation
  const updateParticles = useCallback((
    particles: Particle[],
    deltaTime: number,
    isHovered: boolean,
    showText: boolean,
    setShowText: (show: boolean) => void,
    spread: number,
    speed: number
  ) => {    const FLOAT_RADIUS = spread;
    const RETURN_SPEED = 3;
    const FLOAT_SPEED = speed;
    const TRANSITION_SPEED = 5 * FLOAT_SPEED;
    const NOISE_SCALE = 0.6;
    const CHAOS_FACTOR = 1.3;
    const FADE_SPEED = 13; 

    particles.forEach(particle => {
      if (isHovered) {
        // When hovered, gradually return to original position
        const dx = particle.originalX - particle.x;
        const dy = particle.originalY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0.1) {
          particle.x += (dx / distance) * RETURN_SPEED * deltaTime * 60;
          particle.y += (dy / distance) * RETURN_SPEED * deltaTime * 60;
        } else {
          particle.x = particle.originalX;
          particle.y = particle.originalY;
        }
        
        // Fade out particles when hovered
        particle.opacity = Math.max(0, particle.opacity - FADE_SPEED * deltaTime);
      } else {
        // Update particle's unique movement pattern
        particle.floatingAngle += deltaTime * particle.floatingSpeed * (1 + Math.random() * CHAOS_FACTOR);
        
        // Generate base movement using improved noise
        const time = Date.now() * 0.001;
        const uniqueOffset = particle.floatingSpeed * 2000;
        const noiseX = (
          Math.sin(time * particle.floatingSpeed + particle.floatingAngle) * 1.2 +
          Math.sin((time + uniqueOffset) * 0.5) * 0.8 +
          (Math.random() - 0.5) * CHAOS_FACTOR
        ) * NOISE_SCALE;
        const noiseY = (
          Math.cos(time * particle.floatingSpeed + particle.floatingAngle * 1.5) * 0.6 +
          Math.cos((time + uniqueOffset) * 0.5) * 0.4 +
          (Math.random() - 0.5) * CHAOS_FACTOR
        ) * NOISE_SCALE;
        
        // Calculate target position with random offset
        const randomOffsetX = FLOAT_RADIUS * noiseX;
        const randomOffsetY = FLOAT_RADIUS * noiseY;
        const targetX = particle.originalX + randomOffsetX;
        const targetY = particle.originalY + randomOffsetY;
        
        // Smooth movement towards target with variable speed
        const dx = targetX - particle.x;
        const dy = targetY - particle.y;
        
        // Add dynamic jitter based on distance
        const distanceFromTarget = Math.sqrt(dx * dx + dy * dy);
        const jitterScale = Math.min(1, distanceFromTarget / (FLOAT_RADIUS * 1.5));
        const jitterX = (Math.random() - 0.5) * FLOAT_SPEED * jitterScale;
        const jitterY = (Math.random() - 0.5) * FLOAT_SPEED * jitterScale;
        
        particle.x += dx * TRANSITION_SPEED * deltaTime + jitterX;
        particle.y += dy * TRANSITION_SPEED * deltaTime + jitterY;
        
        // Contain particles within bounds with soft boundary
        const distanceFromOrigin = Math.sqrt(
          Math.pow(particle.x - particle.originalX, 2) + 
          Math.pow(particle.y - particle.originalY, 2)
        );
        if (distanceFromOrigin > FLOAT_RADIUS) {
          const angle = Math.atan2(particle.y - particle.originalY, particle.x - particle.originalX);
          const pullBack = (distanceFromOrigin - FLOAT_RADIUS) * 0.1;
          particle.x -= Math.cos(angle) * pullBack;
          particle.y -= Math.sin(angle) * pullBack;
        }
        
        // Enhanced continuous sparkling effect
        const opacityDiff = particle.targetOpacity - particle.opacity;
        particle.opacity += opacityDiff * particle.sparkleSpeed * deltaTime * 3;
        
        // When particle reaches its target opacity, set a new random target
        if (Math.abs(opacityDiff) < 0.01) {
          particle.targetOpacity = Math.random() < 0.5
            ? Math.min(1, Math.random() * 0.4 * particle.originalAlpha + 0.2 * particle.originalAlpha)
            : Math.min(1, particle.originalAlpha * 1.15);
          particle.sparkleSpeed = Math.random() * 3 + 1;
        }
      }
    });

    if (isHovered && !showText) {
      setShowText(true);
    }
    if (!isHovered && showText) {
      setShowText(false);
    }
  }, []);

  // Render particles
  const renderParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    resolutionScale: number
  ) => {
    ctx.save();
    ctx.scale(resolutionScale, resolutionScale);
    
    // Batch similar colored particles together
    const particlesByColor = new Map<string, Array<{x: number, y: number}>>();
    
    particles.forEach(particle => {
      if (particle.opacity <= 0) return;
      const color = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`);
      if (!particlesByColor.has(color)) {
        particlesByColor.set(color, []);
      }
      particlesByColor.get(color)!.push({
        x: particle.x / resolutionScale,
        y: particle.y / resolutionScale
      });
    });
    
    // Render particles in batches by color
    particlesByColor.forEach((positions, color) => {
      ctx.fillStyle = color;
      positions.forEach(({ x, y }) => {
        ctx.fillRect(x - 0.5, y - 0.5, 2, 2);
      });
    });
    
    ctx.restore();
  }, []);

  // Render canvas
  const renderCanvas = useCallback(() => {
    if (!wrapperRef.current || !canvasRef.current || !wrapperSize.width || !wrapperSize.height) return;
    
    const canvas = canvasRef.current;
    const { width, height } = wrapperSize;
    
    canvas.width = Math.max(1, Math.round(width * canvasResolutionScale));
    canvas.height = Math.max(1, Math.round(height * canvasResolutionScale));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Calculate text position
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    
    // Create font string
    const font = `${fontWeight} ${fontSize * canvasResolutionScale}px ${fontFamily}`;
    
    // Create particles from text
    const particles = createParticles(
      ctx,
      canvas,
      text,
      textX,
      textY,
      font,
      color,
      transformedDensity,
      canvasResolutionScale,
      particleIntensity,
    );
    
    // Store particles for later use
    particlesRef.current = particles;
    
    // Render particles
    renderParticles(ctx, particles, canvasResolutionScale);
  }, [wrapperSize, canvasResolutionScale, text, fontSize, fontFamily, fontWeight, color, transformedDensity, particleIntensity, createParticles, renderParticles]);

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      
      if (!canvas || !ctx || !particlesRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateParticles(
        particlesRef.current,
        deltaTime,
        isHovered,
        showText,
        setShowText,
        spread,
        speed
      );
      
      renderParticles(ctx, particlesRef.current, canvasResolutionScale);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, showText, spread, speed, canvasResolutionScale, updateParticles, renderParticles]);  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current && textDimensions.width && textDimensions.height) {
        // Responsive padding based on screen size and font size
        const isMobile = window.innerWidth < 768;
        const basePadding = Math.max(
          fontSize * (isMobile ? 0.26 : 0.38),
          spread * 0.32,
          isMobile ? 14 : 20,
        );

        const minWidth = Math.max(
          textDimensions.width + basePadding * 2,
          Math.ceil(fontSize * 2.25),
        );
        const minHeight = Math.max(
          textDimensions.height +
            Math.round(basePadding * 2 * TITLE_LAYOUT_METRICS[titleLayout].outerHeightPadMul),
          Math.ceil(
            fontSize * TITLE_LAYOUT_METRICS[titleLayout].minWrapperEm +
              spread * TITLE_LAYOUT_METRICS[titleLayout].spreadHeightMul,
          ),
        );

        // Largeur / hauteur = besoin réel du texte. Ne pas réduire sous min* : un parent flex étroit
        // provoquait l’ancien plafond `Math.min(minWidth, maxWidth)` et rognait les glyphes.
        setWrapperSize({ width: minWidth, height: minHeight });
      }
    };

    // Initial resize
    if (textDimensions.width && textDimensions.height) {
      handleResize();
    }
    
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    const rafId = requestAnimationFrame(() => {
      const parent = wrapperRef.current?.parentElement;
      if (!parent || typeof ResizeObserver === "undefined") return;
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(parent);
    });

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [textDimensions, fontSize, spread, titleLayout]);

  // Render canvas when size changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setHasBeenShown(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (resetOnMouseLeave || !hasBeenShown) {
      setIsHovered(false);
    }
  }, [resetOnMouseLeave, hasBeenShown]);
  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center justify-center overflow-hidden rounded-lg transition-all duration-300 ${className}`}
      style={{
        width: wrapperSize.width || 'auto',
        height: wrapperSize.height || 'auto',
        minWidth: '150px',
        minHeight: `${Math.max(28, Math.round(fontSize * layoutMetrics.minWrapperEm))}px`,
        maxWidth: 'none',
        backgroundColor: 'rgba(15, 15, 15, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        ...style
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >{/* Animated text that appears on hover */}
      <div
        className={`absolute z-10 transition-opacity duration-200 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          color,
          fontFamily,
          fontWeight,
          fontSize: `${fontSize}px`,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        {text}
      </div>
      
      {/* Canvas for particle system */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/helpers/utils";
import type { Volunteer } from "@/app/_services/home";
import { FloatingVolunteerAvatar } from "@/components/volunteers/floating-volunteer-avatar";

interface FloatingVolunteer extends Volunteer {
  x: number;
  y: number;
  scale: number;
  animationDelay: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

interface VolunteersSectionProps {
  volunteers: Volunteer[];
}

export default function VolunteersSection({ volunteers }: VolunteersSectionProps) {
  const [floatingVolunteers, setFloatingVolunteers] = useState<FloatingVolunteer[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [tappedVolunteerId, setTappedVolunteerId] = useState<string | null>(null);
  const [prefersHoverTooltip, setPrefersHoverTooltip] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPrefersHoverTooltip(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (prefersHoverTooltip || !tappedVolunteerId) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-volunteer-avatar]")) return;
      setTappedVolunteerId(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [prefersHoverTooltip, tappedVolunteerId]);

  const handleVolunteerTap = useCallback(
    (volunteerId: string) => {
      if (prefersHoverTooltip) return;
      setTappedVolunteerId((current) => (current === volunteerId ? null : volunteerId));
    },
    [prefersHoverTooltip],
  );

  // Observer pour déclencher l'animation quand la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation fluide continue des bénévoles flottants
  const updatePositions = useRef(() => {
    setFloatingVolunteers((prev) => {
      if (!containerRef.current) return prev;

      const rect = containerRef.current.getBoundingClientRect();
      const avatarSize = 64;
      const minDistance = 80;

      return prev.map((volunteer, index) => {
        let newX = volunteer.x + volunteer.velocityX;
        let newY = volunteer.y + volunteer.velocityY;
        let newVelocityX = volunteer.velocityX;
        let newVelocityY = volunteer.velocityY;

        // Rebond sur les bords avec effet élastique
        if (newX <= 0 || newX >= rect.width - avatarSize) {
          newVelocityX = -newVelocityX * 0.8;
          newX = Math.max(0, Math.min(rect.width - avatarSize, newX));
        }

        if (newY <= 0 || newY >= rect.height - avatarSize) {
          newVelocityY = -newVelocityY * 0.8;
          newY = Math.max(0, Math.min(rect.height - avatarSize, newY));
        }

        const updatedVolunteer = {
          ...volunteer,
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
        };

        // Vérifier les collisions avec tous les autres avatars
        for (let i = 0; i < prev.length; i++) {
          if (i === index) continue;

          const other = prev[i];
          const dx = newX - other.x;
          const dy = newY - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            const angle = Math.atan2(dy, dx);

            updatedVolunteer.x = other.x + Math.cos(angle) * minDistance;
            updatedVolunteer.y = other.y + Math.sin(angle) * minDistance;

            updatedVolunteer.x = Math.max(
              0,
              Math.min(rect.width - avatarSize, updatedVolunteer.x)
            );
            updatedVolunteer.y = Math.max(
              0,
              Math.min(rect.height - avatarSize, updatedVolunteer.y)
            );

            updatedVolunteer.velocityX =
              -updatedVolunteer.velocityX * 0.5 + (Math.random() - 0.5) * 0.5;
            updatedVolunteer.velocityY =
              -updatedVolunteer.velocityY * 0.5 + (Math.random() - 0.5) * 0.5;
          }
        }

        return updatedVolunteer;
      });
    });
  });

  // Générer les positions initiales sans superposition
  useEffect(() => {
    if (!isVisible || !containerRef.current || volunteers.length === 0) return;

    const generateInitialPositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const avatarSize = 64;
      const minDistance = 80;
      const positions: { x: number; y: number }[] = [];

      const findValidPosition = (): { x: number; y: number } => {
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
          const x = Math.random() * (rect.width - avatarSize);
          const y = Math.random() * (rect.height - avatarSize);

          const isValid = positions.every((pos) => {
            const dx = x - pos.x;
            const dy = y - pos.y;
            return Math.sqrt(dx * dx + dy * dy) >= minDistance;
          });

          if (isValid) return { x, y };
          attempts++;
        }

        // Fallback grille
        const cols = Math.floor(rect.width / (avatarSize + 20));
        const rows = Math.floor(rect.height / (avatarSize + 20));
        const gridIndex = positions.length;
        const col = gridIndex % cols;
        const row = Math.floor(gridIndex / cols) % rows;

        return {
          x: col * (avatarSize + 20) + 10,
          y: row * (avatarSize + 20) + 10,
        };
      };

      const newFloatingVolunteers: FloatingVolunteer[] = volunteers.map(
        (volunteer, index) => {
          const position = findValidPosition();
          positions.push(position);

          return {
            ...volunteer,
            x: position.x,
            y: position.y,
            scale: 0.8 + Math.random() * 0.4,
            animationDelay: index * 150,
            opacity: 0.8 + Math.random() * 0.2,
            velocityX: (Math.random() - 0.5) * 1.5,
            velocityY: (Math.random() - 0.5) * 1.5,
          };
        }
      );

      setFloatingVolunteers(newFloatingVolunteers);
    };

    generateInitialPositions();

    const animate = () => {
      updatePositions.current();
      animationRef.current = requestAnimationFrame(animate);
    };

    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, volunteers]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Si aucun bénévole à afficher, ne pas rendre la section
  if (volunteers.length === 0) return null;

  const previewCount = Math.min(4, volunteers.length);
  const extraCount = volunteers.length - previewCount;

  return (
    <section
      ref={sectionRef}
      className="px-4 w-full sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      {/* Fond avec pattern subtil */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, var(--theme-red) 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, var(--theme-yellow) 2px, transparent 2px),
              radial-gradient(circle at 40% 60%, var(--theme-green) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px, 120px 120px, 60px 60px",
          }}
        />
      </div>

      {/* Ondulations d'arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-theme-red to-theme-yellow rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-r from-theme-green to-theme-blue rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 items-stretch min-h-[75vh]">
          {/* Partie gauche */}
          <div
            className={cn(
              "flex flex-col justify-center space-y-8 transition-all duration-[1200ms] ease-out",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
            )}
          >
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-theme-red/25 bg-gradient-to-r from-theme-red/8 via-theme-yellow/8 to-theme-green/8 px-4 py-1.5">
              <span className="size-1.5 rounded-full bg-theme-red animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-theme-red">
                Nos héros du quotidien
              </span>
            </div>

            {/* Titre */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight text-foreground lg:text-4xl xl:text-5xl">
                Merci à nos{" "}
                <span className="bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green bg-clip-text text-transparent">
                  bénévoles extraordinaires
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-theme-red to-theme-yellow" />
                <div className="h-0.5 w-4 rounded-full bg-theme-green/40" />
              </div>
            </div>

            {/* Corps */}
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>Votre générosité et votre dévouement transforment des vies.</p>
              <p>
                Ensemble, nous prouvons que la solidarité n&apos;a pas de
                frontières et que l&apos;humanité triomphe toujours.
              </p>
            </div>

            {/* Aperçu équipe */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {volunteers.slice(0, previewCount).map((v) => (
                  <Avatar
                    key={v.id}
                    className="size-10 border-2 border-background ring-2 ring-white/40 shadow-sm"
                  >
                    <AvatarImage src={v.image} alt={v.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-theme-red to-theme-yellow text-[10px] font-bold text-white">
                      {v.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {extraCount > 0 && (
                  <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground shadow-sm">
                    +{extraCount}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                et bien d&apos;autres encore
              </p>
            </div>
          </div>

          {/* Partie droite - Nuage de bénévoles flottants */}
          <div
            ref={containerRef}
            className={cn(
              "relative w-full h-full min-h-[600px] md:min-h-[650px] transition-all duration-1200 ease-out delay-500",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16"
            )}
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden max-sm:overflow-visible rounded-3xl">
              {floatingVolunteers.map((volunteer, index) => (
                <FloatingVolunteerAvatar
                  key={volunteer.id}
                  volunteer={volunteer}
                  index={index}
                  boundaryRef={containerRef}
                  prefersHoverTooltip={prefersHoverTooltip}
                  isTooltipOpen={tappedVolunteerId === volunteer.id}
                  onTap={handleVolunteerTap}
                />
              ))}
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute rounded-full border-2 opacity-10",
                    i === 0 && "w-40 h-40 border-theme-red top-1/6 left-1/6",
                    i === 1 && "w-28 h-28 border-theme-yellow top-2/3 right-1/5",
                    i === 2 && "w-52 h-52 border-theme-green top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                    i === 3 && "w-20 h-20 border-theme-blue top-1/4 right-1/3",
                    i === 4 && "w-36 h-36 border-theme-red bottom-1/4 left-1/4"
                  )}
                  style={{
                    animation: `spin ${8 + i * 3}s linear infinite${i % 2 === 0 ? " reverse" : ""}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

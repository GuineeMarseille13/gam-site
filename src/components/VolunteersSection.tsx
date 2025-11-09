"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Volunteer {
  id: number;
  name: string;
  image: string;
  role?: string;
  initials: string;
}

interface FloatingVolunteer extends Volunteer {
  x: number;
  y: number;
  scale: number;
  animationDelay: number;
  rotation: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

const volunteers: Volunteer[] = [
  {
    id: 1,
    name: "Marie Dubois",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    role: "Coordinatrice",
    initials: "MD",
  },
  {
    id: 2,
    name: "Pierre Martin",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    role: "Trésorier",
    initials: "PM",
  },
  {
    id: 3,
    name: "Aminata Traoré",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
    role: "Secrétaire",
    initials: "AT",
  },
  {
    id: 4,
    name: "Jean-Luc Dupont",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Bénévole",
    initials: "JD",
  },
  {
    id: 5,
    name: "Fatou Sow",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Bénévole",
    initials: "FS",
  },
  {
    id: 6,
    name: "Ahmed Camara",
    image: "https://randomuser.me/api/portraits/men/28.jpg",
    role: "Bénévole",
    initials: "AC",
  },
  {
    id: 7,
    name: "Sophie Leroy",
    image: "https://randomuser.me/api/portraits/women/31.jpg",
    role: "Bénévole",
    initials: "SL",
  },
  {
    id: 8,
    name: "Mamadou Diallo",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    role: "Bénévole",
    initials: "MD",
  },
  {
    id: 9,
    name: "Isabelle Laurent",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    role: "Bénévole",
    initials: "IL",
  },
  {
    id: 10,
    name: "Ousmane Kaba",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    role: "Bénévole",
    initials: "OK",
  },
];

export default function VolunteersSection() {
  const [floatingVolunteers, setFloatingVolunteers] = useState<
    FloatingVolunteer[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Observer pour déclencher l'animation quand la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
      }
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
      const avatarSize = 64; // 16 * 4 = 64px
      const minDistance = 80; // Distance minimale entre avatars

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

        // Vérification des collisions avec les autres avatars
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
            // Calculer la direction pour repousser
            const angle = Math.atan2(dy, dx);
            const pushDistance = (minDistance - distance) / 2;

            // Repousser l'avatar actuel
            updatedVolunteer.x = other.x + Math.cos(angle) * minDistance;
            updatedVolunteer.y = other.y + Math.sin(angle) * minDistance;

            // S'assurer qu'il reste dans les limites
            updatedVolunteer.x = Math.max(
              0,
              Math.min(rect.width - avatarSize, updatedVolunteer.x)
            );
            updatedVolunteer.y = Math.max(
              0,
              Math.min(rect.height - avatarSize, updatedVolunteer.y)
            );

            // Inverser légèrement la vélocité pour éviter les re-collisions
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
    if (!isVisible || !containerRef.current) return;

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

          // Vérifier si cette position est valide (pas trop proche des autres)
          const isValid = positions.every((pos) => {
            const dx = x - pos.x;
            const dy = y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance >= minDistance;
          });

          if (isValid) {
            return { x, y };
          }

          attempts++;
        }

        // Si on ne trouve pas de position valide, utiliser une grille
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
            rotation: Math.random() * 360,
            opacity: 0.8 + Math.random() * 0.2,
            velocityX: (Math.random() - 0.5) * 1.5,
            velocityY: (Math.random() - 0.5) * 1.5,
          };
        }
      );

      setFloatingVolunteers(newFloatingVolunteers);
    };

    generateInitialPositions();

    // Animation continue
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
  }, [isVisible]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      {/* Fond avec pattern subtil amélioré */}
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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center min-h-[75vh]">
          {/* Partie gauche - Texte de remerciement amélioré */}
          <div
            className={cn(
              "space-y-10 transition-all duration-1200 ease-out",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
            )}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-theme-red/10 via-theme-yellow/10 to-theme-green/10 rounded-full border border-theme-red/20">
                <span className="text-sm font-medium text-theme-red uppercase tracking-wide">
                  Nos héros du quotidien
                </span>
              </div>

              <h5 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight">
                Merci à nos{" "}
                <span className="bg-gradient-to-r from-theme-red via-theme-yellow to-theme-green bg-clip-text text-transparent">
                  bénévoles extraordinaires
                </span>
              </h5>

              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Votre générosité et votre dévouement transforment des vies
                </p>
                <p>
                  Ensemble, nous prouvons que la solidarité n&apos;a pas de
                  frontières et que l&apos;humanité triomphe toujours.
                </p>
              </div>
            </div>
          </div>

          {/* Partie droite - Animation nuage de bénévoles améliorée */}
          <div
            ref={containerRef}
            className={cn(
              "relative h-[600px] md:h-[650px] transition-all duration-1200 ease-out delay-500",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16"
            )}
          >
            {/* Container pour les bulles flottantes avec mouvement fluide */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {floatingVolunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="absolute transition-none"
                  style={{
                    left: `${volunteer.x}px`,
                    top: `${volunteer.y}px`,
                    transform: `scale(${volunteer.scale})`,
                    opacity: volunteer.opacity,
                    animationDelay: `${volunteer.animationDelay}ms`,
                  }}
                >
                  {/* Bulle avec effet de halo amélioré */}
                  <div className="relative group cursor-pointer">
                    {/* Multiple halos colorés pour un effet nuage */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-theme-red/20 via-theme-yellow/20 to-theme-green/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div
                      className="absolute -inset-3 bg-gradient-to-r from-theme-green/15 via-theme-blue/15 to-theme-red/15 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    />
                    <div className="absolute -inset-2 bg-gradient-to-r from-theme-yellow/25 via-theme-red/25 to-theme-green/25 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Avatar principal avec bordure animée */}
                    <Avatar className="w-16 h-16 relative z-10 border-4 border-white shadow-2xl group-hover:scale-125 transition-all duration-500 group-hover:rotate-12">
                      <AvatarImage
                        src={volunteer.image}
                        alt={volunteer.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-theme-red to-theme-yellow text-white font-bold text-lg">
                        {volunteer.initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Tooltip amélioré */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-100">
                      <div className="bg-gradient-to-r from-gray-900 to-black text-white text-sm px-4 py-3 rounded-xl whitespace-nowrap shadow-2xl border border-theme-yellow/30">
                        <div className="font-bold text-theme-yellow">
                          {volunteer.name}
                        </div>
                        {volunteer.role && (
                          <div className="text-xs text-gray-300 mt-1">
                            {volunteer.role}
                          </div>
                        )}
                        {/* Flèche du tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Éléments décoratifs d'arrière-plan améliorés */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Cercles animés plus subtils */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute rounded-full border-2 opacity-10",
                    i === 0 && "w-40 h-40 border-theme-red top-1/6 left-1/6",
                    i === 1 &&
                      "w-28 h-28 border-theme-yellow top-2/3 right-1/5",
                    i === 2 &&
                      "w-52 h-52 border-theme-green top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                    i === 3 && "w-20 h-20 border-theme-blue top-1/4 right-1/3",
                    i === 4 && "w-36 h-36 border-theme-red bottom-1/4 left-1/4"
                  )}
                  style={{
                    animation: `spin ${8 + i * 3}s linear infinite${
                      i % 2 === 0 ? " reverse" : ""
                    }`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supprimez cette section complètement */}
      {/* Particules flottantes améliorées */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: [
                "var(--theme-red)",
                "var(--theme-yellow)",
                "var(--theme-green)",
                "var(--theme-blue)",
              ][i % 4],
              opacity: 0.3 + Math.random() * 0.4,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div> */}
    </section>
  );
}

// Composant séparé pour les particules pour éviter les problèmes d'hydratation
function FloatingParticle({ index }: { index: number }) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Générer les styles côté client uniquement
    const colors = [
      "var(--theme-red)",
      "var(--theme-yellow)",
      "var(--theme-green)",
      "var(--theme-blue)",
    ];

    setStyle({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${2 + Math.random() * 4}px`,
      height: `${2 + Math.random() * 4}px`,
      backgroundColor: colors[index % 4],
      opacity: 0.3 + Math.random() * 0.4,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    });
  }, [index]);

  return <div className="absolute rounded-full animate-float" style={style} />;
}

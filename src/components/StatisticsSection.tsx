"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";

interface Statistic {
  label: string;
  value: number;
  color: "red" | "yellow" | "green" | "blue";
  icon: string;
  suffix?: string;
}

interface StatisticCardProps {
  statistic: Statistic;
  isVisible: boolean;
  delay: number;
}

const StatisticCard = ({ statistic, isVisible, delay }: StatisticCardProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const { count, isComplete } = useCountUp({
    end: statistic.value,
    start: 0,
    duration: 2500,
    suffix: statistic.suffix || "",
    trigger: shouldAnimate,
  });

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const colorClasses = {
    red: {
      gradient: "bg-gradient-red",
      text: "text-theme-red",
      border: "border-theme-red/20",
      shadow: "shadow-theme-red/10",
      ring: "ring-theme-red/20",
    },
    yellow: {
      gradient: "bg-gradient-yellow",
      text: "text-theme-yellow",
      border: "border-theme-yellow/20",
      shadow: "shadow-theme-yellow/10",
      ring: "ring-theme-yellow/20",
    },
    green: {
      gradient: "bg-gradient-green",
      text: "text-theme-green",
      border: "border-theme-green/20",
      shadow: "shadow-theme-green/10",
      ring: "ring-theme-green/20",
    },
    blue: {
      gradient: "bg-gradient-blue",
      text: "text-theme-blue",
      border: "border-theme-blue/20",
      shadow: "shadow-theme-blue/10",
      ring: "ring-theme-blue/20",
    },
  };

  const colors = colorClasses[statistic.color];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 transition-all duration-700 transform",
        "hover:scale-105 hover:shadow-xl h-24",
        colors.border,
        colors.shadow,
        shouldAnimate
          ? "animate-in slide-in-from-bottom-5 fade-in"
          : "opacity-0 translate-y-5",
        isComplete && "ring-2 ring-offset-2",
        isComplete && colors.ring
      )}
      style={{
        animationDelay: shouldAnimate ? `${delay}ms` : undefined,
        animationDuration: "800ms",
        animationFillMode: "forwards",
      }}
    >
      {/* Effet de background animé */}
      <div
        className={cn(
          "absolute inset-0 opacity-10 transition-opacity duration-1000",
          colors.gradient,
          shouldAnimate && "opacity-20"
        )}
      />

      {/* Particules flottantes - adaptées pour la nouvelle disposition */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full opacity-40 animate-bounce",
              colors.gradient
            )}
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + i * 15}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.5 + i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <CardContent className="relative z-10 p-4 h-full flex items-center justify-center min-w-0">
        {/* Section droite : Nombre en grand */}
        <div className="flex-shrink-0 mr-4">
          <div
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-300 whitespace-nowrap flex items-center justify-center",
              colors.text,
              shouldAnimate && "animate-pulse"
            )}
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {count}
          </div>
        </div>
        {/* Section gauche : Icône et titre */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Titre */}
          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base font-semibold text-slate-700 leading-tight truncate">
              {statistic.label}
            </p>
          </div>
          {/* Icône */}
          <div
            className={cn(
              "text-2xl md:text-3xl transition-transform duration-500 flex-shrink-0",
              shouldAnimate && "animate-bounce"
            )}
          >
            {statistic.icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Données des statistiques - vous pouvez les modifier selon vos besoins
  const statistics: Statistic[] = [
    {
      label: "Partenaires",
      value: 25,
      color: "blue",
      icon: "👥",
    },
    {
      label: "Projets",
      value: 25,
      color: "blue",
      icon: "💡",
    },
    {
      label: "Étudiants accompagnés",
      value: 245,
      color: "red",
      icon: "🎓",
    },
    {
      label: "Mineurs non accompagnés aidés",
      value: 89,
      color: "yellow",
      icon: "🤝",
    },
    {
      label: "Hébergements d'urgence",
      value: 156,
      color: "green",
      icon: "🏠",
    },
    {
      label: "Évènements",
      value: 25,
      color: "red",
      icon: "🎉",
    },
    {
      label: "Nombre étudiants accompagnés",
      value: 25,
      color: "green",
      icon: "�",
    },
  ];

  // Intersection Observer pour déclencher l'animation quand la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden"
    >
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-theme-overlay opacity-30" />

      <div className="container mx-auto relative">
        {/* Titre de section */}
        <div className="text-center mb-12">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-4 transition-all duration-1000",
              "bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent",
              isVisible
                ? "animate-in slide-in-from-top-5 fade-in"
                : "opacity-0 -translate-y-5"
            )}
          >
            Nos Réalisations
          </h2>
          <p
            className={cn(
              "text-xl text-slate-600 max-w-2xl mx-auto transition-all duration-1000 delay-300",
              isVisible
                ? "animate-in slide-in-from-top-3 fade-in"
                : "opacity-0 -translate-y-3"
            )}
          >
            Découvrez l&apos;impact de GAM à Marseille et ses environs
          </p>
        </div>

        {/* Cartes statistiques avec largeur dynamique */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto">
          {statistics.map((stat, index) => (
            <div key={stat.label} className="min-w-0 flex-shrink-0">
              <StatisticCard
                statistic={stat}
                isVisible={isVisible}
                delay={index * 200}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

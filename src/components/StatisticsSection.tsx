"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/helpers/utils";
import { useCountUp } from "@/hooks/useCountUp";
import { SectionSplitHeading } from "@/components/section-split-heading";

interface Statistic {
  id?: string;
  label: string;
  value: number;
  color: "red" | "yellow" | "green" | "blue";
  icon: string;
  suffix?: string;
  order?: number;
  isActive?: boolean;
}

interface StatisticsSectionProps {
  statistics?: Statistic[];
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
        "relative w-full transform overflow-hidden border-2 transition-all duration-700",
        "h-auto gap-0 py-0",
        "sm:h-24 sm:gap-6 sm:py-6",
        "hover:scale-[1.02] hover:shadow-xl sm:hover:scale-105",
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

      {/* Particules flottantes */}
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

      <CardContent className="relative z-10 grid w-full min-w-0 grid-cols-[3rem_1fr_auto] items-center gap-x-2.5 px-3.5 py-3 sm:flex sm:h-full sm:items-center sm:justify-center sm:gap-0 sm:p-4">
        <div className="shrink-0 sm:mr-4">
          <div
            className={cn(
              "whitespace-nowrap text-2xl font-extrabold tabular-nums transition-all duration-300 sm:text-3xl sm:font-bold md:text-4xl lg:text-5xl",
              colors.text,
              shouldAnimate && "animate-pulse",
            )}
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {count}
          </div>
        </div>

        <p className="min-w-0 text-[15px] font-semibold leading-[1.35] text-slate-800 break-words sm:flex-1 sm:text-sm sm:leading-tight sm:text-slate-700 md:text-base sm:truncate">
          {statistic.label}
        </p>

        <div
          className={cn(
            "shrink-0 text-xl leading-none transition-transform duration-500 sm:ml-3 sm:text-2xl md:text-3xl",
            shouldAnimate && "animate-bounce",
          )}
          aria-hidden
        >
          {statistic.icon}
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsSection = ({ statistics = [] }: StatisticsSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    const el = sectionRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  if (statistics.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden"
    >
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-theme-overlay opacity-30" />

      <div className="container mx-auto relative">
        {/* Titre de section */}
        <div className="text-center mb-8 md:mb-10">
          <SectionSplitHeading
            showAmbient={false}
            title="Nos Réalisations"
            tone="stats"
          />
          <p
            className={cn(
              "mx-auto mt-3 max-w-2xl px-1 text-[15px] leading-7 text-slate-600 transition-all duration-1000 delay-300 sm:mt-4 sm:px-0 sm:text-xl",
              isVisible
                ? "animate-in slide-in-from-top-3 fade-in"
                : "opacity-0 -translate-y-3"
            )}
          >
            Découvrez l&apos;impact de GAM à Marseille et ses environs
          </p>
        </div>

        {/* Cartes statistiques */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4 md:gap-6 lg:gap-5">
          {statistics.map((stat, index) => (
            <div
              key={stat.id ?? stat.label}
              className="min-w-0 w-full sm:w-auto sm:shrink-0"
            >
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

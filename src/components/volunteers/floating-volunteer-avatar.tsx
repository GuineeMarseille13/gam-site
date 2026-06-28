"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/helpers/utils";
import type { Volunteer } from "@/app/_services/home";
import {
  resolveVolunteerTooltipPlacement,
  volunteerTooltipArrowClasses,
  volunteerTooltipPositionClasses,
  type VolunteerTooltipPlacement,
} from "@/components/volunteers/volunteer-tooltip-placement";

interface FloatingVolunteer extends Volunteer {
  x: number;
  y: number;
  scale: number;
  animationDelay: number;
  opacity: number;
}

interface FloatingVolunteerAvatarProps {
  volunteer: FloatingVolunteer;
  index: number;
  boundaryRef: React.RefObject<HTMLDivElement | null>;
  prefersHoverTooltip: boolean;
  isTooltipOpen: boolean;
  onTap: (volunteerId: string) => void;
}

/**
 * Avatar flottant avec tooltip positionné dynamiquement selon l'espace disponible.
 */
export function FloatingVolunteerAvatar({
  volunteer,
  index,
  boundaryRef,
  prefersHoverTooltip,
  isTooltipOpen,
  onTap,
}: FloatingVolunteerAvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<VolunteerTooltipPlacement>("bottom");
  const [isHovered, setIsHovered] = useState(false);

  const isTooltipVisible = prefersHoverTooltip ? isHovered : isTooltipOpen;

  const updatePlacement = useCallback(() => {
    const avatarEl = avatarRef.current;
    const tooltipEl = tooltipRef.current;
    if (!avatarEl) return;

    const avatarRect = avatarEl.getBoundingClientRect();
    const tooltipWidth = tooltipEl?.offsetWidth || undefined;
    const tooltipHeight = tooltipEl?.offsetHeight || undefined;

    setPlacement(
      resolveVolunteerTooltipPlacement(
        avatarRect,
        boundaryRef.current,
        tooltipWidth,
        tooltipHeight,
      ),
    );
  }, [boundaryRef]);

  useEffect(() => {
    if (!isTooltipVisible) return;

    updatePlacement();
    const frame = requestAnimationFrame(updatePlacement);

    const handleResize = () => updatePlacement();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [isTooltipVisible, updatePlacement, volunteer.name, volunteer.role]);

  const handleMouseEnter = useCallback(() => {
    if (!prefersHoverTooltip) return;
    setIsHovered(true);
    updatePlacement();
  }, [prefersHoverTooltip, updatePlacement]);

  const handleMouseLeave = useCallback(() => {
    if (!prefersHoverTooltip) return;
    setIsHovered(false);
  }, [prefersHoverTooltip]);

  const handleClick = useCallback(() => {
    onTap(volunteer.id);
  }, [onTap, volunteer.id]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (prefersHoverTooltip) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onTap(volunteer.id);
    },
    [onTap, prefersHoverTooltip, volunteer.id],
  );

  return (
    <div
      className={cn(
        "absolute z-10 transition-none",
        prefersHoverTooltip && "hover:z-[100]",
        isTooltipVisible && "z-[100]",
      )}
      style={{
        left: `${volunteer.x}px`,
        top: `${volunteer.y}px`,
        transform: `scale(${volunteer.scale})`,
        opacity: volunteer.opacity,
        animationDelay: `${volunteer.animationDelay}ms`,
      }}
    >
      <div
        ref={avatarRef}
        data-volunteer-avatar
        className="relative group cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role={prefersHoverTooltip ? undefined : "button"}
        tabIndex={prefersHoverTooltip ? undefined : 0}
        aria-expanded={prefersHoverTooltip ? undefined : isTooltipOpen}
        aria-label={
          prefersHoverTooltip
            ? undefined
            : `Afficher les informations de ${volunteer.name}`
        }
      >
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-theme-red/20 via-theme-yellow/20 to-theme-green/20 opacity-70 blur-xl transition-opacity duration-500 animate-pulse group-hover:opacity-100" />
        <div
          className="absolute -inset-3 rounded-full bg-gradient-to-r from-theme-green/15 via-theme-blue/15 to-theme-red/15 opacity-50 blur-lg transition-opacity duration-500 group-hover:opacity-80"
          style={{ animationDelay: `${index * 0.5}s` }}
        />
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-theme-yellow/25 via-theme-red/25 to-theme-green/25 opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-90" />

        <Avatar className="relative z-10 h-16 w-16 border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
          <AvatarImage
            src={volunteer.image}
            alt={volunteer.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-theme-red to-theme-yellow text-lg font-bold text-white">
            {volunteer.initials}
          </AvatarFallback>
        </Avatar>

        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-[110] opacity-0 pointer-events-none transition-opacity duration-300",
            volunteerTooltipPositionClasses[placement],
            isTooltipVisible && "opacity-100",
          )}
        >
          <div className="w-[14rem] rounded-xl border border-theme-yellow/30 bg-gradient-to-r from-gray-900 to-black px-4 py-3 text-center text-sm leading-snug text-white shadow-2xl">
            <div className="font-bold text-theme-yellow">{volunteer.name}</div>
            {volunteer.role ? (
              <div className="mt-1 text-xs text-gray-300">{volunteer.role}</div>
            ) : null}
            <div
              className={cn(
                "absolute h-0 w-0",
                volunteerTooltipArrowClasses[placement],
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

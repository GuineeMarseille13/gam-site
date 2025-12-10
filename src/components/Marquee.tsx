"use client";
import React, { ComponentPropsWithoutRef, useRef, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;

  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * If true, automatically repeats children enough to fill the visible area
   */
  autoFill?: boolean;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
  /**
   * ARIA live region politeness
   */
  ariaLive?: "off" | "polite" | "assertive";
  /**
   * ARIA role
   */
  ariaRole?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = "off",
  ariaRole = "marquee",
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPausedOnTouch, setIsPausedOnTouch] = useState(false);
  // Générer un ID unique pour cette instance de Marquee pour garantir l'unicité des clés
  const marqueeId = useId();

  // Gestionnaires d'événements tactiles pour mobile
  const handleTouchStart = () => {
    if (pauseOnHover) {
      setIsPausedOnTouch(true);
    }
  };

  const handleTouchEnd = () => {
    if (pauseOnHover) {
      setIsPausedOnTouch(false);
    }
  };

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {React.useMemo(
        () => (
          <>
            {Array.from({ length: repeat }, (_, i) => (
              <div
                key={`marquee-repeat-${i}`}
                className={cn(
                  !vertical
                    ? "flex-row [gap:var(--gap)]"
                    : "flex-col [gap:var(--gap)]",
                  "flex shrink-0 justify-around",
                  !vertical && "animate-marquee flex-row",
                  vertical && "animate-marquee-vertical flex-col",
                  pauseOnHover && "group-hover:[animation-play-state:paused]",
                  reverse && "[animation-direction:reverse]",
                  // Pause sur mobile au toucher
                  isPausedOnTouch && "[animation-play-state:paused]"
                )}
              >
                {React.Children.map(children, (child, childIndex) => {
                  // Générer une clé complètement unique basée sur:
                  // - L'ID unique de cette instance de Marquee
                  // - L'index de répétition (i)
                  // - L'index de l'enfant (childIndex)
                  // Ne pas utiliser child.key pour éviter les conflits
                  const uniqueKey = `${marqueeId}-repeat-${i}-child-${childIndex}`;
                  
                  if (React.isValidElement(child)) {
                    // Cloner l'élément avec une nouvelle clé unique
                    return React.cloneElement(child, {
                      key: uniqueKey,
                    } as any);
                  }
                  // Pour les enfants non-éléments React, utiliser un Fragment avec une clé unique
                  return <React.Fragment key={uniqueKey}>{child}</React.Fragment>;
                })}
              </div>
            ))}
          </>
        ),
        [repeat, children, vertical, pauseOnHover, reverse, isPausedOnTouch, marqueeId]
      )}
    </div>
  );
}

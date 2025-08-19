"use client";

import { useState, useEffect, useRef } from "react";

interface UseCountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  easing?: (t: number) => number;
  onComplete?: () => void;
  trigger?: boolean;
}

// Fonction d'easing pour une animation plus fluide
const easeOutQuart = (t: number): number => 1 - --t * t * t * t;

export function useCountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  easing = easeOutQuart,
  onComplete,
  trigger = true,
}: UseCountUpProps) {
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setCount(start);
      setIsComplete(false);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easing(progress);
      const currentCount = start + (end - start) * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = 0;
    };
  }, [end, start, duration, easing, onComplete, trigger]);

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return {
    count: formattedCount,
    rawCount: count,
    isComplete,
  };
}

"use client";

import { useState, useCallback } from 'react';

interface UseFloatingElementsProps {
  elements: string[];
  autoStart?: boolean;
  interval?: number;
  maxElements?: number;
}

export function useFloatingElements({
  elements,
  autoStart = true,
  interval = 2000,
  maxElements = 5
}: UseFloatingElementsProps) {
  const [isActive, setIsActive] = useState(autoStart);

  const startAnimation = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopAnimation = useCallback(() => {
    setIsActive(false);
  }, []);

  const toggleAnimation = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  return {
    isActive,
    startAnimation,
    stopAnimation,
    toggleAnimation,
    elements,
    interval,
    maxElements
  };
}

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseCarouselProps {
  itemCount: number;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

export function useCarousel({ 
  itemCount, 
  autoPlay = false, 
  interval = 5000,
  loop = true 
}: UseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef<NodeJS.Timeout>();

  const next = useCallback(() => {
    setCurrentIndex(prev => {
      if (loop) {
        return (prev + 1) % itemCount;
      }
      return prev < itemCount - 1 ? prev + 1 : prev;
    });
  }, [itemCount, loop]);

  const previous = useCallback(() => {
    setCurrentIndex(prev => {
      if (loop) {
        return (prev - 1 + itemCount) % itemCount;
      }
      return prev > 0 ? prev - 1 : prev;
    });
  }, [itemCount, loop]);

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < itemCount) {
      setCurrentIndex(index);
    }
  }, [itemCount]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggle = () => setIsPlaying(prev => !prev);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (isPlaying && itemCount > 1) {
      timerRef.current = setInterval(next, interval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, interval, next, itemCount]);

  return {
    currentIndex,
    isPlaying,
    next,
    previous,
    goTo,
    play,
    pause,
    toggle,
    canGoNext: loop || currentIndex < itemCount - 1,
    canGoPrevious: loop || currentIndex > 0,
  };
}

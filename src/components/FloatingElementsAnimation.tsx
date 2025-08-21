"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface FloatingElement {
  id: number;
  content: string;
  x: number;
  y: number;
  animationDelay: number;
  scale: number;
  rotation: number;
  animationType: 'bloom' | 'bounce' | 'spin' | 'fade';
  color?: string;
}

interface FloatingElementsAnimationProps {
  elements: string[];
  interval?: number;
  maxElements?: number;
  elementSize?: 'sm' | 'md' | 'lg' | 'xl';
  animationDuration?: number;
  animationTypes?: ('bloom' | 'bounce' | 'spin' | 'fade')[];
  colors?: string[];
  enableGlow?: boolean;
  enableParticles?: boolean;
  className?: string;
  isActive?: boolean;
}

export default function FloatingElementsAnimation({
  elements,
  interval = 2000,
  maxElements = 5,
  elementSize = 'md',
  animationDuration = 4000,
  animationTypes = ['bloom', 'bounce'],
  colors = [],
  enableGlow = true,
  enableParticles = false,
  className = '',
  isActive = true
}: FloatingElementsAnimationProps) {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [elementId, setElementId] = useState(0);

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  const getRandomPosition = useCallback(() => {
    const margin = 100;
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    return {
      x: Math.random() * (maxWidth - margin * 2) + margin,
      y: Math.random() * (maxHeight - margin * 2) + margin
    };
  }, []);

  const createFloatingElement = useCallback(() => {
    if (elements.length === 0 || !isActive) return;

    const position = getRandomPosition();
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    const randomAnimationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const randomColor = colors.length > 0 ? colors[Math.floor(Math.random() * colors.length)] : undefined;
    
    const newElement: FloatingElement = {
      id: elementId,
      content: randomElement,
      x: position.x,
      y: position.y,
      animationDelay: 0,
      scale: 0.8 + Math.random() * 0.4,
      rotation: Math.random() * 360,
      animationType: randomAnimationType,
      color: randomColor
    };

    setFloatingElements(prev => {
      const updated = [...prev, newElement];
      return updated.slice(-maxElements);
    });

    setElementId(prev => prev + 1);

    setTimeout(() => {
      setFloatingElements(prev => prev.filter(el => el.id !== newElement.id));
    }, animationDuration);
  }, [elements, elementId, getRandomPosition, maxElements, animationDuration, animationTypes, colors, isActive]);

  useEffect(() => {
    if (elements.length === 0 || !isActive) return;

    const intervalRef = setInterval(createFloatingElement, interval);
    return () => clearInterval(intervalRef);
  }, [createFloatingElement, interval, elements.length, isActive]);

  useEffect(() => {
    const handleResize = () => {
      setFloatingElements([]);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getAnimationClass = (animationType: string) => {
    switch (animationType) {
      case 'bloom': return 'animate-float-bloom';
      case 'bounce': return 'animate-float-bounce';
      case 'spin': return 'animate-float-spin';
      case 'fade': return 'animate-float-fade';
      default: return 'animate-float-bloom';
    }
  };

  if (!isActive) return null;

  return (
    <>
      <div className={`fixed inset-0 pointer-events-none z-10 overflow-hidden ${className}`}>
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`
              absolute select-none pointer-events-none
              ${sizeClasses[elementSize]}
              ${getAnimationClass(element.animationType)}
              ${enableGlow ? 'filter drop-shadow-2xl' : 'filter drop-shadow-lg'}
            `}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              transform: `translate(-50%, -50%) scale(${element.scale}) rotate(${element.rotation}deg)`,
              animationDuration: `${animationDuration}ms`,
              animationDelay: `${element.animationDelay}ms`,
              animationFillMode: 'both',
              color: element.color || 'inherit',
              textShadow: enableGlow ? '0 0 20px currentColor' : 'none'
            }}
          >
            <div className="relative">
              {element.content}
              {enableParticles && (
                <div className="absolute inset-0 animate-ping opacity-30">
                  {element.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float-bloom {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            filter: blur(10px) brightness(2) saturate(2);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.3) rotate(180deg);
            filter: blur(0px) brightness(1.8) saturate(1.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            filter: blur(0px) brightness(1) saturate(1);
          }
          85% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.9) rotate(540deg);
            filter: blur(1px) brightness(0.9) saturate(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(720deg);
            filter: blur(8px) brightness(0.5) saturate(0.5);
          }
        }

        @keyframes float-bounce {
          0% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          30% {
            transform: translate(-50%, -30%) scale(1);
          }
          45% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          60% {
            transform: translate(-50%, -40%) scale(1);
          }
          75% {
            transform: translate(-50%, -50%) scale(1.05);
          }
          90% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 50%) scale(0);
          }
        }

        @keyframes float-spin {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(720deg);
          }
          80% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.8) rotate(1080deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(1440deg);
          }
        }

        @keyframes float-fade {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
            filter: blur(5px);
          }
          25% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
            filter: blur(0px);
          }
          75% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
            filter: blur(5px);
          }
        }

        .animate-float-bloom {
          animation: float-bloom ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-float-bounce {
          animation: float-bounce ${animationDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-float-spin {
          animation: float-spin ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-float-fade {
          animation: float-fade ${animationDuration}ms ease-in-out forwards;
        }
      `}</style>
    </>
  );
}

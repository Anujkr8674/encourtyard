'use client';

import React, { useRef, useEffect, useState } from 'react';

export type AnimationType =
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'flip-up'
  | 'zoom-in'
  | 'expand-y'
  | 'blur-in'
  | 'glide-up'
  | 'cinematic-reveal'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds (slowed down for cinematic luxury feel)
  threshold?: number; // 0 to 1
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 1200,
  threshold = 0.08,
  className = '',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, once]);

  // Style generators for distinct, rich transitions
  const getInitialStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'slide-left':
        return {
          opacity: 0,
          transform: 'translateX(-70px) rotate(-1.5deg)',
        };
      case 'slide-right':
        return {
          opacity: 0,
          transform: 'translateX(70px) rotate(1.5deg)',
        };
      case 'scale-up':
        return {
          opacity: 0,
          transform: 'scale(0.88) translateY(45px)',
        };
      case 'flip-up':
        return {
          opacity: 0,
          transform: 'perspective(1200px) rotateX(18deg) translateY(55px)',
          transformOrigin: 'bottom center',
        };
      case 'zoom-in':
        return {
          opacity: 0,
          filter: 'blur(6px)',
          transform: 'scale(0.85) translateY(25px)',
        };
      case 'expand-y':
        return {
          opacity: 0,
          transform: 'scaleY(0.88) translateY(50px)',
          transformOrigin: 'top center',
        };
      case 'blur-in':
        return {
          opacity: 0,
          filter: 'blur(16px)',
          transform: 'scale(0.94) translateY(35px)',
        };
      case 'glide-up':
        return {
          opacity: 0,
          transform: 'translateY(60px) skewY(1.5deg)',
        };
      case 'cinematic-reveal':
        return {
          opacity: 0,
          filter: 'brightness(0.65) blur(6px)',
          transform: 'scale(0.90) translateY(50px)',
        };
      case 'fade-down':
        return {
          opacity: 0,
          transform: 'translateY(-50px)',
        };
      case 'fade-left':
        return {
          opacity: 0,
          transform: 'translateX(50px)',
        };
      case 'fade-right':
        return {
          opacity: 0,
          transform: 'translateX(-50px)',
        };
      case 'fade-up':
      default:
        return {
          opacity: 0,
          transform: 'translateY(55px)',
        };
    }
  };

  const getVisibleStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'flip-up':
        return {
          opacity: 1,
          transform: 'perspective(1200px) rotateX(0deg) translateY(0px)',
          transformOrigin: 'bottom center',
        };
      case 'expand-y':
        return {
          opacity: 1,
          transform: 'scaleY(1) translateY(0px)',
          transformOrigin: 'top center',
        };
      case 'zoom-in':
      case 'blur-in':
        return {
          opacity: 1,
          filter: 'blur(0px)',
          transform: 'scale(1) translateY(0px)',
        };
      case 'cinematic-reveal':
        return {
          opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transform: 'scale(1) translateY(0px)',
        };
      default:
        return {
          opacity: 1,
          transform: 'translateX(0px) translateY(0px) rotate(0deg) skewY(0deg) scale(1)',
        };
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity, filter',
        ...(isVisible ? getVisibleStyle() : getInitialStyle()),
      }}
      className={`transition-all ${className}`}
    >
      {children}
    </div>
  );
};


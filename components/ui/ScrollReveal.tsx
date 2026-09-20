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
  | 'marquee-curtain'
  | 'botanical-bloom'
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
          transform: 'translate3d(-35px, 0, 0) rotate(-1deg)',
        };
      case 'slide-right':
        return {
          opacity: 0,
          transform: 'translate3d(35px, 0, 0) rotate(1deg)',
        };
      case 'scale-up':
        return {
          opacity: 0,
          transform: 'scale(0.92) translate3d(0, 35px, 0)',
        };
      case 'flip-up':
        return {
          opacity: 0,
          transform: 'perspective(1200px) rotateX(12deg) translate3d(0, 40px, 0)',
          transformOrigin: 'bottom center',
        };
      case 'zoom-in':
        return {
          opacity: 0,
          filter: 'blur(6px)',
          transform: 'scale(0.90) translate3d(0, 20px, 0)',
        };
      case 'expand-y':
        return {
          opacity: 0,
          transform: 'scaleY(0.92) translate3d(0, 35px, 0)',
          transformOrigin: 'top center',
        };
      case 'blur-in':
        return {
          opacity: 0,
          filter: 'blur(12px)',
          transform: 'scale(0.95) translate3d(0, 25px, 0)',
        };
      case 'glide-up':
        return {
          opacity: 0,
          transform: 'translate3d(0, 45px, 0) skewY(1deg)',
        };
      case 'cinematic-reveal':
        return {
          opacity: 0,
          filter: 'brightness(0.7) blur(6px)',
          transform: 'scale(0.92) translate3d(0, 35px, 0)',
        };
      case 'marquee-curtain':
        return {
          opacity: 0,
          transform: 'scaleY(0.7) translate3d(0, -25px, 0)',
          filter: 'blur(6px)',
          transformOrigin: 'center top',
        };
      case 'botanical-bloom':
        return {
          opacity: 0,
          filter: 'blur(12px) saturate(70%)',
          transform: 'perspective(1400px) rotateX(10deg) rotateY(-3deg) scale(0.92) translate3d(0, 50px, 0)',
          transformOrigin: 'center top',
        };
      case 'fade-down':
        return {
          opacity: 0,
          transform: 'translate3d(0, -35px, 0)',
        };
      case 'fade-left':
        return {
          opacity: 0,
          transform: 'translate3d(35px, 0, 0)',
        };
      case 'fade-right':
        return {
          opacity: 0,
          transform: 'translate3d(-35px, 0, 0)',
        };
      case 'fade-up':
      default:
        return {
          opacity: 0,
          transform: 'translate3d(0, 40px, 0)',
        };
    }
  };

  const getVisibleStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'flip-up':
        return {
          opacity: 1,
          transform: 'perspective(1200px) rotateX(0deg) translate3d(0, 0, 0)',
          transformOrigin: 'bottom center',
        };
      case 'expand-y':
        return {
          opacity: 1,
          transform: 'scaleY(1) translate3d(0, 0, 0)',
          transformOrigin: 'top center',
        };
      case 'zoom-in':
      case 'blur-in':
        return {
          opacity: 1,
          filter: 'blur(0px)',
          transform: 'scale(1) translate3d(0, 0, 0)',
        };
      case 'cinematic-reveal':
        return {
          opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transform: 'scale(1) translate3d(0, 0, 0)',
        };
      case 'marquee-curtain':
        return {
          opacity: 1,
          transform: 'scaleY(1) translate3d(0, 0, 0)',
          filter: 'blur(0px)',
          transformOrigin: 'center top',
        };
      case 'botanical-bloom':
        return {
          opacity: 1,
          filter: 'blur(0px) saturate(100%)',
          transform: 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1) translate3d(0, 0, 0)',
          transformOrigin: 'center top',
        };
      default:
        return {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) rotate(0deg) skewY(0deg) scale(1)',
        };
    }
  };

  const combinedClassName = className && className.trim()
    ? `transition-all w-full max-w-full ${className.trim()}`
    : 'transition-all w-full max-w-full';

  return (
    <div className="w-full max-w-full overflow-x-clip">
      <div
        ref={elementRef}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform, opacity, filter',
          ...(isVisible ? getVisibleStyle() : getInitialStyle()),
        }}
        className={combinedClassName}
      >
        {children}
      </div>
    </div>
  );
};


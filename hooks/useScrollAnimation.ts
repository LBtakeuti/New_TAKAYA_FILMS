'use client';

import { useState, useEffect } from 'react';

interface ScrollAnimation {
  scrollY: number;
  scrollProgress: number;
  isScrolling: boolean;
}

export const useScrollAnimation = (): ScrollAnimation => {
  const [scrollData, setScrollData] = useState<ScrollAnimation>({
    scrollY: 0,
    scrollProgress: 0,
    isScrolling: false
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateScrollData = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = documentHeight > 0 ? scrollY / documentHeight : 0;

      setScrollData({
        scrollY,
        scrollProgress,
        isScrolling: true
      });

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrollData(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    window.addEventListener('scroll', updateScrollData, { passive: true });
    updateScrollData(); // Initial call

    return () => {
      window.removeEventListener('scroll', updateScrollData);
      clearTimeout(timeoutId);
    };
  }, []);

  return scrollData;
};
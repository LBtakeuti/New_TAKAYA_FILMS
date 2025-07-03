'use client';

import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  isMoving: boolean;
}

export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isMoving: false
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
        isMoving: true
      });

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMousePosition(prev => ({ ...prev, isMoving: false }));
      }, 100);
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearTimeout(timeoutId);
    };
  }, []);

  return mousePosition;
};
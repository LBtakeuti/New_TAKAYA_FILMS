import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  scrollProgress, 
  mouseX, 
  mouseY 
}) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!backgroundRef.current) return;

    const element = backgroundRef.current;
    const mouseInfluence = 0.02;
    const scrollInfluence = 100;

    // Mouse-based transform
    const mouseTransformX = (mouseX - window.innerWidth / 2) * mouseInfluence;
    const mouseTransformY = (mouseY - window.innerHeight / 2) * mouseInfluence;

    // Scroll-based transform
    const scrollTransformY = scrollProgress * scrollInfluence;

    element.style.transform = `
      translate3d(${mouseTransformX}px, ${mouseTransformY - scrollTransformY}px, 0)
      scale(${1 + scrollProgress * 0.1})
      rotate(${scrollProgress * 5}deg)
    `;

    element.style.opacity = String(1 - scrollProgress * 0.3);
  }, [scrollProgress, mouseX, mouseY]);

  return (
    <div
      ref={backgroundRef}
      style={{
        position: 'fixed',
        top: '-10%',
        left: '-10%',
        width: '120%',
        height: '120%',
        background: `
          radial-gradient(circle at 20% 20%, rgba(235, 225, 210, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(248, 243, 235, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(220, 200, 175, 0.18) 0%, transparent 50%),
          linear-gradient(135deg, rgba(252, 248, 240, 0.08) 0%, rgba(245, 235, 220, 0.12) 100%)
        `,
        filter: 'blur(0.5px)',
        zIndex: -1,
        transition: 'opacity 0.3s ease-out',
        willChange: 'transform, opacity'
      }}
    />
  );
};

export default AnimatedBackground;
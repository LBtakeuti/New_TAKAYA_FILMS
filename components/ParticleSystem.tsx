'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  mouseX: number;
  mouseY: number;
  isMouseMoving: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ mouseX, mouseY, isMouseMoving }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [
      'rgba(200, 185, 165, 0.6)',
      'rgba(220, 200, 175, 0.5)',
      'rgba(240, 235, 225, 0.7)',
      'rgba(180, 165, 145, 0.5)',
      'rgba(210, 195, 175, 0.4)'
    ];

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 100 + 50
    });

    const updateParticles = () => {
      particles.current = particles.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        particle.opacity = Math.max(0, particle.opacity - 0.008);
        particle.size = Math.max(0, particle.size - 0.02);
        
        return particle.life < particle.maxLife && particle.opacity > 0;
      });

      // Add new particles when mouse is moving (reduced)
      if (isMouseMoving && particles.current.length < 50) {
        const numNewParticles = Math.random() * 2 + 1;
        for (let i = 0; i < numNewParticles; i++) {
          particles.current.push(createParticle(
            mouseX + (Math.random() - 0.5) * 80,
            mouseY + (Math.random() - 0.5) * 80
          ));
        }
      }

      // Add ambient particles (reduced)
      if (Math.random() < 0.01 && particles.current.length < 25) {
        particles.current.push(createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw connections between nearby particles (simplified)
      if (particles.current.length < 30) {
        ctx.strokeStyle = 'rgba(200, 185, 165, 0.08)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.current.length; i++) {
          for (let j = i + 1; j < particles.current.length; j++) {
            const dx = particles.current[i].x - particles.current[j].x;
            const dy = particles.current[i].y - particles.current[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
              ctx.save();
              ctx.globalAlpha = (80 - distance) / 80 * 0.2;
              ctx.beginPath();
              ctx.moveTo(particles.current[i].x, particles.current[i].y);
              ctx.lineTo(particles.current[j].x, particles.current[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [mouseX, mouseY, isMouseMoving]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default ParticleSystem;
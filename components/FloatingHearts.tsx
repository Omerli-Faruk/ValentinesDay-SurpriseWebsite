import React, { useMemo } from 'react';

// --- Particle Config ---
const PARTICLE_COUNT = 50;

// SVG Shapes for atmospheric elements
const SHAPES = {
  petal: (color: string) => (
    <svg viewBox="0 0 30 30" style={{ width: '100%', height: '100%', fill: color, opacity: 0.7 }}>
      <path d="M15,0 C5,10 5,20 15,30 C25,20 25,10 15,0 Z" />
    </svg>
  ),
  leaf: (color: string) => (
    <svg viewBox="0 0 30 30" style={{ width: '100%', height: '100%', fill: color, opacity: 0.6 }}>
      <path d="M15,30 Q5,15 15,0 Q25,15 15,30 Z" />
    </svg>
  ),
  bokeh: (color: string) => (
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: color, opacity: 0.4, filter: 'blur(2px)' }} />
  )
};

export const FloatingHearts: React.FC = () => {

  // Generate static random data for particles on mount
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const type = Math.random() > 0.6 ? 'petal' : Math.random() > 0.8 ? 'leaf' : 'bokeh';

      // Random Colors
      const colors = type === 'leaf'
        ? ['#bbf7d0', '#86efac'] // Green tints
        : ['#fbcfe8', '#f9a8d4', '#fce7f3', '#fff']; // Pink/White tints

      const color = colors[Math.floor(Math.random() * colors.length)];

      // Random Sizes
      const size = Math.random() * 20 + 10; // 10px to 30px

      return {
        id: i,
        type,
        content: type === 'petal' ? SHAPES.petal(color) : type === 'leaf' ? SHAPES.leaf(color) : SHAPES.bokeh(color),
        left: Math.random() * 100, // 0-100vw
        duration: Math.random() * 15 + 15, // 15s - 30s slow float
        delay: -(Math.random() * 30), // NEGATIVE DELAY: Starts animation mid-way immediately
        scale: Math.random() * 0.5 + 0.5,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(110vh) rotate(0deg) translateX(0px);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            50% {
              transform: translateY(50vh) rotate(180deg) translateX(20px);
            }
            90% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-20vh) rotate(360deg) translateX(-20px);
              opacity: 0;
            }
          }
        `}
      </style>

      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0, // Position handled by keyframe starting point (110vh) mostly, but we anchor top 0
            width: `${p.type === 'bokeh' ? p.scale * 40 : p.scale * 25}px`,
            height: `${p.type === 'bokeh' ? p.scale * 40 : p.scale * 25}px`,
            animationName: 'floatUp',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            willChange: 'transform',
          }}
        >
          {p.content}
        </div>
      ))}
    </div>
  );
};
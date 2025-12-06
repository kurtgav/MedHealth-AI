'use client';

import { useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export function LightTrails() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.4 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.4 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  const background = useMotionTemplate`
    radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(77, 212, 232, 0.18), transparent 40%),
    radial-gradient(480px circle at ${smoothX}px ${smoothY}px, rgba(168, 85, 247, 0.14), transparent 45%),
    radial-gradient(320px circle at ${smoothX}px ${smoothY}px, rgba(236, 72, 153, 0.18), transparent 40%)
  `;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ background }}
    />
  );
}

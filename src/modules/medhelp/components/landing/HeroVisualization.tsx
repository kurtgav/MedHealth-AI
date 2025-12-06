'use client';

import { Suspense } from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { PCFSoftShadowMap } from 'three';

import { colors } from '../../constants/theme';
import { DNAHelix } from '../animations/DNAHelix';
import { ParticleField } from '../animations/ParticleField';

export function HeroVisualization() {
  const isClient = typeof window !== 'undefined';

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      {isClient ? (
        <Canvas gl={{ antialias: true }} shadows={{ enabled: true, type: PCFSoftShadowMap }}>
          <color attach="background" args={['#0a1628']} />
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 4]} intensity={2.2} color={colors.accentPink} />
          <pointLight position={[-4, -3, -2]} intensity={1.6} color={colors.accentPurple} />
          <Suspense fallback={null}>
            <ParticleField />
            <DNAHelix />
          </Suspense>
          <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={55} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.75} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1e2f4f] to-[#2a0f3a] opacity-80" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/4 via-transparent to-black/70" />
    </div>
  );
}

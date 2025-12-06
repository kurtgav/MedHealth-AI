'use client';

import { useMemo } from 'react';
import { Float, PointMaterial, Points } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute } from 'three';

const PARTICLE_COUNT = 200;

function createDeterministicRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) % 4294967296;
    return state / 4294967296 - 0.5;
  };
}

export function ParticleField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const nextRandom = createDeterministicRandom(1337);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      arr[i * 3] = nextRandom() * 6;
      arr[i * 3 + 1] = nextRandom() * 6;
      arr[i * 3 + 2] = nextRandom() * 6;
    }
    return arr;
  }, []);

  useFrame(({ clock, camera }) => {
    camera.position.z = 4.5 + Math.sin(clock.elapsedTime * 0.3) * 0.2;
  });

  return (
    <Float speed={0.6} rotationIntensity={0.6} floatIntensity={0.8}>
      <Points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <PointMaterial size={0.035} color="#4dd4e8" sizeAttenuation opacity={0.65} transparent depthWrite={false} />
      </Points>
    </Float>
  );
}

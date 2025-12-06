'use client';

import { useMemo, useRef } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

const SEGMENTS = 80;
const RADIUS = 0.6;
const SPACING = 0.14;

export function DNAHelix() {
  const groupRef = useRef<Group>(null);
  const pairs = useMemo(() => {
    return new Array(SEGMENTS).fill(null).map((_, i) => {
      const angle = i * 0.3;
      const y = (i - SEGMENTS / 2) * SPACING;
      const left = new Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
      const right = new Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS);
      return { left, right, angle, y };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {pairs.map((pair, idx) => (
        <group key={idx}>
          <mesh position={pair.left.toArray()}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#4dd4e8" emissive="#4dd4e8" emissiveIntensity={0.4} roughness={0.25} />
          </mesh>
          <mesh position={pair.right.toArray()}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.4} roughness={0.25} />
          </mesh>
          <mesh
            position={[(pair.left.x + pair.right.x) / 2, pair.y, (pair.left.z + pair.right.z) / 2]}
            rotation={[0, pair.angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.015, 0.015, RADIUS * 2, 12]} />
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.2} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

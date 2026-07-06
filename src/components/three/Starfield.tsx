import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { useMedia } from '@/hooks/useMedia';
import { particlesFragment, particlesVertex } from '@/three/shaders/cubeShader';

function ParticleField({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.ShaderMaterial>(null!);

  const { positions, randoms, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const r = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      r[i] = Math.random();
    }
    return {
      positions: pos,
      randoms: r,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30 },
        uColor: { value: new THREE.Color('#3b82f6') },
      },
    };
  }, [count]);

  const time = useRef(0);
  
  useFrame((state, delta) => {
    time.current += delta;
    if (mat.current) mat.current.uniforms.uTime.value = time.current;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
          count={randoms.length}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function StarfieldContents() {
  const isMobile = useMedia('(max-width: 768px)');
  return (
    <>
      <ParticleField count={isMobile ? 1200 : 3000} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export function StarfieldCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0.6, 0.4, 5.5], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <StarfieldContents />
      </Suspense>
    </Canvas>
  );
}

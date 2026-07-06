import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
// import { useNormalizedMouse } from '@/hooks/useMouse';
import { cubeFragment, cubeVertex } from '@/three/shaders/cubeShader';

function CodeCube() {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const light = useRef<THREE.PointLight>(null!);
  // const { rawX, rawY } = useNormalizedMouse();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#1e3a8a') },
      uColorB: { value: new THREE.Color('#22d3ee') },
      uColorRim: { value: new THREE.Color('#a5f3fc') },
    }),
    [],
  );

  useFrame((state) => {
  const t = state.clock.elapsedTime;

  if (mat.current) {
    mat.current.uniforms.uTime.value = t;
  }

  if (mesh.current) {
    mesh.current.rotation.y = t * 0.15;          // Main rotation
    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    mesh.current.rotation.z = Math.cos(t * 0.2) * 0.04;

    // Shifted right so hero text on the left remains readable
    mesh.current.position.x = 1.8;
    mesh.current.position.y = Math.sin(t * 0.6) * 0.05;
  }

  if (light.current) {
    light.current.position.set(1.8, 1.2, 2.2);
  }
});

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={mesh} castShadow receiveShadow>
          <boxGeometry args={[1.7, 1.7, 1.7, 8, 8, 8]} />
          <shaderMaterial
            ref={mat}
            vertexShader={cubeVertex}
            fragmentShader={cubeFragment}
            uniforms={uniforms}
          />
        </mesh>
      </Float>
      <pointLight ref={light} intensity={8} distance={7} color="#22d3ee" />
      <ContactShadows
        position={[1.8, -1.4, 0]}
        opacity={0.35}
        blur={2.5}
        far={3}
        scale={4}
        color="#000"
      />
    </group>
  );
}



function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={0.45} color="#ffffff" />
      <CodeCube />
      <Environment preset="night" />
      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.6}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.0006, 0.0006]} blendFunction={BlendFunction.NORMAL} />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.2} darkness={0.82} />
      </EffectComposer>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0.6, 0.4, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}


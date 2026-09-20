"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMedia";

type Pointer = { x: number; y: number };

function DistortedOrb({
  pointer,
  reduced,
}: {
  pointer: Pointer;
  reduced: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!mesh.current || !group.current) return;

    if (!reduced) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.12;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.18;
      group.current.rotation.x +=
        (pointer.y * 0.35 - group.current.rotation.x) * 0.05;
      group.current.rotation.y +=
        (pointer.x * 0.45 - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float
        speed={reduced ? 0 : 1.4}
        rotationIntensity={reduced ? 0 : 0.35}
        floatIntensity={reduced ? 0 : 0.6}
      >
        <Sphere ref={mesh} args={[1.15, 64, 64]} scale={1.05}>
          <MeshDistortMaterial
            color="#E44532"
            attach="material"
            distort={reduced ? 0.15 : 0.42}
            speed={reduced ? 0.4 : 1.6}
            roughness={0.32}
            metalness={0.42}
            emissive="#E44532"
            emissiveIntensity={0.12}
          />
        </Sphere>
        <WireRing />
      </Float>
    </group>
  );
}

function WireRing() {
  return (
    <mesh rotation={[Math.PI / 2.4, 0.3, 0.2]} scale={1.55}>
      <torusGeometry args={[1, 0.008, 16, 120]} />
      <meshBasicMaterial color="#1A1714" transparent opacity={0.28} />
    </mesh>
  );
}

function GridFloor() {
  const points = useMemo(() => {
    const pts: number[] = [];
    const size = 8;
    const step = 0.5;
    for (let i = -size; i <= size; i += step) {
      pts.push(-size, 0, i, size, 0, i);
      pts.push(i, 0, -size, i, 0, size);
    }
    return new Float32Array(pts);
  }, []);

  return (
    <lineSegments position={[0, -1.7, 0]} rotation={[0.12, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={points}
          count={points.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#1A1714" transparent opacity={0.14} />
    </lineSegments>
  );
}

type HeroSceneProps = {
  pointer: Pointer;
  scrollProgress: number;
};

function SceneContents({ pointer, scrollProgress, reduced }: HeroSceneProps & { reduced: boolean }) {
  const root = useRef<Group>(null);

  useFrame(() => {
    if (!root.current || reduced) return;
    root.current.position.y = scrollProgress * -0.85;
    root.current.rotation.z = scrollProgress * 0.35;
    root.current.scale.setScalar(1 - scrollProgress * 0.18);
  });

  return (
    <group ref={root}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 2]} intensity={1.15} color="#FFF6F0" />
      <pointLight position={[-3, 1, 2]} intensity={1.15} color="#E44532" />
      <DistortedOrb pointer={pointer} reduced={reduced} />
      <GridFloor />
    </group>
  );
}

export function HeroScene({ pointer, scrollProgress }: HeroSceneProps) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-mesh-hero"
      >
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/25 blur-3xl" />
        <div className="absolute left-[40%] top-[45%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-chalk/15" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <SceneContents
            pointer={pointer}
            scrollProgress={scrollProgress}
            reduced={reduced}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

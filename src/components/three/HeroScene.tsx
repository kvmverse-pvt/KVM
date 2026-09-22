"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import type { LineSegments } from "three";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMedia";

/**
 * Hero backdrop. The code cards used to live in here as WebGL slabs; they are
 * plain DOM now (see `@/components/ui/CodeCardStack`), so all this scene owns
 * is the perspective grid behind them.
 *
 * The grid material is unlit, so the scene needs no lights at all.
 */

function GridFloor({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const mesh = useRef<LineSegments>(null);

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

  useFrame(() => {
    const node = mesh.current;
    if (!node || reduced) return;
    // Read straight off the MotionValue - no React state, no re-render.
    node.position.y = -1.7 + progress.get() * 0.9;
  });

  return (
    <lineSegments ref={mesh} position={[0, -1.7, 0]} rotation={[0.12, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={points}
          count={points.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#1A1714" transparent opacity={0.12} />
    </lineSegments>
  );
}

type HeroSceneProps = {
  /** 0 at the top of the hero, 1 once it has scrolled out. */
  progress: MotionValue<number>;
};

export function HeroScene({ progress }: HeroSceneProps) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // No WebGL on phones - the gradient alone carries the backdrop there.
  if (isMobile) {
    return <div aria-hidden className="absolute inset-0 bg-mesh-hero" />;
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
          <GridFloor progress={progress} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}

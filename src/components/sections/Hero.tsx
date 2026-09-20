"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { HERO_HEADLINES, SITE } from "@/lib/constants";
import { LinkButton } from "@/components/ui/Button";

const HeroScene = dynamic(
  () =>
    import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-mesh-hero" /> },
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, reduced ? 1 : 0],
  );
  const sceneProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${springX}% ${springY}%, rgba(228,69,50,0.12), transparent 45%)`;

  const headline = HERO_HEADLINES[0];

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
      onMouseMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        pointerX.set(x);
        pointerY.set(y);
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: glow }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 bg-mesh-hero"
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[min(52%,42rem)] max-md:w-full"
        style={{ opacity: contentOpacity }}
      >
        <HeroSceneBridge
          springX={springX}
          springY={springY}
          sceneProgress={sceneProgress}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-site items-center px-5 pb-20 pt-28 md:px-8 lg:px-12"
      >
        <div className="flex w-full max-w-2xl flex-col justify-center lg:max-w-[40rem] xl:max-w-[44rem]">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-coral"
          >
            {SITE.name}
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-display-xl text-chalk text-balance"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-chalk-muted"
          >
            A small studio building websites, apps, and products that people
            actually remember — for founders who refuse bland.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <LinkButton href="#contact">Start a project</LinkButton>
            <LinkButton href="#work" variant="outline">
              See the work
              <ArrowDownRight size={16} aria-hidden />
            </LinkButton>
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-5 z-10 hidden text-xs uppercase tracking-[0.2em] text-chalk-dim md:left-8 md:block lg:left-12">
        Scroll
      </div>
    </section>
  );
}

function HeroSceneBridge({
  springX,
  springY,
  sceneProgress,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  sceneProgress: MotionValue<number>;
}) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubX = springX.on("change", (x) => {
      setPointer((p) => ({ ...p, x: (x - 50) / 50 }));
    });
    const unsubY = springY.on("change", (y) => {
      setPointer((p) => ({ ...p, y: (y - 50) / 50 }));
    });
    const unsubP = sceneProgress.on("change", setProgress);
    return () => {
      unsubX();
      unsubY();
      unsubP();
    };
  }, [sceneProgress, springX, springY]);

  return <HeroScene pointer={pointer} scrollProgress={progress} />;
}

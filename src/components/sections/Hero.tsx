"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { HERO_HEADLINES, SITE } from "@/lib/constants";
import { LinkButton } from "@/components/ui/Button";
import { CodeCardStack } from "@/components/ui/CodeCardStack";

const HeroScene = dynamic(
  () =>
    import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-mesh-hero" /> },
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // Percentages of the hero box; start centred so the scene is level before
  // the first mouse move.
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
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
        className="pointer-events-none absolute inset-0 z-0"
        style={{ opacity: contentOpacity }}
      >
        {/* scrollYProgress goes straight into the scene; it reads it with
            .get() inside useFrame, so the Canvas never re-renders on scroll. */}
        <HeroScene progress={scrollYProgress} />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-site grid-cols-1 items-center gap-12 px-5 pb-20 pt-28 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:px-12">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="flex w-full max-w-2xl flex-col justify-center lg:max-w-[40rem] xl:max-w-[44rem]"
        >
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
        </motion.div>

        {/* Decorative, pure DOM. Below the copy on phones, beside it from lg. */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="flex justify-center lg:justify-end"
        >
          <CodeCardStack
            progress={scrollYProgress}
            pointerX={springX}
            pointerY={springY}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-5 z-10 hidden text-xs uppercase tracking-[0.2em] text-chalk-dim md:left-8 md:block lg:left-12">
        Scroll
      </div>
    </section>
  );
}

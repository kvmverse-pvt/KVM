"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import { ExhibitionCard } from "./ExhibitionCard";
import {
  NAV_OFFSET_PX,
  STAGE_BAR_PX,
  easeOut,
  getTimeline,
  inertProps,
  padIndex,
  span,
} from "./timeline";

const COUNT = PROJECTS.length;
const TRACK_HEIGHT = `${COUNT * 130 + 60}vh`;

/**
 * Desktop scroll exhibition: a tall track with a pinned stage. Every animated
 * value is derived from one smoothed progress motion value; React state only
 * changes when the active project (or the outro) changes.
 */
export function WorkExhibition() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const { segment, outroStart } = getTimeline(COUNT);

  // Active card flips halfway through the next card's rise.
  const phaseFor = (v: number) =>
    v >= outroStart + (1 - outroStart) * 0.35
      ? COUNT
      : Math.min(COUNT - 1, Math.max(0, Math.floor(v / segment - 0.15)));

  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);
  const syncPhase = (v: number) => {
    const next = phaseFor(v);
    if (next === phaseRef.current) return;
    phaseRef.current = next;
    setPhase(next);
  };
  useMotionValueEvent(progress, "change", syncPhase);
  useEffect(() => {
    syncPhase(progress.get());
    // Initial sync only; subsequent updates arrive through the event above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inOutro = phase === COUNT;
  const activeIndex = Math.min(phase, COUNT - 1);

  const outroT = (v: number) =>
    span((v - outroStart) / (1 - outroStart), 0.5, 0.9, easeOut);
  const outroOpacity = useTransform(progress, outroT);
  const outroY = useTransform(progress, (v) => 20 * (1 - outroT(v)));

  return (
    <div ref={trackRef} className="relative mt-16" style={{ height: TRACK_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-x-0 z-20"
          style={{ top: NAV_OFFSET_PX, height: STAGE_BAR_PX }}
        >
          <div className="site-wrap flex h-full items-center gap-8">
            <a
              href="#team"
              className="focus-ring shrink-0 rounded-sm text-sm text-chalk-muted transition-colors hover:text-chalk"
            >
              Skip the showcase
            </a>

            <div className="relative mx-auto h-[2px] w-full max-w-md overflow-hidden rounded-full bg-ink-300">
              <motion.div
                className="absolute inset-0 origin-left bg-coral"
                style={{ scaleX: progress }}
                aria-hidden
              />
            </div>

            <p
              className="shrink-0 font-display text-sm tabular-nums text-chalk"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="sr-only">
                Project {activeIndex + 1} of {COUNT}:{" "}
                {PROJECTS[activeIndex].title}
              </span>
              <span className="inline-flex items-baseline gap-1.5" aria-hidden>
                <span className="relative inline-block overflow-hidden leading-[1.25]">
                  <span className="invisible">{padIndex(activeIndex + 1)}</span>
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={activeIndex}
                      className="absolute inset-0"
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {padIndex(activeIndex + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-chalk-dim">/</span>
                <span className="text-chalk-dim">{padIndex(COUNT)}</span>
              </span>
            </p>
          </div>
        </div>

        <ul className="absolute inset-0">
          {PROJECTS.map((project, index) => (
            <ExhibitionCard
              key={project.title}
              project={project}
              index={index}
              count={COUNT}
              progress={progress}
              segment={segment}
              outroStart={outroStart}
              interactive={!inOutro && index === activeIndex}
            />
          ))}
        </ul>

        <motion.div
          className="absolute inset-x-0 bottom-[12%] z-20 flex justify-center"
          style={{ opacity: outroOpacity, y: outroY }}
          {...inertProps(!inOutro)}
        >
          <a
            href="#contact"
            tabIndex={inOutro ? undefined : -1}
            className="focus-ring rounded-sm font-display text-2xl tracking-tight text-chalk underline decoration-coral decoration-2 underline-offset-8 transition-colors hover:text-coral lg:text-3xl"
          >
            View all work
          </a>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/cn";
import { PROCESS_STEPS } from "@/lib/constants";
import { useFrameSequence } from "./process/useFrameSequence";

/** Scroll timeline, as fractions of the pinned range. */
const TIMELINE = {
  frames: [0.04, 0.9],
  slide: [0.16, 0.3],
  introOut: [0.14, 0.24],
  listOn: 0.22,
  steps: [0.26, 0.9],
  outroOn: 0.93,
} as const;

/** Portion of the entry (section top travelling up one viewport) over which the stage opens. */
const STAGE_OPEN_FROM = 0.35;

/** Desktop laptop centre before and after the step list slides in. */
const CENTER_START = 0.62;
const CENTER_END = 0.38;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

const GUTTER_LEFT = "left-[clamp(1.25rem,5vw,4.5rem)]";

type StepState = "active" | "done" | "upcoming";

export function Process() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const centerRef = useRef(CENTER_START);

  useFrameSequence({ canvasRef, progressRef, centerRef, reduced });

  const enter = useMotionValue(0);
  const pinned = useMotionValue(0);
  const [listOn, setListOn] = useState(false);
  const [active, setActive] = useState(-1);
  const [outroOn, setOutroOn] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  // scrollYProgress spans the section's own height: 0 when its top meets the
  // bottom of the viewport, 1 when its bottom does. The first viewport of that
  // is the stage arriving; the rest is the pinned range.
  const update = useCallback(
    (v: number) => {
      const section = sectionRef.current;
      if (!section || reduced) return;
      const total = section.offsetHeight;
      const vh = window.innerHeight;
      const travelled = v * total;
      const p = clamp01((travelled - vh) / Math.max(1, total - vh));

      enter.set(clamp01(travelled / vh));
      pinned.set(p);

      progressRef.current = range(p, ...TIMELINE.frames);
      centerRef.current =
        CENTER_START -
        (CENTER_START - CENTER_END) * smoothstep(range(p, ...TIMELINE.slide));

      setListOn(p > TIMELINE.listOn);
      setActive(
        p < TIMELINE.steps[0]
          ? -1
          : Math.min(
              PROCESS_STEPS.length - 1,
              Math.floor(range(p, ...TIMELINE.steps) * PROCESS_STEPS.length),
            ),
      );
      setOutroOn(p > TIMELINE.outroOn);
    },
    [enter, pinned, reduced],
  );

  useMotionValueEvent(scrollYProgress, "change", update);
  // Sync once on mount / mode change, e.g. when the page loads mid-section.
  useEffect(() => {
    if (reduced) {
      // Static exhibit: last frame, centred in its own box.
      progressRef.current = 1;
      centerRef.current = 0.5;
      return;
    }
    update(scrollYProgress.get());
  }, [reduced, update, scrollYProgress]);

  const open = useTransform(enter, (e) => range(e, STAGE_OPEN_FROM, 1));
  const insetX = useTransform(open, (o) => (1 - o) * 5);
  const insetY = useTransform(open, (o) => (1 - o) * 6);
  const radius = useTransform(open, (o) => (1 - o) * 28);
  const clipPath = useMotionTemplate`inset(${insetY}vh ${insetX}vw ${insetY}vh ${insetX}vw round ${radius}px)`;

  const introOut = useTransform(pinned, (p) => range(p, ...TIMELINE.introOut));
  const introOpacity = useTransform(introOut, (o) => 1 - o);
  const introY = useTransform(introOut, (o) => -o * 30);

  if (reduced) {
    return (
      <section
        id="process"
        ref={sectionRef}
        aria-label="How we work"
        className="bg-[#0a0a0c] text-ink"
      >
        <div className="site-wrap grid gap-12 py-24 md:grid-cols-2 md:items-center md:gap-16 md:py-32">
          <div>
            <IntroCopy />
            <div className="relative mt-10 aspect-square md:aspect-video">
              <canvas
                ref={canvasRef}
                aria-hidden
                className="absolute inset-0 block h-full w-full"
              />
            </div>
          </div>
          <div>
            <StepList
              visible
              stateOf={() => "active"}
              className="md:ml-auto md:w-[min(30rem,100%)]"
            />
            <Outro visible className="mt-10" />
          </div>
        </div>
      </section>
    );
  }

  const stateOf = (i: number): StepState =>
    i === active ? "active" : i < active ? "done" : "upcoming";

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label="How we work"
      className="relative h-[380vh] bg-ink-50 md:h-[420vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 bg-[#0a0a0c] text-ink will-change-[clip-path]"
        >
          <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 block h-full w-full"
          />

          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className={cn(
              "absolute right-5 top-[calc(1.5rem+env(safe-area-inset-top))] md:right-auto md:top-1/2 md:-mt-28 md:max-w-[27rem]",
              GUTTER_LEFT,
            )}
          >
            <IntroCopy hideDescriptionOnMobile />
          </motion.div>

          <StepList
            visible={listOn}
            stateOf={stateOf}
            className="absolute bottom-[calc(3.2rem+env(safe-area-inset-bottom))] left-5 right-5 md:bottom-auto md:left-auto md:right-[clamp(1.25rem,5vw,4.5rem)] md:top-1/2 md:w-[min(30rem,34vw)] md:-translate-y-1/2"
          />

          <Outro
            visible={outroOn}
            className={cn(
              "absolute right-5 top-[calc(1.5rem+env(safe-area-inset-top))] md:bottom-[calc(3.4rem+env(safe-area-inset-bottom))] md:right-auto md:top-auto",
              GUTTER_LEFT,
            )}
          />

          <div
            aria-hidden
            className={cn(
              "absolute bottom-[calc(1.6rem+env(safe-area-inset-bottom))] right-[clamp(1.25rem,5vw,4.5rem)] h-px bg-ink/[0.12]",
              GUTTER_LEFT,
            )}
          >
            <motion.div
              style={{ scaleX: pinned }}
              className="absolute inset-0 origin-left bg-coral"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function IntroCopy({
  hideDescriptionOnMobile = false,
}: {
  hideDescriptionOnMobile?: boolean;
}) {
  return (
    <>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-coral">
        How we work
      </p>
      <h2 className="font-display text-[clamp(2rem,3.7vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink text-balance">
        Discover. Design. Build. Ship.
      </h2>
      <p
        className={cn(
          "mt-4 max-w-[38ch] leading-relaxed text-[#a39d94]",
          hideDescriptionOnMobile && "hidden md:block",
        )}
      >
        A short loop with real checkpoints — no mystery phase, no endless
        discovery theater.
      </p>
    </>
  );
}

function StepList({
  visible,
  stateOf,
  className,
}: {
  visible: boolean;
  stateOf: (index: number) => StepState;
  className?: string;
}) {
  return (
    <ol className={className}>
      {PROCESS_STEPS.map((step, i) => {
        const state = stateOf(i);
        return (
          <li
            key={step.step}
            aria-current={state === "active" ? "step" : undefined}
            style={{ transitionDelay: `${i * 60}ms` }}
            className={cn(
              "border-t border-ink/[0.12] py-2.5 transition-[opacity,transform] duration-500 ease-out last:border-b md:py-4",
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <h3
              className={cn(
                "flex items-center gap-3 font-display text-[1.3rem] font-bold tracking-[-0.03em] transition-colors duration-300 md:text-[clamp(1.5rem,2.6vw,2.4rem)]",
                state === "active" && "text-ink",
                state === "done" && "text-[#9a948b]",
                state === "upcoming" && "text-[#6f6a63]",
              )}
            >
              <span
                className={cn(
                  "w-[1.7rem] flex-none font-sans text-[0.8rem] font-medium tracking-[0.12em] transition-colors duration-300 md:w-[1.9rem]",
                  state === "active" ? "text-coral" : "text-[#6f6a63]",
                )}
              >
                {step.step}
              </span>
              {step.title}
            </h3>
            <div
              className={cn(
                "grid text-[#b9b3aa] transition-[grid-template-rows] duration-[450ms] ease-out",
                state === "active" ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="ml-10 mt-2 max-w-[36ch] text-[0.88rem] leading-relaxed md:ml-[2.7rem] md:text-[0.98rem]">
                  {step.body}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Outro({ visible, className }: { visible: boolean; className?: string }) {
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "flex flex-wrap items-center gap-5 transition-[opacity,transform] duration-500",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2.5 opacity-0",
        className,
      )}
    >
      <p className="text-[#b9b3aa]">Four steps, one team, no handoffs.</p>
      <LinkButton href="#contact" tabIndex={visible ? undefined : -1}>
        Start a project
      </LinkButton>
    </div>
  );
}

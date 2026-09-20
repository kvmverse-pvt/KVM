"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROCESS_STEPS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 40%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      ref={ref}
      className="relative overflow-hidden border-t border-ink-200 bg-ink py-28 md:py-36"
    >
      <div className="site-wrap">
        <SectionHeading
          eyebrow="How we work"
          title="Discover. Design. Build. Ship."
          description="A short loop with real checkpoints — no mystery phase, no endless discovery theater."
        />

        <div className="relative mt-20">
          <div
            className="absolute left-[1.15rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-ink-200 md:left-1/2 md:block"
            aria-hidden
          />
          <motion.div
            style={{ scaleY: reduced ? 1 : lineScale }}
            className="absolute left-[1.15rem] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-coral md:left-1/2 md:block"
            aria-hidden
          />

          <ol className="space-y-12 md:space-y-20">
            {PROCESS_STEPS.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.li
                  key={step.step}
                  initial={reduced ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative grid gap-4 md:grid-cols-2 md:gap-16"
                >
                  <div
                    className={
                      isLeft
                        ? "md:pr-12 md:text-right"
                        : "md:col-start-2 md:pl-12"
                    }
                  >
                    <p className="font-display text-sm tracking-[0.2em] text-coral">
                      {step.step}
                    </p>
                    <h3 className="mt-2 font-display text-3xl tracking-tight text-chalk">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-chalk-muted">
                      {step.body}
                    </p>
                  </div>
                  <div
                    className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-coral/40 bg-ink-100 text-xs font-medium text-coral shadow-card md:left-1/2 md:-translate-x-1/2"
                    aria-hidden
                  >
                    {index + 1}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

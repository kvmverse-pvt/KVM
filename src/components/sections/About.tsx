"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const accentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden border-t border-ink-200 bg-ink py-28 md:py-36"
    >
      <motion.div
        aria-hidden
        style={{ y: accentY }}
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-coral/10 blur-3xl"
      />

      <div className="site-wrap relative grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16 xl:gap-24">
        <SectionHeading
          eyebrow="The studio"
          title="Not an agency mill. A small team that actually builds."
        />

        <div className="space-y-8">
          <ParallaxLayer speed={0.12}>
            <p className="text-xl leading-relaxed text-chalk sm:text-2xl sm:leading-relaxed">
              KVMverse Code Studio is a tight crew of engineers and a designer
              who ship for early-stage teams. We care about craft, speed, and
              products that feel alive — not decks full of buzzwords.
            </p>
          </ParallaxLayer>
          <ParallaxLayer speed={0.2}>
            <p className="text-base leading-relaxed text-chalk-muted sm:text-lg">
              Philosophy is simple: talk straight, design with intent, write
              code you&apos;d be proud to maintain six months later. If you want
              thirty juniors and a project manager waterfall, we&apos;re not
              your people. If you want senior hands on the work — you are.
            </p>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}

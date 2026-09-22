"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PROJECTS } from "@/lib/constants";
import {
  CARD_HIGHLIGHT,
  CLOSED_INSET,
  COMPACT_INSET,
  OPEN_INSET,
  OPEN_TOP_PX,
  easeOut,
  inertProps,
  insetToClip,
  lerp,
  mixInset,
  span,
} from "./timeline";

type Project = (typeof PROJECTS)[number];

type ExhibitionCardProps = {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
  segment: number;
  outroStart: number;
  interactive: boolean;
};

export function ExhibitionCard({
  project,
  index,
  count,
  progress,
  segment,
  outroStart,
  interactive,
}: ExhibitionCardProps) {
  const isFirst = index === 0;
  const isLast = index === count - 1;
  const start = index * segment;

  // Local 0 → 1 through this card's own segment (unclamped past either end).
  const local = (v: number) => (v - start) / segment;
  // Local 0 → 1 through the outro, only meaningful for the last card.
  const outro = (v: number) => (v - outroStart) / (1 - outroStart);

  // RISE: slide up over the previous card.
  const layerY = useTransform(progress, (v) =>
    isFirst ? "0%" : `${(1 - span(local(v), 0, 0.3, easeOut)) * 100}%`,
  );

  // Pushed back while the next card rises over it.
  const pushBack = (v: number) =>
    isLast ? 0 : span(local(v), 1, 1.3, easeOut);
  const layerScale = useTransform(progress, (v) => lerp(1, 0.9, pushBack(v)));
  const dimOpacity = useTransform(progress, (v) => 0.65 * pushBack(v));

  // OPEN, then (last card only) close back down for the outro.
  const openT = (v: number) => span(local(v), 0.25, 0.55);
  const clipPath = useTransform(progress, (v) => {
    let inset = mixInset(COMPACT_INSET, OPEN_INSET, openT(v));
    if (isLast) inset = mixInset(inset, CLOSED_INSET, span(outro(v), 0.1, 0.7));
    return insetToClip(inset);
  });

  // Media counter-scales while opening, then settles and drifts during HOLD.
  const holdT = (v: number) => span(local(v), 0.65, 1, (t) => t);
  const mediaScale = useTransform(
    progress,
    (v) => 1.25 - 0.21 * openT(v) - 0.04 * holdT(v),
  );
  const mediaY = useTransform(progress, (v) => `${-2.5 * holdT(v)}%`);

  // TEXT: title through a line mask, then meta and CTA, staggered.
  const titleY = useTransform(
    progress,
    (v) => `${110 * (1 - span(local(v), 0.4, 0.55, easeOut))}%`,
  );
  const metaT = (v: number) => span(local(v), 0.48, 0.6, easeOut);
  const metaOpacity = useTransform(progress, metaT);
  const metaY = useTransform(progress, (v) => 16 * (1 - metaT(v)));
  const ctaT = (v: number) => span(local(v), 0.53, 0.65, easeOut);
  const ctaOpacity = useTransform(progress, ctaT);
  const ctaY = useTransform(progress, (v) => 16 * (1 - ctaT(v)));

  // Text leaves when the next card rises, or at the start of the outro.
  const textOut = (v: number) =>
    isLast ? span(outro(v), 0, 0.35) : pushBack(v);
  const textOpacity = useTransform(progress, (v) => 1 - textOut(v));
  const textY = useTransform(progress, (v) => -30 * textOut(v));

  return (
    <motion.li
      className="absolute inset-0"
      style={{
        zIndex: index + 1,
        y: layerY,
        scale: layerScale,
        willChange: "transform",
      }}
    >
      <motion.article
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: project.gradient,
            scale: mediaScale,
            y: mediaY,
            willChange: "transform",
          }}
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ backgroundImage: CARD_HIGHLIGHT }}
          />
        </motion.div>

        <div
          className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden
        />

        <motion.div
          className="absolute flex items-end justify-between gap-8 p-8 lg:p-12"
          style={{
            top: OPEN_TOP_PX,
            right: "3%",
            bottom: "5%",
            left: "3%",
            opacity: textOpacity,
            y: textY,
          }}
        >
          <div className="min-w-0">
            <motion.div
              className="mb-5 flex flex-wrap gap-2"
              style={{ opacity: metaOpacity, y: metaY }}
            >
              <span className="rounded-full border border-white/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/85">
                {project.category}
              </span>
              <span className="rounded-full border border-white/40 px-3 py-1 text-xs tabular-nums tracking-[0.18em] text-white/85">
                {project.year}
              </span>
            </motion.div>
            <h3 className="overflow-hidden pb-[0.06em] font-display text-[clamp(3rem,8vw,8.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white">
              <motion.span className="block" style={{ y: titleY }}>
                {project.title}
              </motion.span>
            </h3>
          </div>

          <motion.div
            className="shrink-0"
            style={{ opacity: ctaOpacity, y: ctaY }}
            {...inertProps(!interactive)}
          >
            <a
              href="#contact"
              tabIndex={interactive ? undefined : -1}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white hover:text-chalk"
            >
              Case study soon
              <ArrowUpRight size={16} aria-hidden />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: dimOpacity }}
          aria-hidden
        />
      </motion.article>
    </motion.li>
  );
}

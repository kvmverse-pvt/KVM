"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/constants";
import { NAV_OFFSET_PX, CARD_HIGHLIGHT, easeOut, lerp, span } from "./timeline";

type Project = (typeof PROJECTS)[number];

const COUNT = PROJECTS.length;
// Layout in svh: each card is 72svh tall with a 6svh gap.
const CARD_SVH = 72;
const GAP_SVH = 6;
const STEP_SVH = CARD_SVH + GAP_SVH;
const LIST_SVH = COUNT * CARD_SVH + (COUNT - 1) * GAP_SVH;

const TITLE_CLASS =
  "overflow-hidden pb-[0.06em] font-display text-[clamp(2.5rem,13vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white";

type WorkMobileStackProps = {
  /** Mobile with motion allowed. False renders a fully static stack (SSR / reduced motion). */
  animated: boolean;
};

/**
 * Native sticky stack: each card pins a little lower than the last so they
 * pile up as you scroll. Also the server-rendered, no-JS markup.
 */
export function WorkMobileStack({ animated }: WorkMobileStackProps) {
  const listRef = useRef<HTMLUListElement>(null);
  // 0 when the list's top meets the viewport bottom, 1 when its bottom leaves the top.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start end", "end start"],
  });

  return (
    <ul
      ref={listRef}
      className="mt-16 flex flex-col"
      style={{ gap: `${GAP_SVH}svh` }}
    >
      {PROJECTS.map((project, index) => (
        <li
          key={project.title}
          className="sticky"
          style={{
            top: `calc(${NAV_OFFSET_PX}px + ${index * 12}px)`,
            height: `${CARD_SVH}svh`,
          }}
        >
          {animated ? (
            <AnimatedCard
              project={project}
              index={index}
              progress={scrollYProgress}
            />
          ) : (
            <CardShell project={project} />
          )}
        </li>
      ))}
    </ul>
  );
}

function AnimatedCard({
  project,
  index,
  progress,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
}) {
  const isLast = index === COUNT - 1;
  // Distance scrolled (in svh) since the list entered; the next card's top
  // reaches the viewport bottom at (index + 1) * STEP_SVH and pins ~88svh later.
  const approach = (v: number) => {
    if (isLast) return 0;
    const scrolled = v * (LIST_SVH + 100);
    const enter = (index + 1) * STEP_SVH;
    return span(scrolled, enter + 20, enter + 88, easeOut);
  };
  const scale = useTransform(progress, (v) => lerp(1, 0.94, approach(v)));
  const dim = useTransform(progress, (v) => 0.45 * approach(v));

  return (
    <motion.div
      className="h-full origin-top"
      style={{ scale, willChange: isLast ? undefined : "transform" }}
    >
      <CardShell project={project} dim={dim} revealTitle />
    </motion.div>
  );
}

function CardShell({
  project,
  dim,
  revealTitle = false,
}: {
  project: Project;
  dim?: MotionValue<number>;
  revealTitle?: boolean;
}) {
  return (
    <article className="relative h-full overflow-hidden rounded-2xl shadow-card">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: project.gradient }}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ backgroundImage: CARD_HIGHLIGHT }}
        />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/85">
            {project.category}
          </span>
          <span className="rounded-full border border-white/40 px-3 py-1 text-[11px] tabular-nums tracking-[0.18em] text-white/85">
            {project.year}
          </span>
        </div>
        {revealTitle ? (
          // The observer sits on the mask, not the span: a span translated out
          // of an overflow-hidden parent never registers as intersecting.
          <motion.h3
            className={TITLE_CLASS}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.6 }}
          >
            <motion.span
              className="block"
              variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.title}
            </motion.span>
          </motion.h3>
        ) : (
          <h3 className={TITLE_CLASS}>
            <span className="block">{project.title}</span>
          </h3>
        )}
        <div className="mt-6 flex justify-end">
          <a
            href="#contact"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm text-white"
          >
            Case study soon
            <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </div>

      {dim ? (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: dim }}
          aria-hidden
        />
      ) : null}
    </article>
  );
}

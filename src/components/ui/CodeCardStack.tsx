"use client";

import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useMedia";

/**
 * KVM "Code Card Stack".
 *
 * A pure HTML/CSS 3D deck - no WebGL, no canvas, no textures. The cards are
 * real DOM inside a `perspective` / `preserve-3d` context, so the code stays
 * vector-sharp at any browser zoom.
 *
 * Two rules keep it crisp:
 *   1. Nothing is ever scaled. Only translate3d and rotate, so the compositor
 *      rasterises every card at exactly 1:1 and never resamples the glyphs.
 *   2. Translate values are whole pixels, so text never lands on a half pixel.
 *
 * Scroll and pointer arrive as Framer MotionValues and are piped straight into
 * `style`. React never re-renders while you move or scroll.
 */

/* ---------------------------------------------------------------- geometry */

/** Resting deck: a tight overlap. Fanned: pulled apart in depth. */
const REST_OFFSET = 28;
const FAN_OFFSET = 60;
const REST_GAP = 40;
const FAN_GAP = 140;

const REST_ROTATE_Y = -18;
const FAN_ROTATE_Y = 6;
const BASE_ROTATE_X = 10;

/** Maximum pointer-driven tilt, in degrees, on each axis. */
const TILT = 8;

/** The deck is fully fanned by the time the hero is 60% scrolled out. */
const FAN_END = 0.6;

const SPRING = { stiffness: 120, damping: 20 } as const;

/* ------------------------------------------------------------------ content */

function Line({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

const APP_CARD = (
  <>
    <Line>
      <span className="text-code-keyword">import</span>
      {" { "}
      <span className="text-code-fn">KVMverse</span>
      {" } "}
      <span className="text-code-keyword">from</span>{" "}
      <span className="text-code-string">&quot;@kvm/core&quot;</span>;
    </Line>
    <Line>&nbsp;</Line>
    <Line>
      <span className="text-code-keyword">export function</span>{" "}
      <span className="text-code-fn">App</span>() {"{"}
    </Line>
    <Line>
      {"  "}
      <span className="text-code-keyword">return</span>{" "}
      <span className="text-code-fn">&lt;KVMverse /&gt;</span>;
    </Line>
    <Line>{"}"}</Line>
  </>
);

const TERMINAL_CARD = (
  <>
    <Line>
      <span className="text-coral">$</span> npm run build
    </Line>
    <Line>
      <span className="text-coral">✓</span>{" "}
      <span className="text-code-muted">compiled in 1.2s</span>
    </Line>
    <Line>
      <span className="text-coral">✓</span>{" "}
      <span className="text-code-muted">deployed to production</span>
    </Line>
  </>
);

const API_CARD = (
  <>
    <Line>
      app.<span className="text-code-fn">get</span>(
      <span className="text-code-string">&apos;/ship&apos;</span>, (req, res)
      {" =>"}
    </Line>
    <Line>
      {"  "}res.<span className="text-code-fn">status</span>(
      <span className="text-code-keyword">200</span>).
      <span className="text-code-fn">json</span>({"{"}
    </Line>
    <Line>
      {"    "}shipped: <span className="text-code-keyword">true</span>
    </Line>
    <Line>{"  })"}</Line>
    <Line>{");"}</Line>
  </>
);

type CardSpec = {
  key: string;
  file: string;
  body: ReactNode;
  /** 0 = front of the deck, 2 = back. */
  depth: number;
};

/** Back to front, so the DOM order matches the paint order. */
const CARDS: CardSpec[] = [
  { key: "api", file: "api.ts", body: API_CARD, depth: 2 },
  { key: "terminal", file: "terminal", body: TERMINAL_CARD, depth: 1 },
  { key: "app", file: "app.tsx", body: APP_CARD, depth: 0 },
];

/* --------------------------------------------------------------- transforms */

/** Whole-pixel `translate3d` for one card, driven by the fan MotionValues. */
function useCardTransform(
  offset: MotionValue<number>,
  gap: MotionValue<number>,
  depth: number,
) {
  return useTransform([offset, gap], ([o, g]: number[]) => {
    const slide = Math.round(o * depth);
    const push = Math.round(g * depth);
    return `translate3d(${slide}px, ${slide}px, ${-push}px)`;
  });
}

function restingTransform(depth: number) {
  const slide = REST_OFFSET * depth;
  return `translate3d(${slide}px, ${slide}px, ${-REST_GAP * depth}px)`;
}

/* ------------------------------------------------------------------- cards */

function Card({
  spec,
  transform,
  entrance,
}: {
  spec: CardSpec;
  transform: MotionValue<string> | string;
  /** Delay for the load-in, or null to render the card already settled. */
  entrance: number | null;
}) {
  return (
    <motion.div
      className="absolute left-0 top-0 h-[240px] w-[300px] md:w-[340px] lg:w-[420px]"
      style={{
        transform,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <motion.div
        initial={entrance === null ? false : { opacity: 0, z: -160 }}
        animate={{ opacity: 1, z: 0 }}
        transition={{
          duration: 0.7,
          delay: entrance ?? 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex h-full w-full select-none flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-panel shadow-panel [-webkit-font-smoothing:antialiased] [backface-visibility:hidden]"
      >
        <div className="flex items-center gap-[7px] border-b border-white/[0.06] px-4 py-3 md:px-5">
          <span className="h-[9px] w-[9px] rounded-full bg-coral" />
          <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
          <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
          <span className="ml-[10px] font-mono text-[12px] leading-none text-code-muted">
            {spec.file}
          </span>
        </div>

        <div className="flex-1 overflow-hidden whitespace-pre px-4 py-4 font-mono text-[12px] leading-[1.7] text-code-plain md:px-5 md:py-5 md:text-[13px] lg:text-[14px]">
          {spec.body}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------- stack */

type CodeCardStackProps = {
  /** 0 at the top of the hero, 1 once it has scrolled out. */
  progress: MotionValue<number>;
  /** Pointer position as a percentage (0-100) of the hero box. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  className?: string;
};

export function CodeCardStack({
  progress,
  pointerX,
  pointerY,
  className,
}: CodeCardStackProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  // Mobile gets a static deck below the copy: no scroll fan, no pointer tilt.
  const live = !reduced && !isMobile;

  const fanRaw = useTransform(progress, [0, FAN_END], [0, 1], { clamp: true });
  const fan = useSpring(fanRaw, SPRING);

  const offset = useTransform(fan, [0, 1], [REST_OFFSET, FAN_OFFSET]);
  const gap = useTransform(fan, [0, 1], [REST_GAP, FAN_GAP]);

  // One hook per card - the deck is a fixed three, so this stays stable.
  const backTransform = useCardTransform(offset, gap, 2);
  const middleTransform = useCardTransform(offset, gap, 1);
  const frontTransform = useCardTransform(offset, gap, 0);
  const transforms = [backTransform, middleTransform, frontTransform];

  const rotateY = useTransform([fan, pointerX], ([f, px]: number[]) => {
    const fanned = REST_ROTATE_Y + f * (FAN_ROTATE_Y - REST_ROTATE_Y);
    return fanned + ((px - 50) / 50) * TILT;
  });
  const rotateX = useTransform(
    pointerY,
    (py) => BASE_ROTATE_X - ((py - 50) / 50) * TILT,
  );

  // Cards grow down-right from the front card, so the deck is pulled back by
  // one offset to stay optically centred on its box - at rest and fully fanned.
  // Whole pixels here too: a half-pixel shift on the stack blurs every card.
  const centre = useTransform(offset, (o) => -Math.round(o));

  const stackStyle: MotionStyle = live
    ? { x: centre, y: centre, rotateY, rotateX }
    : {
        transform: `translate3d(${-REST_OFFSET}px, ${-REST_OFFSET}px, 0) rotateY(${REST_ROTATE_Y}deg) rotateX(${BASE_ROTATE_X}deg)`,
      };

  return (
    // The box is exactly one card; the deck overhangs it evenly on both axes.
    <div
      aria-hidden
      className={`pointer-events-none h-[240px] w-[300px] select-none [perspective:1200px] md:w-[340px] lg:w-[420px] ${className ?? ""}`}
    >
      {/* Idle float. Its own layer so it never fights the tilt transform. */}
      <motion.div
        className="h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={live ? { y: [0, -8, 0] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            ...stackStyle,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {CARDS.map((spec, index) => (
            <Card
              key={spec.key}
              spec={spec}
              transform={live ? transforms[index] : restingTransform(spec.depth)}
              entrance={live ? index * 0.1 : null}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

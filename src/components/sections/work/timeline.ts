/** Fixed navbar height the exhibition keeps clear of (py-4 + 44px button ≈ 76px, rounded up). */
export const NAV_OFFSET_PX = 88;
/** Height of the stage bar that sits directly under the navbar. */
export const STAGE_BAR_PX = 40;
/** Open-card top inset: navbar + stage bar + a little breathing room. */
export const OPEN_TOP_PX = NAV_OFFSET_PX + STAGE_BAR_PX + 12;

/** Outro length, measured in project segments. */
export const OUTRO_UNITS = 0.5;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Eased, clamped 0 → 1 progress of `v` across the window [a, b]. */
export function span(
  v: number,
  a: number,
  b: number,
  ease: (t: number) => number = easeInOut,
) {
  return ease(clamp01((v - a) / (b - a)));
}

/** A clip-path inset whose top edge can mix percent and px. */
export type Inset = {
  top: number;
  topPx: number;
  right: number;
  bottom: number;
  left: number;
  radius: number;
};

export const COMPACT_INSET: Inset = {
  top: 30,
  topPx: 0,
  right: 34,
  bottom: 28,
  left: 34,
  radius: 22,
};

export const OPEN_INSET: Inset = {
  top: 0,
  topPx: OPEN_TOP_PX,
  right: 3,
  bottom: 5,
  left: 3,
  radius: 16,
};

export const CLOSED_INSET: Inset = {
  top: 22,
  topPx: 0,
  right: 36,
  bottom: 36,
  left: 36,
  radius: 22,
};

export function mixInset(a: Inset, b: Inset, t: number): Inset {
  return {
    top: lerp(a.top, b.top, t),
    topPx: lerp(a.topPx, b.topPx, t),
    right: lerp(a.right, b.right, t),
    bottom: lerp(a.bottom, b.bottom, t),
    left: lerp(a.left, b.left, t),
    radius: lerp(a.radius, b.radius, t),
  };
}

export function insetToClip(i: Inset) {
  return `inset(calc(${i.top}% + ${i.topPx}px) ${i.right}% ${i.bottom}% ${i.left}% round ${i.radius}px)`;
}

/** Timeline layout for N projects plus the outro, in overall 0 → 1 progress. */
export function getTimeline(count: number) {
  const segment = 1 / (count + OUTRO_UNITS);
  return { segment, outroStart: count * segment };
}

export const padIndex = (n: number) => String(n).padStart(2, "0");

/**
 * React 18 doesn't know `inert` and warns on `inert={true}`, but passes an
 * empty string straight through as the attribute. Typed as boolean to match
 * the DOM typings.
 */
export function inertProps(on: boolean): { inert?: boolean } {
  return on ? { inert: "" as unknown as boolean } : {};
}

/** The radial highlight the project cards have always carried. */
export const CARD_HIGHLIGHT =
  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 45%)";

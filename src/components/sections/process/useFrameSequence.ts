"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import { useIsMobile } from "@/hooks/useMedia";

/** Stage colour the frames were rendered on; image edges fade into it. */
export const STAGE_BG = "#0a0a0c";
const STAGE_BG_CLEAR = "rgba(10, 10, 12, 0)";

const FRAME_SETS = {
  desktop: { dir: "/work-frames/desktop", count: 192 },
  mobile: { dir: "/work-frames/mobile", count: 96 },
} as const;

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** How much of the remaining distance the drawn frame closes each rAF tick. */
const SCRUB_EASE = 0.18;
/** Edge fade size, as a fraction of the drawn image's shorter side. */
const EDGE_FADE = 0.12;

const frameSrc = (dir: string, index: number) =>
  `${dir}/${String(index + 1).padStart(4, "0")}.webp`;

type FrameSequenceOptions = {
  canvasRef: RefObject<HTMLCanvasElement>;
  /** 0 → 1 playback position, written by the scroll handler and read every tick. */
  progressRef: MutableRefObject<number>;
  /** Desktop horizontal centre of the image as a fraction of canvas width. */
  centerRef: MutableRefObject<number>;
  /** Reduced motion: load and draw only the last frame, no rAF loop. */
  reduced: boolean;
};

/**
 * Preloads the laptop image sequence and scrubs it on a canvas. The drawn frame
 * eases toward `progressRef` on each animation frame, so scroll jumps play back
 * smoothly instead of skipping.
 */
export function useFrameSequence({
  canvasRef,
  progressRef,
  centerRef,
  reduced,
}: FrameSequenceOptions) {
  const mobile = useIsMobile();

  useEffect(() => {
    // Both media hooks start at `false` and correct themselves after mount.
    // Wait until they agree with the real queries so we never start downloading
    // the wrong frame set (or the whole set when only the last frame is needed).
    if (window.matchMedia(MOBILE_QUERY).matches !== mobile) return;
    if (window.matchMedia(REDUCED_QUERY).matches !== reduced) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { dir, count } = mobile ? FRAME_SETS.mobile : FRAME_SETS.desktop;
    const images: HTMLImageElement[] = new Array(count);
    const ready: boolean[] = new Array(count).fill(false);

    let raf = 0;
    let width = 0;
    let height = 0;
    let current = reduced ? count - 1 : progressRef.current * (count - 1);
    let shown = -1;
    let shownCenter = -1;
    let dirty = true;
    let started = false;

    const load = (index: number) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        ready[index] = true;
        // Static mode has no loop to pick the new frame up.
        if (reduced) draw(count - 1);
      };
      img.src = frameSrc(dir, index);
      images[index] = img;
    };

    const startLoading = () => {
      if (started) return;
      started = true;
      if (reduced) {
        load(count - 1);
        return;
      }
      // Frame 0 goes first so the stage has something to show straight away.
      for (let i = 0; i < count; i++) load(i);
    };

    /** Nearest frame that has finished loading, so scrubbing never blanks. */
    const nearestReady = (want: number) => {
      if (ready[want]) return want;
      for (let d = 1; d < count; d++) {
        if (want - d >= 0 && ready[want - d]) return want - d;
        if (want + d < count && ready[want + d]) return want + d;
      }
      return -1;
    };

    const fadeEdges = (x: number, y: number, dw: number, dh: number) => {
      const f = Math.min(dw, dh) * EDGE_FADE;
      const edges = [
        [x, y, x, y + f, x, y, dw, f],
        [x, y + dh, x, y + dh - f, x, y + dh - f, dw, f],
        [x, y, x + f, y, x, y, f, dh],
        [x + dw, y, x + dw - f, y, x + dw - f, y, f, dh],
      ];
      for (const [x0, y0, x1, y1, rx, ry, rw, rh] of edges) {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, STAGE_BG);
        g.addColorStop(1, STAGE_BG_CLEAR);
        ctx.fillStyle = g;
        ctx.fillRect(rx, ry, rw, rh);
      }
    };

    const draw = (want: number) => {
      const index = nearestReady(want);
      if (index < 0 || !width || !height) return;
      const center = mobile ? 0.5 : centerRef.current;
      if (!dirty && index === shown && Math.abs(center - shownCenter) < 0.0005) {
        return;
      }
      dirty = false;
      shown = index;
      shownCenter = center;

      const img = images[index];
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      // Desktop: contain-fit the whole frame. Mobile: zoom so the laptop fills
      // the width, sitting in the upper half.
      const s = mobile
        ? Math.max((width * 1.75) / iw, (height * 0.5) / ih)
        : Math.min(width / iw, height / ih) * 0.98;
      const dw = iw * s;
      const dh = ih * s;
      const x = width * center - dw / 2;
      const y = height * (mobile ? 0.44 : 0.5) - dh / 2;

      ctx.fillStyle = STAGE_BG;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, x, y, dw, dh);
      fadeEdges(x, y, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
      draw(Math.round(current));
    };

    const tick = () => {
      const target = Math.min(1, Math.max(0, progressRef.current)) * (count - 1);
      current += (target - current) * SCRUB_EASE;
      if (Math.abs(target - current) < 0.01) current = target;
      draw(Math.round(current));
      raf = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Start downloading a couple of screens early; only run the loop on screen.
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startLoading();
        preloadObserver.disconnect();
      },
      { rootMargin: "200% 0px" },
    );
    const loopObserver = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting && !raf) raf = requestAnimationFrame(tick);
      else if (!entry.isIntersecting) stopLoop();
    });
    const resizeObserver = new ResizeObserver(resize);

    preloadObserver.observe(canvas);
    loopObserver.observe(canvas);
    resizeObserver.observe(canvas);

    return () => {
      stopLoop();
      preloadObserver.disconnect();
      loopObserver.disconnect();
      resizeObserver.disconnect();
      for (const img of images) {
        if (!img) continue;
        img.onload = null;
        // Abort downloads that are still in flight.
        if (!img.complete) img.src = "";
      }
    };
  }, [canvasRef, progressRef, centerRef, mobile, reduced]);
}

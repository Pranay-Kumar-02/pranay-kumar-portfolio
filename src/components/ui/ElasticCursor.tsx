/**
 * Disclaimer: This component is not entirely my own
 */

"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { usePreloader } from "../preloader";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";

function useTicker(callback: any, paused: boolean) {
  useEffect(() => {
    if (!paused && callback) {
      gsap.ticker.add(callback);
    }
    return () => {
      gsap.ticker.remove(callback);
    };
  }, [callback, paused]);
}

// A persistent, render-independent value (kept in a ref, created lazily once).
function useInstance<T>(create: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) ref.current = create();
  return ref.current;
}

// Velocity-driven squeeze amount for the free-roaming blob.
function getScale(diffX: number, diffY: number) {
  const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  return Math.min(distance / 735, 0.35);
}

// Velocity-driven rotation (degrees) for the free-roaming blob.
function getAngle(diffX: number, diffY: number) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CURSOR_DIAMETER = 50;
const WRAP_PADDING = 8; // breathing room when hugging a target
const WRAP_RADIUS = 12; // corner radius while wrapped
const WRAP_EASE = 0.2; // how fast the cursor snaps to/from a target
const TARGET_PULL = 0.35; // fraction of pointer offset the target travels
const TARGET_EASE = 0.25; // how fast the target follows the pointer
const TARGET_MAX_PULL = 12; // px cap so wide targets nudge instead of sliding far
const CURSOR_PARALLAX = 0.12; // extra lead of the cursor toward the pointer
const CURSOR_MAX_LEAD = 10; // px cap on that lead, independent of target size

// Magnetic feel: the cursor morphs to hug the hovered element, and the element
// is pulled toward the pointer. Flip either flag for a cursor-only/target-only
// variant.
const wrapsTarget = true;
const movesTarget = true;

type Base = {
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};
type ActiveTarget = {
  el: HTMLElement | null;
  base: Base | null;
  offX: number;
  offY: number;
};
type Setters = Record<string, Function>;

function measure(el: HTMLElement): Base {
  const r = el.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
  };
}

function ElasticCursor() {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith("/blogs/") && pathname !== "/blogs";

  const { loadingPercent, isLoading } = usePreloader();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const jellyRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [cursorMoved, setCursorMoved] = useState(false);
  const cursorMovedRef = useRef(false);
  const isHiddenRef = useRef(false);

  // Spring used for the free-roam blob, plus the derived velocity.
  const pos = useInstance(() => ({ x: 0, y: 0 }));
  const vel = useInstance(() => ({ x: 0, y: 0 }));
  // Raw pointer (no smoothing) for the precise dot.
  const pointer = useInstance(() => ({ x: 0, y: 0 }));
  // Current rendered blob geometry, lerped toward its target every frame.
  const jelly = useInstance(() => ({
    x: 0,
    y: 0,
    w: CURSOR_DIAMETER,
    h: CURSOR_DIAMETER,
    r: CURSOR_DIAMETER / 2,
    sx: 1,
    sy: 1,
  }));
  const active = useInstance<ActiveTarget>(() => ({
    el: null,
    base: null,
    offX: 0,
    offY: 0,
  }));
  const set = useInstance<Setters>(() => ({}));

  // Bind GSAP quick setters to the live nodes. Re-runs on remount
  // (isMobile/isBlogPost toggle `return null`, swapping in fresh DOM nodes);
  // without rebinding they'd write to detached elements and freeze.
  useLayoutEffect(() => {
    const jellyEl = jellyRef.current;
    const dotEl = dotRef.current;
    if (!jellyEl || !dotEl) return;
    // Center both on their coordinate via gsap transforms so the per-frame
    // x/y setters don't clobber a CSS translate.
    gsap.set(jellyEl, { xPercent: -50, yPercent: -50 });
    gsap.set(dotEl, { xPercent: -50, yPercent: -50 });
    set.x = gsap.quickSetter(jellyEl, "x", "px");
    set.y = gsap.quickSetter(jellyEl, "y", "px");
    set.r = gsap.quickSetter(jellyEl, "rotate", "deg");
    set.sx = gsap.quickSetter(jellyEl, "scaleX");
    set.sy = gsap.quickSetter(jellyEl, "scaleY");
    set.width = gsap.quickSetter(jellyEl, "width", "px");
    set.height = gsap.quickSetter(jellyEl, "height", "px");
    set.radius = gsap.quickSetter(jellyEl, "borderRadius", "px");
    set.opacity = gsap.quickSetter(jellyEl, "opacity");
    set.dotX = gsap.quickSetter(dotEl, "x", "px");
    set.dotY = gsap.quickSetter(dotEl, "y", "px");
    set.dotOpacity = gsap.quickSetter(dotEl, "opacity");
  }, [isMobile, isBlogPost]);

  // Single render loop. Reads everything from refs so it stays stable and the
  // ticker isn't re-added on every hover.
  const render = useCallback(() => {
    if (!set.x) return;

    // Precise dot always tracks the raw pointer.
    set.dotX(pointer.x);
    set.dotY(pointer.y);

    const el = active.el;
    const wrapping = !!el && wrapsTarget;
    const moveTarget = !!el && movesTarget;
    const hidden = isHiddenRef.current;

    // Pull the hovered element toward the pointer (magnetic button), capped to an
    // absolute distance. Driven via gsap so its transform cache stays in sync with
    // the release spring-back — a raw style.transform write makes the spring instant.
    if (moveTarget && el && active.base) {
      const b = active.base;
      const pullX = clamp(
        (pointer.x - b.cx) * TARGET_PULL,
        -TARGET_MAX_PULL,
        TARGET_MAX_PULL
      );
      const pullY = clamp(
        (pointer.y - b.cy) * TARGET_PULL,
        -TARGET_MAX_PULL,
        TARGET_MAX_PULL
      );
      active.offX = lerp(active.offX, pullX, TARGET_EASE);
      active.offY = lerp(active.offY, pullY, TARGET_EASE);
      gsap.set(el, { x: active.offX, y: active.offY });
    }

    if (wrapping && active.base) {
      // Cursor snaps to hug the target (and follows it if it's also moving).
      const b = active.base;
      const leadX = clamp(
        (pointer.x - b.cx) * CURSOR_PARALLAX,
        -CURSOR_MAX_LEAD,
        CURSOR_MAX_LEAD
      );
      const leadY = clamp(
        (pointer.y - b.cy) * CURSOR_PARALLAX,
        -CURSOR_MAX_LEAD,
        CURSOR_MAX_LEAD
      );
      const tx = b.cx + active.offX + leadX;
      const ty = b.cy + active.offY + leadY;
      jelly.x = lerp(jelly.x, tx, WRAP_EASE);
      jelly.y = lerp(jelly.y, ty, WRAP_EASE);
      jelly.w = lerp(jelly.w, b.width + WRAP_PADDING * 2, WRAP_EASE);
      jelly.h = lerp(jelly.h, b.height + WRAP_PADDING * 2, WRAP_EASE);
      jelly.r = lerp(jelly.r, WRAP_RADIUS, WRAP_EASE);
      jelly.sx = lerp(jelly.sx, 1, 0.3);
      jelly.sy = lerp(jelly.sy, 1, 0.3);
      set.x(jelly.x);
      set.y(jelly.y);
      set.width(jelly.w);
      set.height(jelly.h);
      set.radius(jelly.r);
      set.sx(jelly.sx);
      set.sy(jelly.sy);
      set.r(0);
      set.opacity(hidden ? 0 : 1);
      set.dotOpacity(0); // fold the dot away — one unified cursor
    } else {
      // Free roam: elastic spring position + velocity-driven squish.
      const rotation = getAngle(vel.x, vel.y);
      const scale = getScale(vel.x, vel.y);
      jelly.x = pos.x;
      jelly.y = pos.y;
      jelly.w = lerp(jelly.w, CURSOR_DIAMETER + scale * 300, 0.4);
      jelly.h = lerp(jelly.h, CURSOR_DIAMETER, 0.4);
      jelly.r = lerp(jelly.r, CURSOR_DIAMETER / 2, 0.4);
      jelly.sx = 1 + scale;
      jelly.sy = 1 - scale * 2;
      set.x(pos.x);
      set.y(pos.y);
      set.width(jelly.w);
      set.height(jelly.h);
      set.radius(jelly.r);
      set.r(rotation);
      set.sx(jelly.sx);
      set.sy(jelly.sy);
      set.opacity(hidden ? 0 : 1);
      set.dotOpacity(hidden ? 0 : 1);
    }
  }, []);

  // Track the raw pointer, drive the free-roam spring, and update hide flag.
  useEffect(() => {
    if (isMobile || isBlogPost) return;
    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!cursorMovedRef.current) {
        cursorMovedRef.current = true;
        setCursorMoved(true);
      }
      gsap.to(pos, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        onUpdate: () => {
          vel.x = (e.clientX - pos.x) * 1.2;
          vel.y = (e.clientY - pos.y) * 1.2;
        },
      });

      const hide = !!(e.target as Element | null)?.closest?.(
        '[data-no-custom-cursor="true"]'
      );
      isHiddenRef.current = hide;
      document.body.style.cursor = hide ? "auto" : "";
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile, isBlogPost]);

  // Acquire/release targets via event delegation — fires once per target
  // instead of re-scanning on every mousemove.
  useEffect(() => {
    if (isMobile || isBlogPost) return;

    const acquire = (el: HTMLElement) => {
      gsap.killTweensOf(el);
      active.el = el;
      active.base = measure(el);
      active.offX = 0;
      active.offY = 0;
      jelly.x = pos.x; // morph begins from the current cursor position
      jelly.y = pos.y;
      if (movesTarget) el.style.willChange = "transform";
    };

    const release = () => {
      const el = active.el;
      if (el && movesTarget) {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.35)",
          clearProps: "transform",
          onComplete: () => {
            el.style.willChange = "";
          },
        });
      }
      active.el = null;
      active.base = null;
      active.offX = 0;
      active.offY = 0;
    };

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      // Opt-out zones (e.g. the chat widget) disable the whole effect, not
      // just the cursor visuals — release any held target and don't acquire.
      if (target?.closest?.('[data-no-custom-cursor="true"]')) {
        if (active.el) release();
        return;
      }
      const t = target?.closest?.(".cursor-can-hover") as HTMLElement | null;
      if (t === active.el) return;
      if (active.el) release();
      if (t) acquire(t);
    };
    const onLeave = () => {
      if (active.el) release();
    };
    // Keep the resting bounds correct under scroll (subtract live offset so a
    // translated target doesn't feed back into its own measurement).
    const onScroll = () => {
      if (!active.el || !active.base) return;
      const r = active.el.getBoundingClientRect();
      active.base.left = r.left - active.offX;
      active.base.top = r.top - active.offY;
      active.base.width = r.width;
      active.base.height = r.height;
      active.base.cx = active.base.left + r.width / 2;
      active.base.cy = active.base.top + r.height / 2;
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (active.el) release();
    };
  }, [isMobile, isBlogPost]);

  // Preloader uses the blob as a loading bar.
  useEffect(() => {
    if (!jellyRef.current) return;
    jellyRef.current.style.height = "2rem";
    jellyRef.current.style.borderRadius = "1rem";
    jellyRef.current.style.width = loadingPercent * 2 + "vw";
  }, [loadingPercent]);

  useTicker(render, isLoading || !cursorMoved || isMobile || isBlogPost);
  if (isMobile || isBlogPost) return null;

  return (
    <>
      <div
        ref={jellyRef}
        id={"jelly-id"}
        className={cn(
          "jelly-blob fixed left-0 top-0 border-2 border-black dark:border-white pointer-events-none will-change-transform"
        )}
        style={{
          width: CURSOR_DIAMETER,
          height: CURSOR_DIAMETER,
          borderRadius: CURSOR_DIAMETER / 2,
          boxSizing: "border-box",
          zIndex: 100,
          backdropFilter: "invert(100%)",
        }}
      ></div>
      <div
        ref={dotRef}
        className="w-3 h-3 rounded-full fixed left-0 top-0 pointer-events-none will-change-transform"
        style={{
          opacity: 0,
          backdropFilter: "invert(100%)",
          zIndex: 101,
        }}
      ></div>
    </>
  );
}

export default ElasticCursor;

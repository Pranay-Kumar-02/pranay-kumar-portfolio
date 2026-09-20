"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { enableMotion, usePerfProfile } from "@/hooks/use-perf-profile";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "portfolio:motion-nudge-dismissed";

/**
 * When the visitor prefers reduced motion we turn the 3D / animated experience
 * off by default (accessible). This is a small, dismissible nudge that lets
 * them opt back into the full experience if they want it. Only shown when
 * reduced-motion is the *actionable* reason the 3D is off (not on genuinely
 * low-end hardware, where enabling wouldn't bring the scene back).
 */
export default function MotionNudge() {
  const { ready, rawReducedMotion, motionEnabled, lowEnd } = usePerfProfile();
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!ready || !rawReducedMotion || motionEnabled || lowEnd || dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-[min(92vw,22rem)] -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0",
        "rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur"
      )}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      <p className="pr-6 text-sm font-medium text-foreground">
        Reduced motion is on
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        The interactive 3D scene and animations are turned off. Want the full
        experience?
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={enableMotion}>
          Enable 3D
        </Button>
        <Button size="sm" variant="ghost" onClick={dismiss}>
          No thanks
        </Button>
      </div>
    </div>
  );
}

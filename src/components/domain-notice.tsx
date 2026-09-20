"use client";

import * as React from "react";
import { X } from "lucide-react";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";

// unset (the default) = nothing renders. set it only while migrating off an old domain.
const legacyHost = process.env.NEXT_PUBLIC_LEGACY_HOST;
const DISMISS_KEY = "portfolio:domain-move-dismissed";

export default function DomainNotice() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!legacyHost) return;
    try {
      setShow(localStorage.getItem(DISMISS_KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-[min(92vw,22rem)] -translate-x-1/2 sm:left-4 sm:translate-x-0",
        "rounded-xl border border-border bg-background/95 p-3 pr-9 shadow-lg backdrop-blur",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
      )}
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="line-through">{legacyHost}</span> is now{" "}
        <span className="font-medium text-foreground">
          {new URL(config.site).host}
        </span>{" "}
        — update your bookmarks.
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

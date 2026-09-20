"use client";

import { Zap, ZapOff } from "lucide-react";
import { setMotionPreference, usePerfProfile } from "@/hooks/use-perf-profile";
import { Button } from "./ui/button";

/**
 * Menu control to toggle reduced motion. Flips the effective motion state to an
 * explicit, persisted preference: turning it off drops the 3D scene, particles
 * and decorative animations; turning it on brings them back — overriding the OS
 * `prefers-reduced-motion` setting either way.
 */
export default function MotionToggle({ className }: { className?: string }) {
  const { ready, reducedMotion } = usePerfProfile();
  // Until client detection runs, render the stable "motion on" state to match SSR.
  const motionOn = ready ? !reducedMotion : true;
  const Icon = motionOn ? Zap : ZapOff;

  return (
    <Button
      onClick={() => setMotionPreference(reducedMotion ? "on" : "off")}
      aria-pressed={reducedMotion}
      aria-label={motionOn ? "Reduce motion and disable 3D" : "Enable motion and 3D"}
      className={'bg-transparent gap-2 flex text-muted group hover:bg-transparent border-2 text-xs'}
      size={'sm'}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-medium text-foreground/70 transition-colors group-hover:text-foreground">
          {motionOn ? "Reduce motion" : "Enable motion"}
        </span>
        {/* <span className="text-[11px] text-muted-foreground/70"> */}
        {/* {motionOn ? "Turn off 3D & animations" : "Turn on 3D & animations"} */}
        {/* </span> */}
      </span>
    </Button>
  );
}

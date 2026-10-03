"use client";

import * as React from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useSoundtrack } from "@/contexts/soundtrack-context";
import { cn } from "@/lib/utils";

export default function SoundtrackControls({
  className,
}: {
  className?: string;
}) {
  const { isPlaying, isMuted, togglePlay, toggleMute, trackTitle } =
    useSoundtrack();

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 select-none pointer-events-auto",
        className
      )}
      role="region"
      aria-label="Portfolio soundtrack controls"
    >
      {/* Dedicated Mute / Unmute Button */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute soundtrack" : "Mute soundtrack"}
        title={isMuted ? "Unmute soundtrack" : "Mute soundtrack"}
        className={cn(
          "group relative flex items-center justify-center h-6.5 w-6.5 sm:h-7 sm:w-7 rounded-full",
          "bg-black/30 hover:bg-black/50 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/70",
          "border border-white/10 hover:border-cyan-500/40 dark:border-white/10 dark:hover:border-cyan-500/40",
          "backdrop-blur-md shadow-sm transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50",
          isMuted ? "text-zinc-500" : "text-zinc-300 hover:text-cyan-300"
        )}
      >
        {isMuted ? (
          <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:scale-105 text-cyan-400/90" />
        )}
      </button>

      {/* Music Track Play / Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
        title={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
        className={cn(
          "group relative flex items-center gap-1.5 h-6.5 px-2.5 sm:h-7 sm:px-2.5 rounded-full",
          "bg-black/30 hover:bg-black/50 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/70",
          "border border-white/10 hover:border-cyan-500/40 dark:border-white/10 dark:hover:border-cyan-500/40",
          "backdrop-blur-md shadow-sm transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50",
          isPlaying
            ? "text-zinc-200 border-cyan-500/25 dark:border-cyan-500/30"
            : "text-zinc-400 hover:text-zinc-200"
        )}
      >
        {isPlaying ? (
          <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 fill-cyan-400/40 transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 text-zinc-400 group-hover:text-cyan-300 fill-current transition-transform duration-200 group-hover:scale-105" />
        )}

        <span className="text-[10.5px] sm:text-[11px] font-sans font-medium tracking-wide flex items-center gap-1">
          <span className="text-cyan-400/80 font-normal">♪</span>
          <span>{trackTitle}</span>
        </span>

        {/* Subtle Animated Equalizer Indicator */}
        <div
          className="flex items-end gap-[2px] h-3 ml-0.5 pl-0.5"
          aria-hidden="true"
        >
          <span
            className={cn(
              "w-[2px] rounded-full transition-all duration-300",
              isPlaying && !isMuted
                ? "bg-cyan-400 animate-sound-bar-1"
                : "bg-zinc-600/50 h-[3px]"
            )}
          />
          <span
            className={cn(
              "w-[2px] rounded-full transition-all duration-300",
              isPlaying && !isMuted
                ? "bg-cyan-400 animate-sound-bar-2"
                : "bg-zinc-600/50 h-[3px]"
            )}
          />
          <span
            className={cn(
              "w-[2px] rounded-full transition-all duration-300",
              isPlaying && !isMuted
                ? "bg-cyan-400 animate-sound-bar-3"
                : "bg-zinc-600/50 h-[3px]"
            )}
          />
        </div>
      </button>
    </div>
  );
}

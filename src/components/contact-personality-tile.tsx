"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ContactPersonalityTileProps {
  className?: string;
}

export const ContactPersonalityTile: React.FC<ContactPersonalityTileProps> = ({
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.aside
      aria-label="Direct inbox channel note"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className={cn(
        "relative select-none pointer-events-auto z-20",
        className
      )}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -3, 0],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          // Precise compact sizing: 270px wide, ~110-120px height
          "w-[270px] sm:w-[280px]",
          "p-3.5",
          // Subtle corner radius - not a huge rounded card
          "rounded-lg",
          // Dark obsidian / black surface - no heavy blur or giant glass
          "bg-[#09090b] text-zinc-100",
          // Extremely subtle border with restrained cyan accent
          "border border-zinc-800/90 hover:border-cyan-500/30 transition-colors duration-200",
          // Slight depth / shadow
          "shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
        )}
      >
        {/* Tiny, understated status indicator */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="size-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
          <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-semibold uppercase">
            LIVE
          </span>
        </div>

        {/* Compact, confident headline */}
        <h4 className="text-[13px] font-semibold text-zinc-100 tracking-tight leading-snug">
          bro, it actually works.
        </h4>

        {/* Supporting copy */}
        <p className="text-[11px] text-zinc-400 leading-snug mt-1">
          You can enter your details, write your message, and I&apos;ll actually receive it.
        </p>

        {/* Small witty final line */}
        <p className="text-[10px] text-zinc-500 font-mono mt-1.5">
          So yeah… go ahead. I&apos;ll read it lol.
        </p>
      </motion.div>
    </motion.aside>
  );
};

export default ContactPersonalityTile;

"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ContactPersonalityTileProps {
  className?: string;
}

export const ContactPersonalityTile: React.FC<ContactPersonalityTileProps> = ({
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, {
    amount: 0.2,
    once: false,
  });

  return (
    <motion.aside
      ref={containerRef}
      aria-label="Direct inbox channel note"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: shouldReduceMotion ? 0 : 16 }
      }
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative select-none pointer-events-auto z-20",
        className
      )}
    >
      {/*
        PREMIUM ART-DIRECTED TWISTED ARROW CONNECTOR
        - Origin: Precision glowing anchor node on Personality Tile
        - Arch / Turn 1: Sweeps up & left into open negative space
        - S-Twist: Controlled descent through channel between cards
        - Turn 2: Directional sweep toward Contact Form
        - Terminal: Precision horizontal vector + sculpted wings
        - Theme Palette: Luminous Ice Cyan (#a5f3fc) to Electric Sky (#38bdf8)
      */}
      <svg
        aria-hidden="true"
        viewBox="0 0 170 140"
        className="absolute -left-[100px] -top-[48px] w-[165px] h-[135px] pointer-events-none overflow-visible hidden md:block"
        style={{ filter: "drop-shadow(0 0 10px rgba(34, 211, 238, 0.4))" }}
      >
        <defs>
          {/* Luminous Ice-Cyan to Electric-Sky Gradient matching site accents */}
          <linearGradient
            id="premiumTwistedArrowGrad"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#a5f3fc" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Ambient Anchor Halo & Core Node on Personality Tile */}
        <motion.circle
          cx="148"
          cy="52"
          r="6"
          fill="#38bdf8"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView
              ? { opacity: [0, 0.5, 0.25], scale: [0, 1.5, 1] }
              : { opacity: 0, scale: 0 }
          }
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <motion.circle
          cx="148"
          cy="52"
          r="2.5"
          fill="#38bdf8"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <circle cx="148" cy="52" r="1.2" fill="#ffffff" />

        {/* Master Twisted S-Bend Vector Path */}
        <motion.path
          d="M 148 52 C 122 22, 92 12, 72 26 C 52 42, 58 68, 76 78 C 96 88, 92 110, 62 118 C 42 123, 22 123, 8 123"
          fill="none"
          stroke="url(#premiumTwistedArrowGrad)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 1.15,
            ease: [0.16, 1, 0.3, 1],
            delay: shouldReduceMotion ? 0 : 0.18,
          }}
        />

        {/* Sculpted Sleek Arrowhead Wings pointing into Contact Form */}
        <motion.path
          d="M 19 115.5 L 7 123 L 19 130.5"
          fill="none"
          stroke="url(#premiumTwistedArrowGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.25,
            ease: "easeOut",
            delay: shouldReduceMotion ? 0 : 1.1,
          }}
        />
      </svg>

      {/* Personality Tile Card Content */}
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
          "w-[270px] sm:w-[280px]",
          "p-3.5",
          "rounded-lg",
          "bg-[#09090b] text-zinc-100",
          "border border-zinc-800/90 hover:border-cyan-500/30 transition-colors duration-200",
          "shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
        )}
      >
        <h4 className="text-[13px] font-semibold text-zinc-100 tracking-tight leading-snug">
          bro, it actually works.
        </h4>

        <p className="text-[11px] text-zinc-400 leading-snug mt-1">
          You can enter your details, write your message, and I&apos;ll actually receive it.
        </p>

        <p className="text-[10px] text-zinc-500 font-mono mt-1.5">
          So yeah… go ahead. I&apos;ll read it lol.
        </p>
      </motion.div>
    </motion.aside>
  );
};

export default ContactPersonalityTile;

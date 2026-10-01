"use client";

import React, { useRef, type CSSProperties } from "react";
import SectionWrapper from "../ui/section-wrapper";
import { useActiveInterest } from "@/lib/active-interest";
import { SKILLS, SkillNames } from "@/data/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Bot,
  Palette,
  Layers,
  ArrowUpRight,
  Compass,
  Radio,
  CheckCircle2,
  RefreshCw,
  Zap,
} from "lucide-react";

// Curated domain iconography
const DOMAIN_ICONS: Record<string, React.ElementType> = {
  "ai-ml": Brain,
  "llms-rag": Sparkles,
  "infosec": ShieldCheck,
  "open-source": GitBranch,
  "ai-agents": Bot,
  "creative-engineering": Palette,
};

export const InterestsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10% 0px -10% 0px" });

  const {
    interests,
    activeInterest,
    lockedInterest,
    setLockedInterest,
    setHoveredInterest,
  } = useActiveInterest();

  return (
    <SectionWrapper
      id="interests"
      className="w-full min-h-screen md:min-h-[140dvh] relative py-20 pointer-events-none"
    >
      <div
        ref={sectionRef}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-start justify-start pt-6 md:pt-10"
      >
        {/* ============================================================== */}
        {/* 1. DEDICATED SECTION HEADER (ZERO OVERLAP WITH CARDS)          */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md lg:max-w-lg flex flex-col items-start mb-6 md:mb-10 pointer-events-auto relative z-20"
        >
          {/* Elite Kicker Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/25 bg-sky-500/10 backdrop-blur-xl mb-3 shadow-[0_0_20px_-3px_rgba(56,189,248,0.25)]">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-sky-500" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-sky-300">
              Interactive 3D Hardware Telemetry
            </span>
          </div>

          {/* Section Heading with High-End Gradient */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex flex-wrap items-center gap-2.5">
            <span>Technical</span>
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Interests & Focus
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Core engineering disciplines and system architectures. Hover or click any card to elevate its associated keycaps in real time on the 3D keyboard.
          </p>
        </motion.div>

        {/* ============================================================== */}
        {/* 2. SPLIT COMPOSITION: LEFT: CARDS & INSPECTOR | RIGHT: 3D KEYBOARD */}
        {/* ============================================================== */}
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
          {/* LEFT COLUMN: CARDS & CONTROLLER */}
          <div className="w-full lg:w-[52%] xl:w-[50%] flex flex-col gap-4 pointer-events-auto">
            {/* Grid of 6 Unique Domain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {interests.map((interest, idx) => {
                const IconComponent = DOMAIN_ICONS[interest.id] || Compass;
                const isSelected = lockedInterest?.id === interest.id;
                const isHovered = activeInterest?.id === interest.id;
                const isHighlighted = isSelected || isHovered;

                // Preview keycaps: top 3 primary skills
                const previewSkills = interest.primaryKeys
                  .map((k) => Object.values(SKILLS).find((s) => s.name === k))
                  .filter(Boolean)
                  .slice(0, 4);

                return (
                  <motion.div
                    key={interest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setLockedInterest(null);
                        } else {
                          setLockedInterest(interest);
                        }
                      }}
                      onPointerEnter={() => setHoveredInterest(interest)}
                      onPointerLeave={() => setHoveredInterest(null)}
                      style={{ "--interest-color": interest.color } as CSSProperties}
                      className={cn(
                        "w-full text-left relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300",
                        "border backdrop-blur-2xl flex flex-col justify-between min-h-[220px]",
                        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                        isHighlighted
                          ? "bg-slate-900/95 dark:bg-[#0c121e]/95 border-[var(--interest-color)] shadow-[0_0_30px_-8px_var(--interest-color)]"
                          : "bg-card/85 dark:bg-[#0b1019]/80 border-white/10 hover:border-white/25 hover:bg-card/95"
                      )}
                    >
                      {/* Ambient Bloom Glow */}
                      <div
                        style={{
                          background: `radial-gradient(circle at top right, ${interest.color}25 0%, transparent 70%)`,
                        }}
                        className={cn(
                          "absolute inset-0 pointer-events-none transition-opacity duration-300",
                          isHighlighted ? "opacity-100" : "opacity-0 hover:opacity-75"
                        )}
                      />

                      {/* Header Row: Icon + Subtitle Badge + Selection Status */}
                      <div className="relative z-10 w-full flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* Domain Icon Container */}
                          <div
                            style={{
                              backgroundColor: `${interest.color}18`,
                              borderColor: `${interest.color}40`,
                              color: interest.color,
                            }}
                            className={cn(
                              "size-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300",
                              isHighlighted ? "scale-110 shadow-[0_0_12px_var(--interest-color)]" : ""
                            )}
                          >
                            <IconComponent className="size-4.5" />
                          </div>

                          {/* Domain Category Pill */}
                          <span
                            style={{
                              color: interest.color,
                              backgroundColor: `${interest.color}15`,
                              borderColor: `${interest.color}30`,
                            }}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold tracking-wide uppercase shrink-0"
                          >
                            {interest.subtitle}
                          </span>
                        </div>

                        {/* Interactive Status Indicator */}
                        <div className="flex items-center gap-1.5">
                          {isSelected ? (
                            <span
                              style={{
                                backgroundColor: `${interest.color}20`,
                                borderColor: `${interest.color}60`,
                                color: interest.color,
                              }}
                              className="text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider flex items-center gap-1"
                            >
                              <span className="size-1.5 rounded-full bg-[var(--interest-color)] animate-ping" />
                              Locked
                            </span>
                          ) : (
                            <ArrowUpRight
                              className={cn(
                                "size-4 transition-all duration-200",
                                isHighlighted
                                  ? "text-[var(--interest-color)] translate-x-0.5 -translate-y-0.5 opacity-100"
                                  : "text-muted-foreground/30 opacity-60"
                              )}
                            />
                          )}
                        </div>
                      </div>

                      {/* Domain Title & Description */}
                      <div className="relative z-10 mt-3 mb-2">
                        <h3 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight group-hover:text-white transition-colors">
                          {interest.title}
                        </h3>
                        <p className="text-xs text-muted-foreground/90 leading-relaxed mt-1 line-clamp-2">
                          {interest.description}
                        </p>
                      </div>

                      {/* Interactive Keycap Icon Preview Strip */}
                      <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/90">
                            <Layers
                              style={{ color: isHighlighted ? interest.color : undefined }}
                              className="size-3.5 transition-colors"
                            />
                            <span className="font-semibold text-foreground/90">
                              {interest.primaryKeys.length} 3D Keys
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-muted-foreground/60">
                            {isSelected ? "Click to release" : "Hover to elevate"}
                          </span>
                        </div>

                        {/* Mini Keycap Pill Icons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {previewSkills.map((sk) => {
                            if (!sk) return null;
                            return (
                              <div
                                key={sk.name}
                                style={{
                                  borderColor: isHighlighted ? `${interest.color}50` : "rgba(255,255,255,0.08)",
                                  backgroundColor: isHighlighted ? `${interest.color}15` : "rgba(255,255,255,0.04)",
                                }}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium text-foreground/85 transition-colors"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={sk.icon}
                                  alt={sk.label}
                                  className="size-2.5 object-contain"
                                />
                                <span className="text-[9.5px] font-mono">{sk.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* ========================================================== */}
            {/* LIVE DOMAIN TELEMETRY CONTROLLER (INSPECTOR PANEL)        */}
            {/* ========================================================== */}
            <AnimatePresence mode="wait">
              {activeInterest ? (
                <motion.div
                  key={activeInterest.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  style={{ "--active-color": activeInterest.color } as CSSProperties}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border border-[var(--active-color)]/60",
                    "bg-slate-900/95 dark:bg-[#0b101c]/95 backdrop-blur-2xl shadow-[0_10px_35px_-10px_var(--active-color)]",
                    "flex flex-col gap-3.5 relative overflow-hidden"
                  )}
                >
                  {/* Specular highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--active-color)] to-transparent opacity-80" />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          backgroundColor: `${activeInterest.color}20`,
                          color: activeInterest.color,
                          borderColor: `${activeInterest.color}50`,
                        }}
                        className="size-9 rounded-xl border flex items-center justify-center font-bold shrink-0 shadow-[0_0_15px_var(--active-color)]"
                      >
                        <Radio className="size-4.5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--active-color)] font-bold">
                            Live 3D Hardware Telemetry
                          </span>
                          {lockedInterest?.id === activeInterest.id && (
                            <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                              Locked
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-base sm:text-lg text-foreground leading-tight">
                          {activeInterest.title}
                        </h4>
                      </div>
                    </div>

                    {lockedInterest && (
                      <button
                        type="button"
                        onClick={() => setLockedInterest(null)}
                        className="text-[11px] font-mono text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <RefreshCw className="size-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeInterest.description}
                  </p>

                  {/* All Elevated Keys Chips */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="size-3 text-[var(--active-color)]" />
                        Active Physical Keys ({activeInterest.primaryKeys.length})
                      </span>
                      <span className="text-[10px] font-mono text-[var(--active-color)] font-medium">
                        Elevated +40mm
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {activeInterest.primaryKeys.map((keyName) => {
                        const skill = Object.values(SKILLS).find(
                          (s) => s.name === keyName
                        );
                        if (!skill) return null;
                        return (
                          <div
                            key={skill.name}
                            style={{
                              borderColor: `${activeInterest.color}50`,
                              backgroundColor: `${activeInterest.color}15`,
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium text-foreground transition-transform hover:scale-105"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={skill.icon}
                              alt={skill.label}
                              className="size-3.5 object-contain"
                            />
                            <span>{skill.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-white/15 bg-card/60 dark:bg-[#0c121d]/60 backdrop-blur-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                      >
                        <Compass className="size-4.5" />
                      </motion.div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">
                        Explore Technical Domains
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Hover or click any domain above to elevate physical keys on the 3D keyboard.
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-muted-foreground/60 border border-white/10 px-2 py-1 rounded-md">
                    <span>6 Domains</span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: DEDICATED SPACE FOR 3D KEYBOARD */}
          <div
            className="hidden lg:block lg:w-[46%] xl:w-[48%] pointer-events-none min-h-[500px]"
            aria-hidden="true"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default InterestsSection;

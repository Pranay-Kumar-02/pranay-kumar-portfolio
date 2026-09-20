"use client";

import React, { useRef, type CSSProperties } from "react";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { useActiveInterest } from "@/lib/active-interest";
import { SKILLS, SkillNames } from "@/data/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Sparkles, Layers, ArrowUpRight, Compass } from "lucide-react";

export const InterestsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-10% 0px -10% 0px" });
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
      className="w-full min-h-screen md:min-h-[140dvh] relative pointer-events-none py-20"
    >
      <div
        ref={sectionRef}
        className="w-full h-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-start pt-12 md:pt-16"
      >
        <SectionHeader
          id="interests"
          title="Interests"
          desc="What I'm exploring and building around."
          className="relative mb-8 md:mb-12 pointer-events-auto"
        />

        {/* Floating Exploration Panel */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Top: Interest Selector Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pointer-events-auto">
            {interests.map((interest) => {
              const isSelected = lockedInterest?.id === interest.id;
              const isHovered = activeInterest?.id === interest.id;
              const isHighlighted = isSelected || isHovered;

              return (
                <button
                  key={interest.id}
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
                    "group relative text-left p-4 sm:p-4.5 rounded-2xl transition-all duration-200",
                    "border bg-card/85 dark:bg-[#0c1017]/85 backdrop-blur-xl shadow-lg",
                    isHighlighted
                      ? "border-[var(--interest-color)] shadow-[0_0_25px_-5px_var(--interest-color)] scale-[1.02]"
                      : "border-border/60 hover:border-border hover:bg-card/95"
                  )}
                >
                  {/* Subtle ambient glow pill */}
                  <div
                    style={{ backgroundColor: `${interest.color}15` }}
                    className={cn(
                      "absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none transition-opacity duration-300",
                      isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    )}
                  />

                  <div className="relative z-10 flex flex-col justify-between h-full gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{
                          color: interest.color,
                          backgroundColor: `${interest.color}18`,
                          borderColor: `${interest.color}35`,
                        }}
                        className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full border font-medium shrink-0"
                      >
                        {interest.subtitle}
                      </span>
                      <span
                        className={cn(
                          "size-2 rounded-full transition-all duration-200",
                          isSelected
                            ? "bg-[var(--interest-color)] ring-4 ring-[var(--interest-color)]/20 animate-pulse"
                            : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                        )}
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-foreground flex items-center justify-between gap-2">
                        <span>{interest.title}</span>
                        <ArrowUpRight
                          className={cn(
                            "size-4 transition-transform duration-200 shrink-0",
                            isHighlighted
                              ? "text-[var(--interest-color)] translate-x-0.5 -translate-y-0.5"
                              : "text-muted-foreground/40 opacity-0 group-hover:opacity-100"
                          )}
                        />
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                        {interest.description}
                      </p>
                    </div>

                    {/* Key Count Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 pt-1">
                      <Layers className="size-3 text-[var(--interest-color)]" />
                      <span>
                        {interest.primaryKeys.length} primary keys
                        {interest.secondaryKeys.length > 0 &&
                          ` + ${interest.secondaryKeys.length} supporting`}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right / HUD Panel: Active Cluster Details */}
          <div className="lg:col-span-5 pointer-events-auto">
            <AnimatePresence mode="wait">
              {activeInterest ? (
                <motion.div
                  key={activeInterest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ "--active-color": activeInterest.color } as CSSProperties}
                  className={cn(
                    "p-5 sm:p-6 rounded-2xl border border-[var(--active-color)]/50",
                    "bg-card/95 dark:bg-[#0c1017]/95 backdrop-blur-2xl shadow-2xl",
                    "flex flex-col gap-4"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor: `${activeInterest.color}20`,
                          color: activeInterest.color,
                        }}
                        className="size-8 rounded-lg flex items-center justify-center font-bold"
                      >
                        <Compass className="size-4.5 animate-spin-slow" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-[var(--active-color)] uppercase tracking-wider font-semibold">
                          3D Cluster Engaged
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight">
                          {activeInterest.title}
                        </h3>
                      </div>
                    </div>
                    {lockedInterest?.id === activeInterest.id && (
                      <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeInterest.description}
                  </p>

                  {/* Primary Clustered Keys */}
                  <div className="flex flex-col gap-2 pt-1 border-t border-border/60">
                    <span className="text-[11px] font-mono text-muted-foreground font-medium uppercase tracking-wider">
                      Primary Clustered Keys (Elevated)
                    </span>
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
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium text-foreground transition-transform hover:scale-105"
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

                  {/* Supporting Keys if any */}
                  {activeInterest.secondaryKeys.length > 0 && (
                    <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
                      <span className="text-[11px] font-mono text-muted-foreground font-medium uppercase tracking-wider">
                        Supporting Keys (Subtle Lift)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeInterest.secondaryKeys.map((keyName) => {
                          const skill = Object.values(SKILLS).find(
                            (s) => s.name === keyName
                          );
                          if (!skill) return null;
                          return (
                            <div
                              key={skill.name}
                              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-border/80 bg-secondary/30 text-[11px] font-medium text-muted-foreground"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={skill.icon}
                                alt={skill.label}
                                className="size-3 object-contain opacity-80"
                              />
                              <span>{skill.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-muted-foreground/70 flex items-center gap-1.5">
                    <Sparkles className="size-3 text-[var(--active-color)]" />
                    <span>Watch the physical 3D keycaps lift and group into a spatial cluster</span>
                  </div>
                </motion.div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-border/80 bg-card/60 dark:bg-[#0c1017]/60 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Compass className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      Explore Technical Domains
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                      Hover or click any interest card to cluster the 24 physical keyboard keys into domain-specific clusters.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default InterestsSection;

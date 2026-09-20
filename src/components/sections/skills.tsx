"use client";

import { useRef, type CSSProperties } from "react";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { SKILLS } from "@/data/constants";
import { usePerfProfile } from "@/hooks/use-perf-profile";
import { useActiveSkill } from "@/lib/active-skill";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Sparkles } from "lucide-react";

/**
 * Tech-stack section.
 *
 * On capable devices the skills live in the interactive 3D keyboard's keycaps,
 * with a clean, dedicated 2D HUD card in the lower-left safe area showing
 * the selected skill's verified information.
 * When 3D is disabled (low-end / reduced-motion), render an HTML grid fallback.
 */
const SkillsSection = () => {
  const { disable3D, ready } = usePerfProfile();
  const showGrid = ready && disable3D;
  const activeSkill = useActiveSkill();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-5% 0px -5% 0px" });

  if (showGrid) {
    return (
      <SectionWrapper
        id="skills"
        className="flex w-full min-h-screen flex-col justify-center py-24"
      >
        <SectionHeader
          id="skills"
          title="Tech Stack"
          desc="Explore the technologies I work with."
          className="static mb-14"
        />
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Object.values(SKILLS).map((skill) => (
            <li
              key={skill.name}
              style={{ "--skill": skill.color } as CSSProperties}
              className={cn(
                "pointer-events-auto",
                "group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl p-5",
                "border border-border/60 bg-secondary/20 backdrop-blur-sm",
                "transition-[transform,border-color,background-color,box-shadow] duration-300",
                "hover:-translate-y-1 hover:border-[var(--skill)] hover:bg-secondary/40",
                "hover:shadow-[0_10px_40px_-12px_var(--skill)]"
              )}
            >
              <span
                aria-hidden
                style={{ background: "var(--skill)" }}
                className="pointer-events-none absolute -top-6 h-16 w-16 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.icon}
                alt={skill.label}
                width={44}
                height={44}
                loading="lazy"
                className="relative size-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110 md:size-11"
              />
              <span className="relative text-center text-xs font-medium text-foreground/80 transition-colors group-hover:text-foreground md:text-sm">
                {skill.label}
              </span>
            </li>
          ))}
        </ul>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="skills"
      className="w-full h-screen md:h-[150dvh] pointer-events-none relative"
    >
      <div ref={sectionRef} className="w-full h-full flex flex-col items-center justify-start pt-20 md:pt-24">
        <SectionHeader id="skills" title="Tech Stack" desc="Explore the technologies I work with." />

        {/* Clean 2D Selected Skill Information Card */}
        <AnimatePresence>
          {(isInView || Boolean(activeSkill)) && (
            <motion.aside
              aria-label="Selected Skill Information"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed bottom-6 left-4 sm:left-6 md:left-12 lg:left-16 z-30 max-w-[340px] sm:max-w-sm md:max-w-md w-[calc(100vw-2rem)] sm:w-full pointer-events-auto"
            >
              {activeSkill ? (
                <div
                  key={activeSkill.name}
                  style={{ "--skill-color": activeSkill.color } as CSSProperties}
                  className={cn(
                    "w-full flex items-start gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl",
                    "bg-card/95 dark:bg-[#0c1017]/95 backdrop-blur-2xl",
                    "border border-[var(--skill-color)]/40 shadow-2xl",
                    "transition-all duration-150"
                  )}
                >
                  {/* Brand Icon Box */}
                  <div
                    style={{
                      backgroundColor: `${activeSkill.color}18`,
                      borderColor: `${activeSkill.color}45`,
                    }}
                    className="shrink-0 size-12 rounded-xl flex items-center justify-center border p-2.5 shadow-sm transition-colors duration-150"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeSkill.icon}
                      alt={activeSkill.label}
                      className="size-7 object-contain drop-shadow"
                    />
                  </div>

                  {/* Skill Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-base sm:text-lg tracking-tight text-foreground truncate">
                        {activeSkill.label}
                      </h4>
                      <span
                        style={{
                          color: activeSkill.color,
                          backgroundColor: `${activeSkill.color}15`,
                          borderColor: `${activeSkill.color}35`,
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full border font-medium shrink-0 transition-colors duration-150"
                      >
                        Verified
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-3">
                      {activeSkill.shortDescription}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key="idle-hint"
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground/90 px-4 py-3 rounded-2xl border border-border/70 bg-card/90 dark:bg-[#0c1017]/90 backdrop-blur-xl shadow-lg"
                >
                  <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="size-3.5 animate-pulse" />
                  </div>
                  <span>Hover or press any 3D keycap to inspect skill details</span>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
};

export default SkillsSection;

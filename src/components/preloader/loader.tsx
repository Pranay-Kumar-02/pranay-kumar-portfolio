"use client";
import styles from "./style.module.scss";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { opacity, slideUp } from "./anim";
import { usePreloader } from ".";
import { useSoundtrack } from "@/contexts/soundtrack-context";
import { unlockAudioContext } from "@/components/realtime/hooks/use-sounds";

export default function Index() {
  const { loadingPercent, enterExperience } = usePreloader();
  const { startExperienceSoundtrack } = useSoundtrack();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, delay: 0.3 },
    },
  };

  const clampedPercent = Math.min(100, Math.max(0, loadingPercent));
  const integerPercent = Math.min(100, Math.floor(clampedPercent));
  const isLoaded = clampedPercent >= 100;

  const handleEnter = useCallback(async () => {
    if (isEntering) return;
    setIsEntering(true);

    // 1. Unlock Web AudioContext for keyboard hover audio
    try {
      await unlockAudioContext();
    } catch (e) {
      console.warn("[Loader] AudioContext unlock notice:", e);
    }

    // 2. Start M83 - Outro at exactly 90 seconds (1:30) with target volume ~0.25
    try {
      startExperienceSoundtrack();
    } catch (e) {
      console.warn("[Loader] Soundtrack play notice:", e);
    }

    // 3. Smooth transition to dismiss loader (~500-800ms)
    setTimeout(() => {
      enterExperience();
    }, 150);
  }, [isEntering, enterExperience, startExperienceSoundtrack]);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          {/* Centered Initialization Message, Progress Bar & Enter Experience CTA */}
          <div className={styles.messageContainer}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className={styles.messageInner}
            >
              <p className={styles.messageText}>
                Initializing Pranay… please act like the loading was worth it.
              </p>
              <div className={styles.progressBarTrack} aria-hidden="true">
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${clampedPercent}%` }}
                />
              </div>

              {/* Reveal ENTER EXPERIENCE → once loading reaches 100% */}
              <div className="min-h-[56px] flex items-center justify-center mt-6 sm:mt-8">
                <AnimatePresence>
                  {isLoaded && (
                    <motion.button
                      type="button"
                      onClick={handleEnter}
                      disabled={isEntering}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: isEntering ? 0.7 : 1,
                        y: 0,
                        scale: isEntering ? 0.98 : 1,
                      }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative pointer-events-auto inline-flex items-center gap-2.5 px-3 py-2 cursor-pointer select-none bg-transparent border-0 outline-none focus-visible:outline-none focus:outline-none"
                      aria-label="Enter Experience"
                    >
                      <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-[0.22em] uppercase text-zinc-300 group-hover:text-cyan-300 transition-colors duration-200">
                        ENTER EXPERIENCE
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-xs sm:text-[13px] text-cyan-400 font-mono transform transition-transform duration-200 ease-out group-hover:translate-x-1"
                      >
                        →
                      </span>
                      {/* Refined subtle underline with restrained cyan reveal */}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[1.5px] w-full bg-zinc-800 transition-colors duration-200 group-hover:bg-cyan-500/40"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-cyan-400 transition-all duration-300 ease-out group-hover:w-full"
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Bottom-Right Percentage Display (Smooth 0% → 100%) */}
          <motion.div
            variants={opacity}
            initial="initial"
            animate="enter"
            className={styles.percentageContainer}
          >
            <span className={styles.percentageNumber}>{integerPercent}</span>
            <span className={styles.percentageSymbol}>%</span>
          </motion.div>

          {/* Dennis Snellenberg curved curtain reveal SVG */}
          <svg>
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}

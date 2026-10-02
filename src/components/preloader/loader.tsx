"use client";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { opacity, slideUp } from "./anim";
import { usePreloader } from ".";

export default function Index() {
  const { loadingPercent } = usePreloader();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

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

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          {/* Centered Initialization Message & Synchronized Progress Bar */}
          <div className={styles.messageContainer}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: clampedPercent >= 98 ? 0 : 1,
                y: clampedPercent >= 98 ? -4 : 0,
              }}
              transition={{
                duration: clampedPercent >= 98 ? 0.35 : 0.7,
                ease: "easeOut",
                delay: clampedPercent >= 98 ? 0 : 0.2,
              }}
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
            </motion.div>
          </div>

          {/* Bottom-Right Percentage Display (Smooth 0% → 100% without rounding jumps) */}
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

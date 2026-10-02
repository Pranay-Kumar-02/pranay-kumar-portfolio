"use client";
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

import Loader from "./loader";
import gsap from "gsap";
import { usePerfProfile } from "@/hooks/use-perf-profile";

type PreloaderContextType = {
  isLoading: boolean;
  loadingPercent: number;
  bypassLoading: () => void;
};
const INITIAL: PreloaderContextType = {
  isLoading: true,
  loadingPercent: 0,
  bypassLoading: () => {},
};
export const preloaderContext = createContext<PreloaderContextType>(INITIAL);

type PreloaderProps = {
  children: ReactNode;
  disabled?: boolean;
};

export const usePreloader = () => {
  const context = useContext(preloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};

// 4.8 seconds gives the visitor approximately 2–3 extra seconds to comfortably read
// "Initializing Pranay… please act like the loading was worth it." without feeling slow.
const LOADING_TIME = 4.8;

function Preloader({ children, disabled = false }: PreloaderProps) {
  const pathname = usePathname();
  // Skip the loading splash for the résumé and blog routes (and anywhere it's disabled).
  const skip =
    disabled ||
    pathname?.startsWith("/resume") ||
    pathname?.startsWith("/blogs") ||
    pathname?.startsWith("/blog");

  const [isLoading, setIsLoading] = useState(!skip);
  const [loadingPercent, setLoadingPercent] = useState(skip ? 100 : 0);
  const loadingTween = useRef<gsap.core.Tween>(null);
  const completionTimeout = useRef<NodeJS.Timeout | null>(null);

  // The splash exists to mask initial asset loading and provide the cinematic entrance.
  const { disable3D, ready: perfReady } = usePerfProfile();

  const bypassLoading = () => {
    if (completionTimeout.current) clearTimeout(completionTimeout.current);
    loadingTween.current?.kill();
    setLoadingPercent(100);
    setIsLoading(false);
  };

  useEffect(() => {
    if (perfReady && disable3D) bypassLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfReady, disable3D]);

  const loadingPercentRef = useRef<{ value: number }>({ value: 0 });

  useEffect(() => {
    if (skip) return;

    // Smooth continuous cinematic progression 0% -> 100%
    loadingTween.current = gsap.to(loadingPercentRef.current, {
      value: 100,
      duration: LOADING_TIME,
      ease: "power1.inOut",
      onUpdate: () => {
        setLoadingPercent(loadingPercentRef.current.value);
      },
      onComplete: () => {
        setLoadingPercent(100);
        // Brief intentional pause at 100% so the user registers full completion
        completionTimeout.current = setTimeout(() => {
          setIsLoading(false);
        }, 180);
      },
    });

    return () => {
      loadingTween.current?.kill();
      if (completionTimeout.current) clearTimeout(completionTimeout.current);
    };
  }, [skip]);

  return (
    <preloaderContext.Provider
      value={{ isLoading, bypassLoading, loadingPercent }}
    >
      <AnimatePresence mode="wait">{isLoading && <Loader />}</AnimatePresence>
      {children}
    </preloaderContext.Provider>
  );
}

export default Preloader;

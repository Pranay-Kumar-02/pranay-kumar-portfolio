"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

interface SoundtrackContextType {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  trackTitle: string;
  isReady: boolean;
}

const SoundtrackContext = createContext<SoundtrackContextType | null>(null);

const AUDIO_SRC = "/audio/M83 - Outro.mp3";
const START_TIME = 90; // Exactly 1:30 into the track
const TARGET_VOLUME = 0.25; // Subtle cinematic background volume around 25%
const FADE_IN_DURATION = 1600; // Smooth 1.6s fade-in
const FADE_OUT_DURATION = 350; // Smooth 350ms fade-out for muting

export function SoundtrackProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  const fadeAnimRef = useRef<number | null>(null);
  const fallbackRegisteredRef = useRef<boolean>(false);

  isMutedRef.current = isMuted;
  isPlayingRef.current = isPlaying;

  const fadeVolume = useCallback(
    (targetVol: number, durationMs: number, onEnd?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (fadeAnimRef.current !== null) {
        cancelAnimationFrame(fadeAnimRef.current);
        fadeAnimRef.current = null;
      }

      const startVol = audio.volume;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Smooth sine ease-in-out curve
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        const currentVol = startVol + (targetVol - startVol) * easeProgress;
        audio.volume = Math.max(0, Math.min(1, currentVol));

        if (progress < 1) {
          fadeAnimRef.current = requestAnimationFrame(step);
        } else {
          audio.volume = targetVol;
          fadeAnimRef.current = null;
          if (onEnd) onEnd();
        }
      };

      fadeAnimRef.current = requestAnimationFrame(step);
    },
    []
  );

  const cleanupFallback = useCallback(() => {
    fallbackRegisteredRef.current = false;
    window.removeEventListener("pointerdown", handleUserInteraction);
    window.removeEventListener("keydown", handleUserInteraction);
    window.removeEventListener("touchstart", handleUserInteraction);
    window.removeEventListener("touchend", handleUserInteraction);
    window.removeEventListener("click", handleUserInteraction);
    window.removeEventListener("scroll", handleUserInteraction);
    window.removeEventListener("wheel", handleUserInteraction);
  }, []);

  const handleUserInteraction = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasStartedRef.current) return;

    if (audio.currentTime < 89.5) {
      audio.currentTime = START_TIME;
    }
    audio.muted = false;
    audio.volume = 0; // Starts from volume 0 for the smooth fade-in

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          cleanupFallback();
          hasStartedRef.current = true;
          setIsPlaying(true);
          if (!isMutedRef.current) {
            fadeVolume(TARGET_VOLUME, FADE_IN_DURATION);
          }
        })
        .catch((err) => {
          // If NotAllowedError (e.g. passive wheel event without gesture), silently keep listeners active
          if (err.name !== "NotAllowedError") {
            console.warn("[Soundtrack] User gesture play notice:", err.name);
          }
        });
    }
  }, [cleanupFallback, fadeVolume]);

  const registerFallback = useCallback(() => {
    if (fallbackRegisteredRef.current || hasStartedRef.current) return;
    fallbackRegisteredRef.current = true;

    window.addEventListener("pointerdown", handleUserInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", handleUserInteraction, {
      passive: true,
    });
    window.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });
    window.addEventListener("touchend", handleUserInteraction, {
      passive: true,
    });
    window.addEventListener("click", handleUserInteraction, {
      passive: true,
    });
    window.addEventListener("scroll", handleUserInteraction, {
      passive: true,
    });
    window.addEventListener("wheel", handleUserInteraction, {
      passive: true,
    });
  }, [handleUserInteraction]);

  // Initialize and attempt audible autoplay IMMEDIATELY on initial page load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.muted = false; // Must be false for audible autoplay attempt
    audio.volume = 0; // Starts from volume 0 for the smooth fade-in
    audio.preload = "auto";
    audioRef.current = audio;
    (window as any).__soundtrackAudio = audio;

    const debugState: any = {
      audioElementExists: true,
      audioSource: audio.src || AUDIO_SRC,
      currentTimeBeforePlay: 0,
      volume: audio.volume,
      targetVolume: TARGET_VOLUME,
      muted: audio.muted,
      playCalled: false,
      playResult: "pending",
      errorName: null,
      errorMessage: null,
      timestamp: new Date().toISOString(),
    };
    (window as any).__soundtrackDebug = debugState;

    const executeAutoplay = () => {
      if (hasStartedRef.current) return;

      // Ensure playback position is strictly 90 seconds before play()
      try {
        audio.currentTime = START_TIME;
      } catch (err) {
        // Ignored; handled by loadedmetadata
      }

      debugState.currentTimeBeforePlay = audio.currentTime;
      debugState.playCalled = true;
      debugState.muted = audio.muted;
      debugState.volume = audio.volume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
            setIsPlaying(true);
            debugState.playResult = "resolved";
            if (!isMutedRef.current) {
              fadeVolume(TARGET_VOLUME, FADE_IN_DURATION);
            }
          })
          .catch((err: any) => {
            // Expected browser autoplay policy rejection on fresh domain visit
            // Handle gracefully: do NOT use console.error, do NOT pop up error UI
            debugState.playResult = "rejected";
            debugState.errorName = err.name;
            debugState.errorMessage = err.message;

            // Register one-time fallback for first legitimate user interaction
            registerFallback();
          });
      } else {
        registerFallback();
      }
    };

    const handleLoadedMetadata = () => {
      if (!hasStartedRef.current && audio.currentTime < 89.5) {
        audio.currentTime = START_TIME;
      }
      setIsReady(true);
      executeAutoplay();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (audio.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      executeAutoplay();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (fadeAnimRef.current !== null) {
        cancelAnimationFrame(fadeAnimRef.current);
      }
      audio.pause();
    };
  }, [fadeVolume, registerFallback]);

  useEffect(() => {
    return () => {
      cleanupFallback();
    };
  }, [cleanupFallback]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    cleanupFallback();

    if (isPlayingRef.current) {
      // Pause: immediate UI feedback, preserve exact current playback position
      setIsPlaying(false);
      audio.pause();
    } else {
      // Play: resume from exact current position, or initialize to 90s if fresh
      if (!hasStartedRef.current) {
        audio.currentTime = START_TIME;
        hasStartedRef.current = true;
      }
      audio.muted = false;
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          if (!isMutedRef.current) {
            fadeVolume(TARGET_VOLUME, 400);
          }
        })
        .catch((err) => {
          if (err.name !== "NotAllowedError") {
            console.warn("[Soundtrack] Play notice:", err.name);
          }
        });
    }
  }, [cleanupFallback, fadeVolume]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMutedRef.current) {
      // Unmute: smoothly restore volume to 25% without pausing or resetting position
      setIsMuted(false);
      fadeVolume(TARGET_VOLUME, 400);
    } else {
      // Mute: smoothly fade volume to 0 without pausing or resetting position
      setIsMuted(true);
      fadeVolume(0, FADE_OUT_DURATION);
    }
  }, [fadeVolume]);

  return (
    <SoundtrackContext.Provider
      value={{
        isPlaying,
        isMuted,
        togglePlay,
        toggleMute,
        trackTitle: "Outro",
        isReady,
      }}
    >
      {children}
    </SoundtrackContext.Provider>
  );
}

export function useSoundtrack() {
  const context = useContext(SoundtrackContext);
  if (!context) {
    throw new Error("useSoundtrack must be used within a SoundtrackProvider");
  }
  return context;
}

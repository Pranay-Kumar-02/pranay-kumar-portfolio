import { useCallback, useRef } from "react";

// Module-level singletons for instant, zero-latency audio playback
let sharedAudioCtx: AudioContext | null = null;
let pressAudioBuffer: AudioBuffer | null = null;
let releaseAudioBuffer: AudioBuffer | null = null;
let confettiAudioBuffer: AudioBuffer | null = null;
let isAudioInitialized = false;

// Pre-create HTMLAudioElement fallback pool for instant first-hit playback
let fallbackPressAudio: HTMLAudioElement | null = null;
let fallbackReleaseAudio: HTMLAudioElement | null = null;

const GESTURE_EVENTS = [
  "pointerdown",
  "mousedown",
  "click",
  "touchstart",
  "touchend",
  "keydown",
] as const;

function removeUnlockListeners() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  GESTURE_EVENTS.forEach((evt) => {
    window.removeEventListener(evt, handleFirstUserGesture, true);
    document.removeEventListener(evt, handleFirstUserGesture, true);
  });
}

function handleFirstUserGesture() {
  if (!sharedAudioCtx && typeof window !== "undefined") {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass({ latencyHint: "interactive" });
    }
  }

  if (sharedAudioCtx) {
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx
        .resume()
        .then(() => {
          if (sharedAudioCtx?.state === "running") {
            // Prime the hardware pipeline with an inaudible 1-sample buffer
            try {
              const silent = sharedAudioCtx.createBuffer(1, 1, 22050);
              const src = sharedAudioCtx.createBufferSource();
              src.buffer = silent;
              src.connect(sharedAudioCtx.destination);
              src.start(0);
            } catch {}

            // Warm up fallbacks
            if (fallbackPressAudio) fallbackPressAudio.load();
            if (fallbackReleaseAudio) fallbackReleaseAudio.load();

            removeUnlockListeners();
          }
        })
        .catch(() => {});
    } else if (sharedAudioCtx.state === "running") {
      removeUnlockListeners();
    }
  }
}

function initAudioEngine() {
  if (typeof window === "undefined" || isAudioInitialized) return;
  isAudioInitialized = true;

  try {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass({ latencyHint: "interactive" });
      (window as unknown as { __sharedAudioCtx?: AudioContext }).__sharedAudioCtx = sharedAudioCtx;
    }

    // Prepare fallback HTML5 audio with preloading
    fallbackPressAudio = new Audio("/assets/keycap-sounds/press.mp3");
    fallbackPressAudio.preload = "auto";
    fallbackPressAudio.volume = 0.45;

    fallbackReleaseAudio = new Audio("/assets/keycap-sounds/release.mp3");
    fallbackReleaseAudio.preload = "auto";
    fallbackReleaseAudio.volume = 0.35;

    // Fetch and decode Web Audio buffers in parallel immediately
    const preloadBuffer = async (url: string) => {
      try {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        if (sharedAudioCtx) {
          return await sharedAudioCtx.decodeAudioData(arrayBuf);
        }
      } catch (err) {
        console.warn(`[useSounds] Failed preloading buffer for ${url}:`, err);
      }
      return null;
    };

    preloadBuffer("/assets/keycap-sounds/press.mp3").then((buf) => {
      pressAudioBuffer = buf;
    });

    preloadBuffer("/assets/keycap-sounds/release.mp3").then((buf) => {
      releaseAudioBuffer = buf;
    });

    preloadBuffer("/assets/sounds/vine-boom.mp3").then((buf) => {
      confettiAudioBuffer = buf;
    });

    // Attach unlock listeners on both window and document with capture: true
    // strictly using legitimate user activation events (NO wheel or mousemove)
    GESTURE_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleFirstUserGesture, {
        capture: true,
        passive: true,
      });
      document.addEventListener(evt, handleFirstUserGesture, {
        capture: true,
        passive: true,
      });
    });
  } catch (e) {
    console.warn("[useSounds] Failed to initialize audio engine:", e);
  }
}

// Auto-initialize immediately in browser
if (typeof window !== "undefined") {
  initAudioEngine();
}

export const useSounds = () => {
  if (!isAudioInitialized && typeof window !== "undefined") {
    initAudioEngine();
  }

  const getContext = useCallback(() => {
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }, []);

  const playBufferImmediate = useCallback(
    (
      buffer: AudioBuffer | null,
      fallback: HTMLAudioElement | null,
      vol = 0.48,
      baseDetune = 0
    ) => {
      try {
        const ctx = sharedAudioCtx || getContext();
        if (ctx && ctx.state !== "closed") {
          if (ctx.state === "suspended") {
            ctx.resume().catch(() => {});
          }

          if (buffer) {
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.detune.value = baseDetune + (Math.random() * 120 - 60);

            const gainNode = ctx.createGain();
            gainNode.gain.value = vol;

            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            source.start(0);

            if (typeof window !== "undefined") {
              const w = window as unknown as {
                __soundHistory?: Array<{ time: number; state: string }>;
              };
              w.__soundHistory = w.__soundHistory || [];
              w.__soundHistory.push({ time: Date.now(), state: ctx.state });
            }
            return;
          }
        }

        // Fallback for HTML5 audio if Web Audio buffer isn't decoded yet
        if (ctx && ctx.state === "running" && fallback) {
          const clone = fallback.cloneNode() as HTMLAudioElement;
          clone.volume = vol;
          clone.play().catch(() => {});
        }
      } catch {
        // Ignore audio playback errors
      }
    },
    [getContext]
  );

  const playPressSound = useCallback(() => {
    playBufferImmediate(pressAudioBuffer, fallbackPressAudio, 0.48);
  }, [playBufferImmediate]);

  const playReleaseSound = useCallback(() => {
    playBufferImmediate(releaseAudioBuffer, fallbackReleaseAudio, 0.32);
  }, [playBufferImmediate]);

  const playTone = useCallback(
    (startFreq: number, endFreq: number, duration: number, vol: number) => {
      try {
        const ctx = getContext();
        if (!ctx || ctx.state !== "running") return;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = "sine";
        const startTime = ctx.currentTime;

        oscillator.frequency.setValueAtTime(startFreq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          endFreq,
          startTime + duration
        );

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      } catch (error) {
        console.error("Failed to play tone:", error);
      }
    },
    [getContext]
  );

  const playSendSound = useCallback(() => {
    playTone(600, 300, 0.25, 0.08);
  }, [playTone]);

  const playReceiveSound = useCallback(() => {
    playTone(800, 400, 0.35, 0.1);
  }, [playTone]);

  const playConfettiSound = useCallback(
    (intensity: number = 0.5) => {
      try {
        const ctx = getContext();
        const buffer = confettiAudioBuffer;
        if (!ctx || !buffer || ctx.state !== "running") return;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = 1.2 - intensity * 0.4;
        source.detune.value = Math.random() * 100 - 50;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15 + intensity * 0.5;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } catch (err) {
        console.error(err);
      }
    },
    [getContext]
  );

  const chargeOscRef = useRef<OscillatorNode | null>(null);
  const chargeGainRef = useRef<GainNode | null>(null);

  const startChargeTone = useCallback(() => {
    try {
      const ctx = getContext();
      if (!ctx || chargeOscRef.current || ctx.state !== "running") return;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 200;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      chargeOscRef.current = osc;
      chargeGainRef.current = gain;
    } catch {}
  }, [getContext]);

  const updateChargeTone = useCallback((intensity: number = 0) => {
    const osc = chargeOscRef.current;
    const gain = chargeGainRef.current;
    if (!osc || !gain) return;
    osc.frequency.value = 200 + intensity * 600;
    gain.gain.value = intensity * 0.06;
  }, []);

  const stopChargeTone = useCallback(() => {
    try {
      chargeOscRef.current?.stop();
    } catch {}
    chargeOscRef.current = null;
    chargeGainRef.current = null;
  }, []);

  return {
    playSendSound,
    playReceiveSound,
    playPressSound,
    playReleaseSound,
    playConfettiSound,
    startChargeTone,
    updateChargeTone,
    stopChargeTone,
  };
};

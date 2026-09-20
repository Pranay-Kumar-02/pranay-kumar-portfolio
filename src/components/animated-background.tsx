"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "./theme-provider";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "./realtime/hooks/use-sounds";
import { usePerfProfile } from "@/hooks/use-perf-profile";

import { setActiveSkill } from "@/lib/active-skill";

gsap.registerPlugin(ScrollTrigger);

const KeyboardScene = ({ maxDpr }: { maxDpr: number }) => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>(null);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>(null);

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  const activeKeyObjRef = useRef<SPEObject | null>(null);

  const resetActiveKeyVisual = () => {
    if (activeKeyObjRef.current) {
      gsap.to(activeKeyObjRef.current.position, {
        y: 0,
        duration: 0.22,
        ease: "back.out(2)",
        overwrite: "auto",
      });
      activeKeyObjRef.current = null;
    }
  };

  const pressKeyVisual = (keyObj: SPEObject, depth = -14) => {
    activeKeyObjRef.current = keyObj;
    gsap.to(keyObj.position, {
      y: depth,
      duration: 0.07,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp) return;

    if (!e.target.name || e.target.name === "body" || e.target.name === "platform" || e.target.name === "keyboard") {
      if (activeKeyObjRef.current) {
        resetActiveKeyVisual();
        playReleaseSound();
      }
      if (selectedSkillRef.current) {
        setSelectedSkill(null);
        selectedSkillRef.current = null;
        setActiveSkill(null);
      }
      return;
    }

    if (selectedSkillRef.current?.name !== e.target.name) {
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        if (activeKeyObjRef.current && activeKeyObjRef.current.name !== e.target.name) {
          gsap.to(activeKeyObjRef.current.position, {
            y: 0,
            duration: 0.2,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        }

        const keyObj = splineApp.findObjectByName(e.target.name);
        if (keyObj) {
          pressKeyVisual(keyObj, -13);
        }

        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setActiveSkill(skill);
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      resetActiveKeyVisual();
      setActiveSkill(null);
      setSelectedSkill(null);
      selectedSkillRef.current = null;
    });

    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        const keyObj = splineApp.findObjectByName(e.target.name);
        if (keyObj) {
          pressKeyVisual(keyObj, -16);
        }
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setActiveSkill(skill);
      }
    });

    splineApp.addEventListener("mouseDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        const keyObj = splineApp.findObjectByName(e.target.name);
        if (keyObj) {
          pressKeyVisual(keyObj, -18);
        }
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setActiveSkill(skill);
      }
    });

    splineApp.addEventListener("mouseUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      if (activeKeyObjRef.current) {
        gsap.to(activeKeyObjRef.current.position, {
          y: -13,
          duration: 0.18,
          ease: "back.out(2)",
          overwrite: "auto",
        });
      }
    });

    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  // --- Animation Setup Helpers ---

  const createSectionTimeline = (
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    return gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 0.85, ease: "power2.out" });
          gsap.to(kbd.position, { ...state.position, duration: 0.85, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 0.85, ease: "power2.out" });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 0.85, ease: "power2.out" });
          gsap.to(kbd.position, { ...state.position, duration: 0.85, ease: "power2.out" });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 0.85, ease: "power2.out" });
        },
      },
    });
  };

  const setupScrollAnimations = (): gsap.core.Timeline[] => {
    if (!splineApp || !splineContainer.current) return [];
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return [];

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);

    // Section transitions
    return [
      createSectionTimeline("#skills", "skills", "hero"),
      createSectionTimeline("#projects", "projects", "skills", "top 70%"),
      createSectionTimeline("#contact", "contact", "projects", "top 30%"),
    ].filter(Boolean) as gsap.core.Timeline[];
  };

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    let interval: NodeJS.Timeout;
    const start = () => {
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    let floatTweens: gsap.core.Tween[] = [];
    let settleTweens: gsap.core.Tween[] = [];
    const killFloat = () => { floatTweens.forEach((t) => t.kill()); floatTweens = []; };
    const killSettle = () => { settleTweens.forEach((t) => t.kill()); settleTweens = []; };

    const start = () => {
      killSettle();
      killFloat();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          floatTweens.push(
            gsap.to(keycap.position, {
              y: Math.random() * 90 + 90,
              duration: Math.random() * 1.6 + 1.8,
              delay: idx * 0.12,
              repeat: -1,
              yoyo: true,
              yoyoEase: "power1.inOut",
              ease: "sine.inOut",
            })
          );
        });
    };

    const stop = () => {
      killFloat();
      killSettle();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        settleTweens.push(
          gsap.to(keycap.position, {
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          })
        );
      });
    };

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: currentState.scale.x * 0.8, y: currentState.scale.y * 0.8, z: currentState.scale.z * 0.8 },
      {
        ...currentState.scale,
        duration: 0.9,
        ease: "power3.out",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
      mobileKeyCaps.forEach((keycap) => { keycap.visible = true; });
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
      desktopKeyCaps.forEach((keycap) => { keycap.visible = true; });
    }

    keycaps.forEach((keycap) => { keycap.visible = true; });

    // Smooth wave arrival with natural deceleration and zero jitter
    gsap.fromTo(
      keycaps.map((k) => k.position),
      { y: 45 },
      {
        y: 0,
        duration: 0.65,
        stagger: {
          amount: 0.25,
          from: "start",
          ease: "power2.inOut",
        },
        ease: "power3.out",
      }
    );
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    const timelines = setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      bongoAnimationRef.current?.stop()
      keycapAnimationsRef.current?.stop()
      // Kill the section ScrollTriggers so they don't orphan when the scene
      // unmounts (e.g. toggling reduced motion) and fire on the disposed app.
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    }

  }, [splineApp, isMobile]);



  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    // Marks this run superseded so the delayed (await sleep) start/stop calls
    // below don't fire after activeSection has moved on — otherwise fast
    // scrolling overlaps runs and a stale keycap start() can land last, leaving
    // the float (yoyo) running forever.
    let cancelled = false;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true, // Start paused
      });

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        await sleep(300);
        if (cancelled) return;
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        if (cancelled) return;
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        await sleep(600);
        if (cancelled) return;
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
        if (cancelled) return;
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
      }
    };

    manageAnimations();

    return () => {
      cancelled = true;
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    // Rebuild the URL from the current pathname so the hash is always *replaced*
    // rather than appended. Using router.push("/" + hash) stacked fragments on
    // refresh (e.g. "/#skills#skills#skills") because the existing hash in the
    // address bar was never stripped first. replaceState also avoids polluting
    // browser history with an entry per scrolled-through section.
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    const url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(window.history.state, "", url);

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

  // Cap the renderer's pixel ratio once the scene is ready, and clean up the
  // resize listener on unmount / DPR change (previously added in onLoad and
  // never removed).
  useEffect(() => {
    if (!splineApp) return;
    return capSplinePixelRatio(splineApp, maxDpr);
  }, [splineApp, maxDpr]);

  // Pause the entire WebGL render loop (and the keyboard's infinite tweens /
  // bongo-cat interval, which are only visible through it) while the tab is
  // hidden. Spline keeps rendering at full tilt in a background tab otherwise —
  // a pointless, continuous GPU/battery drain.
  useEffect(() => {
    if (!splineApp) return;
    const onVisibility = () => {
      if (document.hidden) splineApp.stop();
      else splineApp.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [splineApp]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="w-full h-full fixed"
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          if (typeof window !== "undefined") {
            (window as unknown as { __splineApp: Application }).__splineApp = app;
            (window as unknown as { __SKILLS: typeof SKILLS }).__SKILLS = SKILLS;
          }
          bypassLoading();
        }}
        scene="/assets/skills-keyboard.spline?v=9"
      />
    </Suspense>
  );
};

/**
 * Gate the heavy WebGL scene behind device/preference detection.
 *
 * The gate lives here in the parent (not inside KeyboardScene) on purpose: when
 * 3D is disabled — e.g. the user toggles reduced motion — KeyboardScene fully
 * UNMOUNTS, tearing down its Spline app, GSAP tweens, ScrollTriggers and reveal
 * state. Re-enabling remounts it from a clean slate. (Gating with an internal
 * early-return instead kept the component mounted, so it came back with stale
 * `keyboardRevealed` state and never re-initialised the keycaps.)
 *
 * Waiting for `ready` also avoids a flash-mount that would fetch the heavy
 * runtime chunk + scene before detection has run; the Preloader bypasses its
 * splash when 3D is disabled.
 */
const AnimatedBackground = () => {
  const { disable3D, maxDpr, ready } = usePerfProfile();
  if (!ready || disable3D) return null;
  return <KeyboardScene maxDpr={maxDpr} />;
};

/**
 * Cap the Spline/Three.js renderer's pixel ratio. The scene is published with
 * pixelRatio=0 ("device"), so on a 2–3x screen it renders 4–9x the pixels of a
 * 1x canvas — a huge GPU cost. We clamp it and reapply on resize, since Spline
 * re-reads devicePixelRatio when the canvas resizes. Returns a disposer that
 * removes the resize listener (so it isn't leaked across reloads/unmounts).
 */
function capSplinePixelRatio(app: Application, maxDpr: number) {
  const apply = () => {
    try {
      const renderer = (app as unknown as { _renderer?: { setPixelRatio?: (n: number) => void } })
        ._renderer;
      if (renderer?.setPixelRatio) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
      }
    } catch {
      /* internal API moved — fail silent, scene still renders */
    }
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  return () => window.removeEventListener("resize", apply);
}

export default AnimatedBackground;

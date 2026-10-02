"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import { Raycaster, Vector2, type Mesh, type Object3D } from "three";
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
import { subscribeToInterest } from "@/lib/active-interest";
import type { Interest } from "@/data/interests";

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
  const currentInterestRef = useRef<Interest | null>(null);
  const keyBaseMapRef = useRef<Map<string, { position: { x: number; y: number; z: number }; scale: { x: number; y: number; z: number } }>>(new Map());
  const raycasterRef = useRef(new Raycaster());
  const mouseRef = useRef(new Vector2());
  const meshToKeyMapRef = useRef(new Map<Object3D, { skill: Skill; keyObj: SPEObject }>());
  const keyMeshListRef = useRef<Object3D[]>([]);

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

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    // Index all 24 keycaps and their child meshes
    const meshToKeyMap = new Map<Object3D, { skill: Skill; keyObj: SPEObject }>();
    const keyMeshList: Object3D[] = [];

    const threeScene = (splineApp as unknown as { _scene?: Object3D })._scene;

    Object.values(SKILLS).forEach((skill) => {
      const keyObj = splineApp.findObjectByName(skill.name);
      const threeObj = threeScene?.getObjectByName(skill.name);
      if (keyObj && threeObj) {
        if (!keyBaseMapRef.current.has(skill.name)) {
          keyBaseMapRef.current.set(skill.name, {
            position: { x: keyObj.position.x, y: keyObj.position.y, z: keyObj.position.z },
            scale: { x: keyObj.scale.x, y: keyObj.scale.y, z: keyObj.scale.z },
          });
        }
        threeObj.traverse((child) => {
          if ((child as Mesh).isMesh) {
            meshToKeyMap.set(child, { skill, keyObj });
            keyMeshList.push(child);
          }
        });
      }
    });

    meshToKeyMapRef.current = meshToKeyMap;
    keyMeshListRef.current = keyMeshList;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    const getTargetYForSkill = (skillName: string) => {
      const base = keyBaseMapRef.current.get(skillName);
      const baseY = base ? base.position.y : 0;
      const curInterest = currentInterestRef.current;
      if (!curInterest) return baseY;
      if (curInterest.primaryKeys.includes(skillName as SkillNames)) return baseY + 40;
      return baseY;
    };

    const handleKeyEnter = (skill: Skill, keyObj: SPEObject) => {
      if (selectedSkillRef.current?.name === skill.name) return;

      if (activeKeyObjRef.current && activeKeyObjRef.current !== keyObj) {
        const prevSkillName = selectedSkillRef.current?.name || "";
        const prevRestY = getTargetYForSkill(prevSkillName);
        gsap.to(activeKeyObjRef.current.position, {
          y: prevRestY,
          duration: 0.18,
          ease: "back.out(2)",
          overwrite: "auto",
        });
      }

      activeKeyObjRef.current = keyObj;
      const targetRestY = getTargetYForSkill(skill.name);
      gsap.to(keyObj.position, {
        y: targetRestY - 13,
        duration: 0.07,
        ease: "power2.out",
        overwrite: "auto",
      });

      playPressSound();
      selectedSkillRef.current = skill;
      setSelectedSkill(skill);
      setActiveSkill(skill);
    };

    const handleKeyLeave = () => {
      if (!selectedSkillRef.current) return;

      if (activeKeyObjRef.current) {
        const prevSkillName = selectedSkillRef.current?.name || "";
        const prevRestY = getTargetYForSkill(prevSkillName);
        gsap.to(activeKeyObjRef.current.position, {
          y: prevRestY,
          duration: 0.2,
          ease: "back.out(2)",
          overwrite: "auto",
        });
        activeKeyObjRef.current = null;
      }

      playReleaseSound();
      selectedSkillRef.current = null;
      setSelectedSkill(null);
      setActiveSkill(null);
    };

    const performRaycastAt = (clientX: number, clientY: number) => {
      if (!splineApp || isInputFocused()) return null;
      const canvas = splineApp.canvas;
      const camera = (splineApp as unknown as { _camera?: any })._camera;
      if (!canvas || !camera) return null;

      const rect = canvas.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }

      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(ndcX, ndcY);

      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(mouseRef.current, camera);

      const intersects = raycaster.intersectObjects(keyMeshListRef.current, false);
      if (typeof window !== "undefined") {
        (window as any).__lastIntersects = intersects;
      }
      if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
          const match = meshToKeyMapRef.current.get(intersects[i].object);
          if (match) return match;
        }
      }
      return null;
    };

    if (typeof window !== "undefined") {
      (window as any).__performRaycast = performRaycastAt;
      (window as any).__keyMeshList = keyMeshListRef.current;
      (window as any).__meshToKeyMap = meshToKeyMapRef.current;
      (window as any).__raycaster = raycasterRef.current;
    }

    const onPointerMove = (e: PointerEvent) => {
      const match = performRaycastAt(e.clientX, e.clientY);
      if (match) {
        handleKeyEnter(match.skill, match.keyObj);
      } else {
        handleKeyLeave();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isInputFocused()) return;
      const match = performRaycastAt(e.clientX, e.clientY);
      if (match) {
        handleKeyEnter(match.skill, match.keyObj);
        const targetRestY = getTargetYForSkill(match.skill.name);
        gsap.to(match.keyObj.position, {
          y: targetRestY - 18,
          duration: 0.05,
          ease: "power2.out",
          overwrite: "auto",
        });
        playPressSound();
      }
    };

    const onPointerUp = () => {
      if (isInputFocused()) return;
      if (activeKeyObjRef.current && selectedSkillRef.current) {
        const targetRestY = getTargetYForSkill(selectedSkillRef.current.name);
        gsap.to(activeKeyObjRef.current.position, {
          y: targetRestY - 13,
          duration: 0.15,
          ease: "back.out(2)",
          overwrite: "auto",
        });
        playReleaseSound();
      }
    };

    const onPointerLeaveWindow = () => {
      handleKeyLeave();
    };

    const applyInterestClustering = (interest: Interest | null) => {
      currentInterestRef.current = interest;
      if (!splineApp) return;

      if (!interest) {
        // Reset: all keys smoothly return to their exact original base positions
        keyBaseMapRef.current.forEach((base, keyName) => {
          const keyObj = splineApp.findObjectByName(keyName);
          if (!keyObj) return;
          const isHovered = activeKeyObjRef.current === keyObj;
          gsap.to(keyObj.position, {
            x: base.position.x,
            y: isHovered ? base.position.y - 13 : base.position.y,
            z: base.position.z,
            duration: 0.55,
            ease: "back.out(1.2)",
            overwrite: "auto",
          });
          gsap.to(keyObj.scale, {
            x: base.scale.x,
            y: base.scale.y,
            z: base.scale.z,
            duration: 0.55,
            ease: "back.out(1.2)",
            overwrite: "auto",
          });
        });
        return;
      }

      // VERTICAL LIFT ONLY — strictly no horizontal scaling or expansion
      // Relevant keys: rise vertically from their existing position (+40 units in local Y)
      // Unselected keys: stay in their normal positions (base.position.y)
      // Scale is strictly kept at base scale (1.0x) so keys never get huge or bloated
      keyBaseMapRef.current.forEach((base, keyName) => {
        const keyObj = splineApp.findObjectByName(keyName);
        if (!keyObj) return;

        const isSelected = interest.primaryKeys.includes(keyName as SkillNames);

        let targetY = isSelected ? base.position.y + 40 : base.position.y;

        // Hovered key receives standard tactile press offset
        if (activeKeyObjRef.current === keyObj) {
          targetY -= 13;
        }

        gsap.to(keyObj.position, {
          x: base.position.x,
          y: targetY,
          z: base.position.z,
          duration: 0.55,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
        gsap.to(keyObj.scale, {
          x: base.scale.x,
          y: base.scale.y,
          z: base.scale.z,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const unsubInterest = subscribeToInterest(applyInterestClustering);

    // Spline keyboard events (physical keyboard input)
    const onSplineKeyUp = () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      resetActiveKeyVisual();
      setActiveSkill(null);
      setSelectedSkill(null);
      selectedSkillRef.current = null;
    };

    const onSplineKeyDown = (e: SplineEvent) => {
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
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onPointerMove as unknown as EventListener, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("mousedown", onPointerDown as unknown as EventListener);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mouseup", onPointerUp as unknown as EventListener);
    window.addEventListener("pointerleave", onPointerLeaveWindow);

    splineApp.addEventListener("keyUp", onSplineKeyUp);
    splineApp.addEventListener("keyDown", onSplineKeyDown);

    return () => {
      unsubInterest();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onPointerMove as unknown as EventListener);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("mousedown", onPointerDown as unknown as EventListener);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("mouseup", onPointerUp as unknown as EventListener);
      window.removeEventListener("pointerleave", onPointerLeaveWindow);

      try {
        splineApp.removeEventListener("keyUp", onSplineKeyUp);
        splineApp.removeEventListener("keyDown", onSplineKeyDown);
      } catch {
        /* Spline disposed */
      }
    };
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
    // Scroll trigger chain must match the actual DOM/scroll order:
    // hero → skills → experience(about) → projects → interests → contact
    return [
      createSectionTimeline("#skills", "skills", "hero"),
      createSectionTimeline("#experience", "experience", "skills"),
      createSectionTimeline("#projects", "projects", "experience", "top 70%"),
      createSectionTimeline("#interests", "interests", "projects"),
      createSectionTimeline("#contact", "contact", "interests", "top 30%"),
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
    const cleanupInteractions = handleSplineInteractions();
    const timelines = setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      cleanupInteractions?.();
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.stop();
      // Kill the section ScrollTriggers so they don't orphan when the scene
      // unmounts (e.g. toggling reduced motion) and fire on the disposed app.
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
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

"use client";

import { useEffect } from "react";
import { config } from "@/data/config";

const ACTIVE_TITLE = config.title;

// Playful tab titles paired with custom monochrome/cyan developer icons
const PLAYFUL_MESSAGES = [
  { text: "Come watch my portfolio 🥺", icon: "pulse" },
  { text: "Hey… you left 😭", icon: "signal" },
  { text: "The projects are waiting 👀", icon: "pulse" },
  { text: "I made this for you 😭", icon: "signal" },
  { text: "Come back, I swear it's worth it 👀", icon: "pulse" },
  { text: "Still exploring other tabs? 😭", icon: "signal" },
  { text: "Okay… I'll wait 🥲", icon: "wait" },
];

// In-memory cache of generated PNG data URLs
const iconCache = new Map<string, string>();

/**
 * Generates an ultra-crisp 64x64 PNG favicon data URL.
 * Strictly adheres to Pranay's portfolio design language:
 * - Base: Deep dark obsidian (#070b14)
 * - Accent: Cyber cyan (#38bdf8)
 * - Foreground: High-contrast pure white (#ffffff)
 * - Absolutely NO orange, amber, or cartoon emoji colors.
 */
function getIconDataUrl(type: string): string {
  if (typeof document === "undefined") return "";
  if (iconCache.has(type)) return iconCache.get(type)!;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.clearRect(0, 0, 64, 64);

  // 1. Dark obsidian squircle base
  ctx.fillStyle = "#070b14";
  ctx.beginPath();
  ctx.roundRect(3, 3, 58, 58, 15);
  ctx.fill();

  // 2. Crisp cyber cyan border
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(3, 3, 58, 58, 15);
  ctx.stroke();

  if (type === "pk") {
    // PK Monogram: Bold white typography with cyan accent dot
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 27px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PK", 31, 33);

    // Accent cyan dot
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(49, 42, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "wave") {
    // Minimal monochrome waving hand symbol + cyan wave arcs
    ctx.fillStyle = "#ffffff";

    // Palm base
    ctx.beginPath();
    ctx.arc(28, 38, 11, 0, Math.PI * 2);
    ctx.fill();

    // 4 fingers
    const heights = [14, 18, 17, 13];
    const xPositions = [21, 26, 31, 36];
    heights.forEach((h, i) => {
      ctx.beginPath();
      ctx.roundRect(xPositions[i] - 2, 36 - h, 4.2, h + 4, 2);
      ctx.fill();
    });

    // Thumb
    ctx.beginPath();
    ctx.roundRect(15, 33, 4.5, 10, 2);
    ctx.fill();

    // Cyber cyan motion wave arcs
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(43, 22, 6, -Math.PI * 0.45, Math.PI * 0.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(47, 24, 10, -Math.PI * 0.45, Math.PI * 0.2);
    ctx.stroke();
  } else if (type === "pulse") {
    // Cyber radar / focus scope in white & cyan
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;

    // Outer ring
    ctx.beginPath();
    ctx.arc(32, 32, 17, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(32, 32, 10, 0, Math.PI * 2);
    ctx.stroke();

    // White glowing center core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(32, 32, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 4 target tick marks
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(32, 11);
    ctx.lineTo(32, 15);
    ctx.moveTo(32, 49);
    ctx.lineTo(32, 53);
    ctx.moveTo(11, 32);
    ctx.lineTo(15, 32);
    ctx.moveTo(49, 32);
    ctx.lineTo(53, 32);
    ctx.stroke();
  } else if (type === "signal") {
    // Developer terminal prompt `>_`
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // `>` prompt chevron in pure white
    ctx.beginPath();
    ctx.moveTo(18, 22);
    ctx.lineTo(30, 32);
    ctx.lineTo(18, 42);
    ctx.stroke();

    // `_` blinking prompt cursor in cyan
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.roundRect(35, 39, 13, 3.5, 1.5);
    ctx.fill();
  } else if (type === "wait") {
    // Minimal orbital atomic loop
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;

    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 7.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Center white core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(32, 32, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const dataUrl = canvas.toDataURL("image/png");
  iconCache.set(type, dataUrl);
  return dataUrl;
}

/**
 * Updates the browser favicon dynamically.
 * Replaces the DOM link node so Chromium immediately invalidates its tab favicon cache.
 */
function updateFavicon(iconType: string) {
  if (typeof document === "undefined") return;
  const dataUrl = getIconDataUrl(iconType);
  if (!dataUrl) return;

  // Clean up any conflicting static links to prevent Chrome from reverting to stale cache
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach((link) => {
    if (link.id !== "controlled-favicon") {
      link.remove();
    }
  });

  const oldLink = document.getElementById("controlled-favicon");
  const newLink = document.createElement("link");
  newLink.id = "controlled-favicon";
  newLink.rel = "icon";
  newLink.type = "image/png";
  newLink.href = dataUrl;

  if (oldLink && oldLink.parentNode) {
    oldLink.parentNode.replaceChild(newLink, oldLink);
  } else {
    document.head.appendChild(newLink);
  }
}

export default function TabPersonality() {
  useEffect(() => {
    let hiddenIntervalId: NodeJS.Timeout | null = null;
    let activeFaviconIntervalId: NodeJS.Timeout | null = null;
    let hiddenMessageIndex = 0;
    let activeFaviconState: "pk" | "wave" = "pk";

    const startActiveMode = () => {
      // Clear any hidden intervals
      if (hiddenIntervalId) {
        clearInterval(hiddenIntervalId);
        hiddenIntervalId = null;
      }
      if (activeFaviconIntervalId) {
        clearInterval(activeFaviconIntervalId);
        activeFaviconIntervalId = null;
      }

      // Immediately restore professional title
      document.title = ACTIVE_TITLE;

      // Start active favicon sequence: "PK" ↔ minimal waving hand
      activeFaviconState = "pk";
      updateFavicon(activeFaviconState);

      activeFaviconIntervalId = setInterval(() => {
        activeFaviconState = activeFaviconState === "pk" ? "wave" : "pk";
        updateFavicon(activeFaviconState);
      }, 1800);
    };

    const startHiddenMode = () => {
      // Clear active interval
      if (activeFaviconIntervalId) {
        clearInterval(activeFaviconIntervalId);
        activeFaviconIntervalId = null;
      }
      if (hiddenIntervalId) {
        clearInterval(hiddenIntervalId);
        hiddenIntervalId = null;
      }

      // Immediately show the first playful title & matching monochrome/cyan icon
      const first = PLAYFUL_MESSAGES[hiddenMessageIndex % PLAYFUL_MESSAGES.length];
      document.title = first.text;
      updateFavicon(first.icon);
      hiddenMessageIndex = (hiddenMessageIndex + 1) % PLAYFUL_MESSAGES.length;

      // Cycle every 3 seconds while user is away
      hiddenIntervalId = setInterval(() => {
        const item = PLAYFUL_MESSAGES[hiddenMessageIndex % PLAYFUL_MESSAGES.length];
        document.title = item.text;
        updateFavicon(item.icon);
        hiddenMessageIndex = (hiddenMessageIndex + 1) % PLAYFUL_MESSAGES.length;
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        startHiddenMode();
      } else {
        startActiveMode();
      }
    };

    const handleWindowBlur = () => {
      if (document.visibilityState === "hidden") {
        startHiddenMode();
      }
    };

    // Initialize with active tab state
    startActiveMode();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", startActiveMode);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      if (hiddenIntervalId) clearInterval(hiddenIntervalId);
      if (activeFaviconIntervalId) clearInterval(activeFaviconIntervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", startActiveMode);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  return null;
}

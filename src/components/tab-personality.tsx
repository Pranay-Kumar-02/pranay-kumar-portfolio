"use client";

import { useEffect } from "react";
import { config } from "@/data/config";

const ACTIVE_TITLE = config.title;

// Playful tab titles that cycle when the user leaves the tab
const PLAYFUL_TITLES = [
  "Come watch my portfolio 🥺",
  "Hey… you left 😭",
  "The projects are waiting 👀",
  "I made this for you 😭",
  "Come back, I swear it's worth it 👀",
  "Still exploring other tabs? 😭",
  "Okay… I'll wait 🥲",
];

const FAVICON_HREF = "/favicon.svg";

/**
 * Ensures exactly one controlled <link rel="icon"> exists pointing to the static PK SVG.
 * Removes any other conflicting or duplicate icon elements.
 */
function enforceStaticFavicon() {
  if (typeof document === "undefined") return;

  const existingIcons = document.querySelectorAll("link[rel*='icon']");
  existingIcons.forEach((el) => {
    if (el.id !== "controlled-favicon") {
      el.remove();
    }
  });

  let link = document.getElementById("controlled-favicon") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = "controlled-favicon";
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = FAVICON_HREF;
    document.head.appendChild(link);
  } else {
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = FAVICON_HREF;
  }
}

export default function TabPersonality() {
  useEffect(() => {
    // 1. Enforce the single static PK monogram favicon
    enforceStaticFavicon();

    let hiddenIntervalId: NodeJS.Timeout | null = null;
    let messageIndex = 0;

    const restoreActiveTitle = () => {
      if (hiddenIntervalId) {
        clearInterval(hiddenIntervalId);
        hiddenIntervalId = null;
      }
      document.title = ACTIVE_TITLE;
    };

    const startHiddenTitleCycling = () => {
      if (hiddenIntervalId) {
        clearInterval(hiddenIntervalId);
        hiddenIntervalId = null;
      }

      // Immediately show the first playful title
      document.title = PLAYFUL_TITLES[messageIndex % PLAYFUL_TITLES.length];
      messageIndex = (messageIndex + 1) % PLAYFUL_TITLES.length;

      // Cycle titles every 3 seconds while hidden
      hiddenIntervalId = setInterval(() => {
        document.title = PLAYFUL_TITLES[messageIndex % PLAYFUL_TITLES.length];
        messageIndex = (messageIndex + 1) % PLAYFUL_TITLES.length;
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        startHiddenTitleCycling();
      } else {
        restoreActiveTitle();
      }
    };

    const handleWindowBlur = () => {
      if (document.visibilityState === "hidden") {
        startHiddenTitleCycling();
      }
    };

    // Ensure active title on initial mount
    restoreActiveTitle();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", restoreActiveTitle);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      if (hiddenIntervalId) clearInterval(hiddenIntervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", restoreActiveTitle);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  return null;
}

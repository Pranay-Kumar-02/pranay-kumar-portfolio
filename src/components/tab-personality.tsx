"use client";

import { useEffect } from "react";
import { config } from "@/data/config";

const ACTIVE_TITLE = config.title;

const PLAYFUL_MESSAGES = [
  { text: "Come watch my portfolio 🥺", emoji: "🥺" },
  { text: "Hey… you left 😭", emoji: "😭" },
  { text: "The projects are waiting 👀", emoji: "👀" },
  { text: "I made this for you 😭", emoji: "😭" },
  { text: "Come back, I swear it's worth it 👀", emoji: "👀" },
  { text: "Still exploring other tabs? 😭", emoji: "😭" },
  { text: "Okay… I'll wait 🥲", emoji: "🥲" },
];

const createEmojiFavicon = (emoji: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="82" font-size="78">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PK_FAVICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="28" fill="#09090b"/><text x="50" y="65" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="44" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="1">PK</text></svg>`
)}`;

function updateFavicon(url: string) {
  if (typeof document === "undefined") return;
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "shortcut icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

export default function TabPersonality() {
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let messageIndex = 0;

    const restoreActiveTab = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      document.title = ACTIVE_TITLE;
      updateFavicon(PK_FAVICON);
    };

    const startPlayfulMode = () => {
      if (intervalId) clearInterval(intervalId);

      // Immediately show the first playful message
      const first = PLAYFUL_MESSAGES[messageIndex % PLAYFUL_MESSAGES.length];
      document.title = first.text;
      updateFavicon(createEmojiFavicon(first.emoji));
      messageIndex = (messageIndex + 1) % PLAYFUL_MESSAGES.length;

      // Cycle every 3 seconds while user is away
      intervalId = setInterval(() => {
        const item = PLAYFUL_MESSAGES[messageIndex % PLAYFUL_MESSAGES.length];
        document.title = item.text;
        updateFavicon(createEmojiFavicon(item.emoji));
        messageIndex = (messageIndex + 1) % PLAYFUL_MESSAGES.length;
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        startPlayfulMode();
      } else {
        restoreActiveTab();
      }
    };

    const handleBlur = () => {
      if (document.visibilityState === "hidden") {
        startPlayfulMode();
      }
    };

    // Initialize with active tab state
    restoreActiveTab();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", restoreActiveTab);
    window.addEventListener("blur", handleBlur);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", restoreActiveTab);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return null;
}

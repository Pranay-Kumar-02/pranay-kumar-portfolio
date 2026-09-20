import { useEffect, useState } from "react";
import { INTERESTS, Interest } from "@/data/interests";

type InterestListener = (interest: Interest | null) => void;

let lockedInterest: Interest | null = null;
let hoveredInterest: Interest | null = null;
const listeners = new Set<InterestListener>();

function notify() {
  const current = hoveredInterest || lockedInterest;
  listeners.forEach((fn) => fn(current));
  if (typeof window !== "undefined") {
    (window as unknown as { __activeInterest: Interest | null }).__activeInterest = current;
  }
}

export function setLockedInterest(interest: Interest | null) {
  lockedInterest = interest;
  notify();
}

export function setHoveredInterest(interest: Interest | null) {
  hoveredInterest = interest;
  notify();
}

export function getEffectiveInterest(): Interest | null {
  return hoveredInterest || lockedInterest;
}

export function getLockedInterest(): Interest | null {
  return lockedInterest;
}

export function subscribeToInterest(listener: InterestListener) {
  listeners.add(listener);
  listener(getEffectiveInterest());
  return () => {
    listeners.delete(listener);
  };
}

export function useActiveInterest() {
  const [interest, setInterest] = useState<Interest | null>(getEffectiveInterest);
  const [locked, setLocked] = useState<Interest | null>(lockedInterest);

  useEffect(() => {
    const unsub = subscribeToInterest((cur) => {
      setInterest(cur);
      setLocked(lockedInterest);
    });
    return unsub;
  }, []);

  return {
    activeInterest: interest,
    lockedInterest: locked,
    setLockedInterest,
    setHoveredInterest,
    interests: INTERESTS,
  };
}

if (typeof window !== "undefined") {
  (window as unknown as {
    __setLockedInterest: typeof setLockedInterest;
    __setHoveredInterest: typeof setHoveredInterest;
    __getEffectiveInterest: typeof getEffectiveInterest;
  }).__setLockedInterest = setLockedInterest;
  (window as unknown as { __setHoveredInterest: typeof setHoveredInterest }).__setHoveredInterest = setHoveredInterest;
  (window as unknown as { __getEffectiveInterest: typeof getEffectiveInterest }).__getEffectiveInterest = getEffectiveInterest;
}

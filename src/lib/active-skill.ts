import { useEffect, useState } from "react";
import { Skill } from "@/data/constants";

let currentActiveSkill: Skill | null = null;
const listeners = new Set<(skill: Skill | null) => void>();

export function setActiveSkill(skill: Skill | null) {
  currentActiveSkill = skill;
  listeners.forEach((l) => l(skill));
}

if (typeof window !== "undefined") {
  (window as unknown as { __setActiveSkill: typeof setActiveSkill }).__setActiveSkill = setActiveSkill;
}

export function getActiveSkill(): Skill | null {
  return currentActiveSkill;
}

export function useActiveSkill(): Skill | null {
  const [skill, setSkill] = useState<Skill | null>(currentActiveSkill);

  useEffect(() => {
    listeners.add(setSkill);
    return () => {
      listeners.delete(setSkill);
    };
  }, []);

  return skill;
}

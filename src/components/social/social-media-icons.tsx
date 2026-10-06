"use client";

import { useInView } from "motion/react";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { SiGithub, SiLeetcode, SiLinkedin } from "react-icons/si";
import { config } from "@/data/config";
import Link from "next/link";

const BUTTONS = [
  {
    name: "Github",
    href: config.social.github,
    icon: <SiGithub size={"24"} />,
  },
  {
    name: "LinkedIn",
    href: config.social.linkedin,
    icon: <SiLinkedin size={"24"} />,
  },
  {
    name: "LeetCode",
    href: config.social.leetcode,
    icon: <SiLeetcode size={"24"} />,
  },
];

const SocialMediaButtons = () => {
  return (
    <div className="z-10 flex items-center justify-center gap-2">
      {BUTTONS.map((button) => (
        <Button asChild variant={"ghost"} key={button.name} className="size-10 p-0 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800/40">
          <a
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={button.name}
          >
            {button.icon}
          </a>
        </Button>
      ))}
    </div>
  );
};

export default SocialMediaButtons;

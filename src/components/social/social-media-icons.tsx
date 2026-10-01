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
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true });
  return (
    <div ref={ref} className="z-10">
      {show &&
        BUTTONS.map((button) => (
          <Button asChild variant={"ghost"} key={button.name} className="size-10 p-0">
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

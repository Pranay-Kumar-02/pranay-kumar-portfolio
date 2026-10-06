import React, { Suspense } from "react";
import Link from "next/link";
import { config } from "@/data/config";

function CopyrightYear() {
  const year = new Date().getFullYear();
  return <>{year}</>;
}

function Footer() {
  return (
    <footer className="w-full shrink-0 bg-transparent relative z-10">
      {/* 1. Subtle 1px horizontal divider aligned with site content width */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent relative">
          {/* Refined central cyan micro-accent */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        </div>
      </div>

      {/* 2. Compact, balanced editorial footer composition */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 md:py-8 pb-20 sm:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-5 md:gap-8">
          
          {/* LEFT: Refined Brand & Role Area */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-0.5 sm:gap-1">
            <span className="text-xs sm:text-[13px] font-bold tracking-[0.14em] text-zinc-100 uppercase font-mono">
              Pranay Kumar
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
              AI &amp; Software Systems Engineer
            </span>
          </div>

          {/* CENTER: Prominent Editorial Destinations: BLOG • RESUME */}
          <nav
            aria-label="Footer destinations"
            className="flex items-center justify-center gap-5 sm:gap-7"
          >
            <Link
              href="/blogs"
              className="group relative text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-200 hover:text-cyan-400 transition-colors duration-200 py-1"
            >
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-400/80 transition-all duration-200 group-hover:w-full" />
            </Link>
            <span
              className="text-zinc-600 text-[10px] select-none"
              aria-hidden="true"
            >
              •
            </span>
            <Link
              href="/resume"
              className="group relative text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-200 hover:text-cyan-400 transition-colors duration-200 py-1"
            >
              Resume
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cyan-400/80 transition-all duration-200 group-hover:w-full" />
            </Link>
          </nav>

          {/* RIGHT: Subtle Legal Notice with safe clearance from floating Ask Pranay AI */}
          <div className="flex items-center justify-center md:justify-end text-center md:text-right pr-0 md:pr-36 lg:pr-40">
            <p className="text-[11px] text-zinc-500 tracking-normal whitespace-nowrap">
              ©{" "}
              <Suspense fallback={null}>
                <CopyrightYear />
              </Suspense>{" "}
              {config.author}. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;

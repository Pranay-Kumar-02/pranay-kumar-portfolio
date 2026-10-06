import React, { Suspense } from "react";
import Link from "next/link";
import { config } from "@/data/config";

function CopyrightYear() {
  const year = new Date().getFullYear();
  return <>{year}</>;
}

function Footer() {
  return (
    <footer className="w-full shrink-0 border-t border-zinc-800/60 bg-transparent px-4 sm:px-6 pt-5 pb-20 sm:py-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-2 sm:gap-2.5">
        {/* Compact, prominent navigation row: BLOG • RESUME */}
        <nav aria-label="Footer Navigation" className="flex items-center justify-center gap-6 sm:gap-8">
          <Link
            href="/blogs"
            className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-cyan-400 transition-colors duration-200"
          >
            Blog
          </Link>
          <span className="text-zinc-600 dark:text-zinc-600 text-xs select-none" aria-hidden="true">•</span>
          <Link
            href="/resume"
            className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-cyan-400 transition-colors duration-200"
          >
            Resume
          </Link>
        </nav>

        {/* Subtle legal row */}
        <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-500">
          ©{" "}
          <Suspense fallback={null}>
            <CopyrightYear />
          </Suspense>{" "}
          {config.author}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowUpRight, Clock, BookOpen } from "lucide-react";
import { motion } from "motion/react";

type Post = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    author?: string;
    tags?: string[];
  };
  wordCount: number;
};

function readTime(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogListClient({ posts }: { posts: Post[] }) {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen font-sans">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-sky-500" />
            </span>
            <span className="text-sky-400 text-xs font-mono font-semibold tracking-[0.2em] uppercase">
              Technical Writings // Pranay Kumar
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[1.05] tracking-tight text-foreground">
            Technical &amp; <br />
            <span className="animated-gradient-text">Systems Dispatches</span>
          </h1>
          <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            In-depth engineering notes on AI agent architectures, cybersecurity telemetry pipelines, dataset engineering, and full-stack software systems by Pranay Kumar.
          </p>
        </motion.div>

        {/* Featured post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <Link href={`/blogs/${featured.slug}`} className="group block">
              <div className="relative border border-border/70 rounded-2xl p-6 sm:p-8 md:p-12 overflow-hidden transition-all duration-300 hover:border-sky-500/40 bg-card/40 dark:bg-[#0b1019]/70 backdrop-blur-xl shadow-lg">
                {/* Corner accent glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-sky-500/10 via-violet-500/5 to-transparent rounded-bl-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-muted-foreground font-sans flex-wrap">
                    <span className="text-sky-400 font-mono font-semibold tracking-[0.15em] uppercase text-[11px] px-2.5 py-0.5 rounded-full border border-sky-500/25 bg-sky-500/10">
                      Featured Writeup
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDate(featured.metadata.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime(featured.wordCount)} min read
                    </span>
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl md:text-3xl leading-[1.2] mb-3 group-hover:text-sky-300 transition-colors duration-300 text-foreground">
                    {featured.metadata.title}
                  </h2>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl mb-6 font-sans">
                    {featured.metadata.summary}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-border/40">
                    <div className="flex gap-2 flex-wrap">
                      {featured.metadata.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-sky-500/20 text-sky-300 bg-sky-500/5 rounded-full px-3 text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-sky-300 transition-colors font-sans font-medium">
                      Read article
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Divider */}
        {rest.length > 0 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12 origin-left"
          />
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.25 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/blogs/${post.slug}`} className="group block h-full">
                <div className="h-full border border-border/70 rounded-xl p-6 sm:p-7 transition-all duration-300 hover:border-sky-500/40 hover:bg-card/60 bg-card/30 dark:bg-[#0b1019]/60 backdrop-blur-xl flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground font-sans">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(post.metadata.publishedAt)}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {readTime(post.wordCount)} min
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl leading-snug mb-2.5 group-hover:text-sky-300 transition-colors duration-300 text-foreground">
                      {post.metadata.title}
                    </h3>

                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 font-sans">
                      {post.metadata.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
                    <div className="flex gap-1.5 flex-wrap">
                      {post.metadata.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-border/60 text-muted-foreground text-[10px] rounded-full px-2 py-0"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-24"
          >
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-lg font-sans">No posts published yet. Check back soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { getBlogPost, getBlogPosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import ScrollProgress from "@/components/ui/scroll-progress";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RevealAnimation from "@/components/reveal-animations";
import { config } from "@/data/config";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: `${post.metadata.title} | ${config.author}`,
    description: post.metadata.summary,
  };
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const components = {
  h1: (props: any) => (
    <h1
      className="font-display text-2xl md:text-3xl leading-[1.15] mt-14 mb-6 text-foreground tracking-tight"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="font-display text-xl md:text-2xl leading-[1.2] mt-12 mb-4 text-foreground relative tracking-tight"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="font-display text-lg md:text-xl leading-[1.25] mt-8 mb-3 text-foreground"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="text-muted-foreground leading-[1.8] mb-7 text-[16px] sm:text-[17px] font-sans"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="mb-7 text-muted-foreground space-y-3 text-[16px] sm:text-[17px] leading-[1.8] font-sans list-disc pl-6"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal mb-7 text-muted-foreground space-y-3 text-[16px] sm:text-[17px] leading-[1.8] font-sans pl-6"
      {...props}
    />
  ),
  li: (props: any) => (
    <li className="pl-1" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-2 border-sky-400 pl-6 my-8 text-foreground/90 italic text-base sm:text-lg leading-relaxed font-sans bg-card/20 py-3 rounded-r-lg"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-muted/60 text-sky-300 px-1.5 py-0.5 rounded text-[14px] sm:text-[15px] font-mono border border-border/40"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="bg-card/80 dark:bg-[#070b12] p-5 rounded-xl overflow-x-auto mb-8 border border-border/70 text-sm leading-relaxed font-mono shadow-md"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/40 underline-offset-4 hover:decoration-sky-400 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  ),
  strong: (props: any) => (
    <strong className="text-foreground font-semibold" {...props} />
  ),
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen relative font-sans">
      <ScrollProgress className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400" />

      {/* Decorative ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-sky-500/[0.04] blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-24 max-w-[760px]">
        {/* Back link */}
        <RevealAnimation>
          <Link
            href="/blogs"
            className="inline-flex items-center text-muted-foreground hover:text-sky-400 transition-colors mb-12 group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all dispatches
          </Link>
        </RevealAnimation>

        {/* Article header */}
        <RevealAnimation delay={0.1}>
          <header className="mb-12">
            {/* Tags */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {post.metadata.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-sky-500/25 text-sky-300 bg-sky-500/10 rounded-full px-3 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.15] tracking-tight mb-8 text-foreground">
              {post.metadata.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground pb-8 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
                  <User className="size-3 text-sky-400" />
                </div>
                <span className="font-medium text-foreground">
                  {post.metadata.author || config.author}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {formatDate(post.metadata.publishedAt)}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </div>
            </div>
          </header>
        </RevealAnimation>

        {/* Article body */}
        <RevealAnimation delay={0.2}>
          <article className="prose prose-invert max-w-none">
            <MDXRemote source={post.content} components={components} />
          </article>
        </RevealAnimation>

        {/* Footer divider & Back link */}
        <RevealAnimation delay={0.1}>
          <div className="mt-20 pt-8 border-t border-border/50 flex items-center justify-between">
            <Link
              href="/blogs"
              className="inline-flex items-center text-muted-foreground hover:text-sky-400 transition-colors group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to all dispatches
            </Link>
            <span className="text-xs text-muted-foreground font-mono">
              Written by {config.fullName}
            </span>
          </div>
        </RevealAnimation>
      </div>
    </div>
  );
}

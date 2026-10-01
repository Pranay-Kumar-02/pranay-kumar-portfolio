import React from "react";
import { getBlogPosts } from "@/lib/mdx";
import BlogListClient from "./blog-list-client";

export const metadata = {
  title: "Engineering Blog | Pranay Kumar",
  description:
    "Technical write-ups, deep dives into AI agents, cybersecurity telemetry, and software engineering by Pranay Kumar.",
};

export default function BlogPage() {
  const posts = getBlogPosts()
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .map((post) => ({
      slug: post.slug,
      metadata: post.metadata,
      wordCount: post.content.trim().split(/\s+/).length,
    }));

  return <BlogListClient posts={posts} />;
}

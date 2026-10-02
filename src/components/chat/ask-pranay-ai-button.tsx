"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useChatbot } from "@/lib/chatbot-context";
import { cn } from "@/lib/utils";

export const AskPranayAIButton: React.FC<{ className?: string }> = ({ className }) => {
  const { isOpen, toggleChatbot } = useChatbot();

  if (isOpen) return null;

  return (
    <button
      onClick={toggleChatbot}
      aria-label="Open Ask Pranay AI"
      className={cn(
        "fixed bottom-6 right-6 z-[9990] group flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer",
        "bg-[#090b10]/90 text-white border border-cyan-500/30 backdrop-blur-xl",
        "shadow-xl shadow-cyan-950/30 hover:shadow-cyan-500/20 hover:border-cyan-400/60",
        "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
      </div>
      <span className="text-xs font-semibold tracking-wide text-zinc-100 group-hover:text-cyan-300 transition-colors">
        Ask Pranay AI
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
    </button>
  );
};

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowUp,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CornerDownLeft,
} from "lucide-react";
import { useChatbot } from "@/lib/chatbot-context";
import { ChatMarkdown } from "./chat-markdown";
import { cn } from "@/lib/utils";

const STARTER_PROMPTS = [
  { label: "Who is Pranay?", prompt: "Who is Pranay?" },
  { label: "Tell me about Spendly", prompt: "Tell me about Spendly" },
  { label: "Explain RAG", prompt: "Explain RAG" },
  { label: "Ask anything", prompt: "What technologies does Pranay use?" },
];

export const AskPranayAIChat: React.FC = () => {
  const {
    isOpen,
    closeChatbot,
    messages,
    sendMessage,
    clearChat,
    isLoading,
    error,
  } = useChatbot();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message or state change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeChatbot();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChatbot]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    await sendMessage(text);
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleStarterClick = async (prompt: string) => {
    if (isLoading) return;
    if (prompt === "What technologies does Pranay use?") {
      setInput(prompt);
      inputRef.current?.focus();
    } else {
      await sendMessage(prompt);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={chatContainerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ask Pranay AI Assistant"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed z-[99999] flex flex-col overflow-hidden origin-bottom-right",
            // Studio-grade deep obsidian glass styling
            "bg-[#090b10]/95 backdrop-blur-2xl text-zinc-100",
            "border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_-10px_rgba(6,182,212,0.12)]",
            // Strictly anchor to right side on all screen sizes
            "right-4 sm:right-6 bottom-4 sm:bottom-6 left-auto",
            // Dimensions & rounded shape
            "w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px]",
            "h-[min(640px,calc(100dvh-2.5rem))] sm:h-[640px] sm:max-h-[min(700px,calc(100dvh-48px))] rounded-2xl"
          )}
        >
          {/* Subtle top edge cyan rim highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0d14]/80 border-b border-white/[0.06] select-none shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-950 to-zinc-950 border border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-950/40">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-[13.5px] tracking-tight text-white">
                    Ask Pranay AI
                  </h2>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={closeChatbot}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Close chat (Esc)"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5 text-[13.5px]",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Minimal Avatar for Assistant */}
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-cyan-500/25 text-cyan-400 flex items-center justify-center text-[10px] mt-0.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={cn(
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-tr-xs px-3.5 py-2.5 bg-zinc-800/90 text-zinc-100 border border-white/[0.08] shadow-sm font-sans"
                      : "flex-1 min-w-0 text-zinc-200 font-sans"
                  )}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap leading-relaxed text-[13.5px]">
                      {msg.content}
                    </p>
                  ) : (
                    <ChatMarkdown content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Elegant Minimal Starter Chips (Only on first open / empty conversation) */}
            {messages.length <= 1 && (
              <div className="pt-2 pl-8">
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStarterClick(item.prompt)}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full font-medium",
                        "bg-white/[0.04] text-zinc-300 border border-white/[0.08]",
                        "hover:bg-cyan-500/10 hover:border-cyan-400/40 hover:text-cyan-300",
                        "transition-all duration-150 cursor-pointer"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 pl-0.5">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-cyan-500/25 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 animate-pulse text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/[0.06]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="text-[11.5px] text-zinc-400 ml-1 font-medium">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            {/* Clean Error Message */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Composer */}
          <div className="p-3 bg-[#0a0d14]/90 border-t border-white/[0.06] shrink-0">
            <div className="relative flex items-end gap-2 bg-zinc-900/80 border border-white/[0.1] focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 rounded-xl px-3 py-2 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputResize}
                onKeyDown={handleKeyDown}
                placeholder="Ask Pranay AI anything..."
                rows={1}
                className="flex-1 max-h-28 min-h-[22px] bg-transparent resize-none border-0 p-0 text-[13.5px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 leading-5"
                style={{ height: "auto" }}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-lg transition-all shrink-0",
                  input.trim() && !isLoading
                    ? "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 shadow-sm shadow-cyan-500/40 cursor-pointer"
                    : "bg-white/[0.04] text-zinc-600 cursor-not-allowed"
                )}
                title="Send message (Enter)"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-zinc-500 select-none">
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3 inline text-zinc-600" /> Enter sends • Shift+Enter for new line
              </span>
              <span className="text-zinc-600">Production AI</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

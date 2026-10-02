"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
  error: string | null;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

const INITIAL_GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Heyya — I'm Pranay AI. Ask me anything.\n\nI know Pranay, his work, and tech — and I can still handle everything else.",
  timestamp: Date.now(),
};

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openChatbot = useCallback(() => setIsOpen(true), []);
  const closeChatbot = useCallback(() => setIsOpen(false), []);
  const toggleChatbot = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "cleared-" + Date.now(),
        role: "assistant",
        content:
          "Chat cleared! How can I assist you now? Feel free to ask about Pranay, projects, or any technical topic.",
        timestamp: Date.now(),
      },
    ]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content) {
        return;
      }

      setError(null);

      const userMessage: ChatMessage = {
        id: "user-" + Date.now(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const payload = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: payload }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to receive a response.");
        }

        const assistantMessage: ChatMessage = {
          id: "assistant-" + Date.now(),
          role: "assistant",
          content: data.reply || "I didn't receive a reply. Please try again.",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: unknown) {
        console.error("[Ask Pranay AI] Chat error:", err);
        setError("Something went wrong. Try again in a moment.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        openChatbot,
        closeChatbot,
        toggleChatbot,
        messages,
        sendMessage,
        clearChat,
        isLoading,
        error,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { THEME } from "../constants";

export type SlashCommand = {
  name: string;
  description: string;
  replacement: string | null; // null means special handling (e.g., /me)
};

export const SLASH_COMMANDS: SlashCommand[] = [
  { name: "/admin", description: "Authenticate as admin", replacement: null },
  { name: "/shrug", description: "Appends ¯\\_(ツ)_/¯", replacement: "¯\\_(ツ)_/¯" },
  { name: "/tableflip", description: "Flips the table", replacement: "(╯°□°)╯︵ ┻━┻" },
  { name: "/unflip", description: "Puts the table back", replacement: "┬─┬ノ( º _ ºノ)" },
  { name: "/lenny", description: "Appends ( ͡° ͜ʖ ͡°)", replacement: "( ͡° ͜ʖ ͡°)" },
  { name: "/me", description: "Send an action — /me waves", replacement: null },
];

interface SlashCommandMenuProps {
  query: string;
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
}

export const SlashCommandMenu = ({ query, selectedIndex, onSelect }: SlashCommandMenuProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = SLASH_COMMANDS.filter(c => c.name.startsWith(query.toLowerCase()));

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={listRef}
      className={cn(
        "absolute bottom-full left-0 right-0 mb-1 rounded-lg border shadow-lg overflow-hidden max-h-48 overflow-y-auto z-10",
        THEME.bg.secondary,
        THEME.border.primary
      )}
    >
      {filtered.map((cmd, i) => (
        <button
          key={cmd.name}
          type="button"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
            i === selectedIndex ? cn(THEME.bg.active, THEME.text.header) : cn(THEME.text.primary, THEME.bg.itemHover),
          )}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(cmd);
          }}
        >
          <span className="font-semibold shrink-0">{cmd.name}</span>
          <span className={cn("text-xs truncate", THEME.text.secondary)}>{cmd.description}</span>
        </button>
      ))}
    </div>
  );
};

export const getFilteredCommands = (query: string) =>
  SLASH_COMMANDS.filter(c => c.name.startsWith(query.toLowerCase()));

export type ProcessedCommand =
  | { type: "message"; content: string }
  | { type: "admin" };

export const processSlashCommand = (text: string): ProcessedCommand => {
  const trimmed = text.trim();

  // /admin → open password dialog (no password in chat input)
  if (trimmed === "/admin") {
    return { type: "admin" };
  }

  // /me <action> → *<action>*
  if (trimmed.startsWith("/me ")) {
    const action = trimmed.slice(4).trim();
    return { type: "message", content: action ? `*${action}*` : trimmed };
  }

  // Other commands: check if message is exactly or starts with a command
  for (const cmd of SLASH_COMMANDS) {
    if (cmd.replacement === null) continue;
    if (trimmed === cmd.name) {
      return { type: "message", content: cmd.replacement };
    }
    if (trimmed.startsWith(cmd.name + " ")) {
      const rest = trimmed.slice(cmd.name.length);
      return { type: "message", content: rest + " " + cmd.replacement };
    }
  }

  return { type: "message", content: text };
};

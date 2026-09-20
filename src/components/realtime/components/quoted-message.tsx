import React from "react";
import { cn } from "@/lib/utils";
import { THEME } from "../constants";
import { getAvatarUrl } from "@/lib/avatar";

interface QuotedMessageProps {
  username: string;
  content: string;
  color?: string;
  avatar?: string;
  onClickQuote: () => void;
}

export const QuotedMessage = ({ username, content, color, avatar, onClickQuote }: QuotedMessageProps) => {
  return (
    <button
      type="button"
      onClick={onClickQuote}
      className={cn(
        "flex items-center gap-1 text-left pl-3 py-0.5 mb-0.5 cursor-pointer w-full max-w-full overflow-hidden",
        "border-l-2 border-black/20 dark:border-white/15",
        "hover:border-black/40 dark:hover:border-white/30 transition-colors"
      )}
    >
      {avatar && (
        <img
          src={getAvatarUrl(avatar)}
          alt=""
          className="w-4 h-4 rounded-full shrink-0"
          style={{ backgroundColor: color || '#60a5fa' }}
        />
      )}
      <span className="text-xs font-semibold shrink-0 hover:underline" style={{ color: color || undefined }}>
        @{username}
      </span>
      <span className={cn("text-xs truncate min-w-0 flex-1", THEME.text.secondary)}>{content}</span>
    </button>
  );
};

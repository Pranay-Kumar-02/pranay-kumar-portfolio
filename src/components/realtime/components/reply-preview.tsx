import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME } from "../constants";

interface ReplyPreviewProps {
  username: string;
  content: string;
  onCancel: () => void;
}

export const ReplyPreview = ({ username, content, onCancel }: ReplyPreviewProps) => {
  const truncated = content.length > 50 ? content.slice(0, 50) + "…" : content;

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 border-l-2 border-[#5865f2] rounded-t-lg", THEME.bg.tertiary)}>
      <div className="flex-1 min-w-0">
        <span className={cn("text-xs font-semibold", THEME.text.header)}>
          Replying to {username}
        </span>
        <p className={cn("text-xs truncate", THEME.text.secondary)}>{truncated}</p>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className={cn("shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10", THEME.text.secondary)}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { THEME } from "../constants";
import { Shield } from "lucide-react";

interface AdminPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export const AdminPasswordDialog = ({ isOpen, onClose, onSubmit }: AdminPasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password.trim());
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
        className={cn(
          "w-[320px] p-5 rounded-xl shadow-2xl flex flex-col gap-4",
          "bg-white dark:bg-[#2b2d31] border border-white/10",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <h3 className={cn("text-base font-semibold", THEME.text.header)}>Admin Authentication</h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className={cn(
              "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors",
              "bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/10",
              "focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2]",
              THEME.text.primary, THEME.text.placeholder,
            )}
            autoComplete="off"
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={cn(THEME.text.secondary)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
              disabled={!password.trim()}
            >
              Authenticate
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

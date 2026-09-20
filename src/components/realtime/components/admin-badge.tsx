import React from "react";
import { Shield } from "lucide-react";

export const AdminBadge = () => (
  <span className="inline-flex items-center gap-0.5 bg-amber-500/15 text-amber-500 text-[10px] px-1 rounded font-bold" title="Admin">
    <Shield className="w-2.5 h-2.5" />
    ADMIN
  </span>
);

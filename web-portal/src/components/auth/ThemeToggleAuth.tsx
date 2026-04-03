"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggleAuth() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute top-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-full bg-surface-lowest border border-glass-border hover:bg-surface-low transition-colors text-on-surface-variant hover:text-on-surface shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

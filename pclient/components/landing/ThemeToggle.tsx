"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

// Toggles the marketing page between Poste's dark and light visual themes.
export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  function toggleTheme() {
    const nextThemeIsLight = !isLight;
    setIsLight(nextThemeIsLight);
    document.documentElement.dataset.theme = nextThemeIsLight ? "light" : "dark";
  }

  return (
    <button
      className="icon-button"
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? <Moon size={17} strokeWidth={1.8} /> : <Sun size={17} strokeWidth={1.8} />}
    </button>
  );
}

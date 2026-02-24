"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ThemeName = "dark" | "midnight" | "cyberpunk" | "light";

interface ThemeConfig {
  name: ThemeName;
  label: string;
  preview: string; // CSS gradient for the preview swatch
}

export const themes: ThemeConfig[] = [
  { name: "dark", label: "Dark", preview: "linear-gradient(135deg, #0a0b14, #1e293b)" },
  { name: "midnight", label: "Midnight", preview: "linear-gradient(135deg, #0c1229, #1a2744)" },
  { name: "cyberpunk", label: "Neon", preview: "linear-gradient(135deg, #0a0a12, #1a0a2e)" },
  { name: "light", label: "Light", preview: "linear-gradient(135deg, #f0f4f8, #ffffff)" },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("semiconductor-theme") as ThemeName | null;
    if (saved && themes.some((t) => t.name === saved)) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("semiconductor-theme", theme);
    }
  }, [theme, mounted]);

  const setTheme = (t: ThemeName) => setThemeState(t);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

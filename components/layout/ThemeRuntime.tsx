"use client";

import { useEffect } from "react";

import { applyBackgroundColors, applyThemeColors, applyThemeMode } from "@/lib/theme";
import type { ThemeConfig } from "@/types/siteConfig";

type ThemeRuntimeProps = {
  theme: ThemeConfig;
};

export function ThemeRuntime({ theme }: ThemeRuntimeProps) {
  useEffect(() => {
    applyThemeColors(theme);
    applyBackgroundColors(theme);
    applyThemeMode(theme);
  }, [theme]);

  return null;
}

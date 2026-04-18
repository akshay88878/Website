import type { ThemeConfig } from "@/types/siteConfig";

const backgroundPalettes: Record<
  string,
  {
    body: string;
    page: string;
    panel: string;
    border: string;
  }
> = {
  aurora: {
    body: "#f7f8fc",
    page: "radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 35%), radial-gradient(circle at top right, rgba(34, 199, 255, 0.18), transparent 32%), linear-gradient(180deg, #ffffff 0%, #f7f8fc 100%)",
    panel: "rgba(255, 255, 255, 0.85)",
    border: "rgba(255, 255, 255, 0.7)"
  },
  paper: {
    body: "#f8fafc",
    page: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
    panel: "rgba(255, 255, 255, 0.92)",
    border: "rgba(203, 213, 225, 0.7)"
  },
  midnight: {
    body: "#0b1020",
    page: "radial-gradient(circle at top left, rgba(79, 70, 229, 0.22), transparent 30%), radial-gradient(circle at top right, rgba(34, 199, 255, 0.16), transparent 28%), linear-gradient(180deg, #0b1020 0%, #111827 100%)",
    panel: "rgba(15, 23, 42, 0.78)",
    border: "rgba(148, 163, 184, 0.2)"
  }
};

const cardShadowMap: Record<string, string> = {
  elevated: "0 18px 48px rgba(15, 23, 42, 0.08)",
  soft: "0 12px 32px rgba(15, 23, 42, 0.06)",
  flat: "0 0 0 rgba(0, 0, 0, 0)"
};

const sectionStyleMap: Record<
  string,
  {
    panel: string;
    border: string;
  }
> = {
  glass: {
    panel: "",
    border: ""
  },
  solid: {
    panel: "rgba(255, 255, 255, 0.96)",
    border: "rgba(226, 232, 240, 0.9)"
  },
  minimal: {
    panel: "rgba(255, 255, 255, 0.72)",
    border: "rgba(203, 213, 225, 0.56)"
  }
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized
        .split("")
        .map((char) => `${char}${char}`)
        .join("")
    : normalized;

  const parsed = Number.parseInt(safeHex, 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  };
}

function getPalette(theme: ThemeConfig) {
  return backgroundPalettes[theme.backgroundPalette] || backgroundPalettes.aurora;
}

function getThemeColorTokens(theme: ThemeConfig) {
  const { r, g, b } = hexToRgb(theme.primary);

  return {
    "--theme-primary": theme.primary,
    "--theme-primary-rgb": `${r} ${g} ${b}`,
    "--theme-primary-soft": `rgba(${r}, ${g}, ${b}, 0.12)`,
    "--theme-primary-border": `rgba(${r}, ${g}, ${b}, 0.24)`,
    "--theme-primary-shadow": `rgba(${r}, ${g}, ${b}, 0.18)`
  };
}

function getThemeBackgroundTokens(theme: ThemeConfig) {
  const palette = getPalette(theme);
  const cardShadow = cardShadowMap[theme.cardStyle] || cardShadowMap.elevated;
  const sectionStyle = sectionStyleMap[theme.sectionStyle] || sectionStyleMap.glass;

  return {
    "--theme-body-bg": palette.body,
    "--theme-page-bg": palette.page,
    "--theme-panel-bg": sectionStyle.panel || palette.panel,
    "--theme-panel-border": sectionStyle.border || palette.border,
    "--theme-card-shadow": cardShadow
  };
}

function getThemeModeTokens(theme: ThemeConfig) {
  const darkMode = theme.mode === "dark" || theme.backgroundPalette === "midnight";

  return {
    mode: darkMode ? "dark" : "light",
    tokens: {
      "--theme-body-text": darkMode ? "#eef2f8" : "#0e1726",
      "--theme-muted-text": darkMode ? "#c6d0dd" : "#36445d",
      "--theme-selection-bg": darkMode
        ? "rgba(79, 70, 229, 0.35)"
        : "rgba(79, 70, 229, 0.22)"
    }
  };
}

export function buildThemeStyleVariables(theme: ThemeConfig) {
  const modeTokens = getThemeModeTokens(theme);

  return {
    ...getThemeColorTokens(theme),
    ...getThemeBackgroundTokens(theme),
    ...modeTokens.tokens,
    colorScheme: modeTokens.mode,
    ["--theme-mode" as const]: modeTokens.mode
  };
}

export function applyThemeColors(
  theme: ThemeConfig,
  root: HTMLElement = document.documentElement
) {
  const tokens = getThemeColorTokens(theme);

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function applyBackgroundColors(
  theme: ThemeConfig,
  root: HTMLElement = document.documentElement
) {
  const tokens = getThemeBackgroundTokens(theme);

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function applyThemeMode(
  theme: ThemeConfig,
  root: HTMLElement = document.documentElement
) {
  const { mode, tokens } = getThemeModeTokens(theme);

  root.dataset.theme = mode;
  root.style.colorScheme = mode;

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

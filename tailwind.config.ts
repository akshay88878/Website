import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem"
      }
    },
    extend: {
      colors: {
        ink: {
          50: "#f5f7fb",
          100: "#edf1f8",
          200: "#d9e1ee",
          300: "#afbdd1",
          400: "#7183a0",
          500: "#4e5f7c",
          600: "#36445d",
          700: "#243146",
          800: "#182335",
          900: "#0e1726"
        },
        brand: {
          50: "#eef0ff",
          100: "#dde2ff",
          200: "#c2caff",
          300: "#9da9ff",
          400: "#7a84ff",
          500: "#4f46e5",
          600: "#4038ca",
          700: "#342fa3",
          800: "#2d2b81",
          900: "#22245f"
        },
        accent: {
          50: "#e8fbff",
          100: "#c9f4ff",
          200: "#9fe9ff",
          300: "#65d8ff",
          400: "#22c7ff",
          500: "#00afe8",
          600: "#078abc",
          700: "#0e6d96",
          800: "#135879",
          900: "#154a64"
        },
        surface: {
          DEFAULT: "#f7f8fc",
          muted: "#eef2f8",
          border: "#d9e3f0",
          strong: "#ffffff"
        }
      },
      fontFamily: {
        sans: ["var(--font-manrope)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-space-grotesk)", ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(79, 70, 229, 0.18)",
        soft: "0 18px 48px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(79, 70, 229, 0.18), transparent 35%), radial-gradient(circle at top right, rgba(34, 199, 255, 0.18), transparent 32%), linear-gradient(180deg, #ffffff 0%, #f7f8fc 100%)"
      },
      animation: {
        "fade-in-up": "fade-in-up 700ms ease-out both",
        "pulse-ring": "pulse-ring 4s ease-in-out infinite"
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(18px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "pulse-ring": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.7"
          },
          "50%": {
            transform: "scale(1.08)",
            opacity: "1"
          }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;

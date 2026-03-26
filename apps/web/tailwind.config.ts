import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Semantic surface tokens — resolved via CSS variables so dark mode is automatic
        surface: {
          DEFAULT: "rgb(var(--color-bg) / <alpha-value>)",
          raised:  "rgb(var(--color-bg-raised) / <alpha-value>)",
          subtle:  "rgb(var(--color-bg-subtle) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-fg) / <alpha-value>)",
          muted:   "rgb(var(--color-fg-muted) / <alpha-value>)",
          subtle:  "rgb(var(--color-fg-subtle) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        success: "#059669",
        warning: "#d97706",
        danger:  "#dc2626",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        sans:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card:    "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-md": "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [forms],
};

export default config;

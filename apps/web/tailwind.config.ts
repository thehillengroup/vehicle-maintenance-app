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
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          50: "#fff1e7",
          100: "#ffe0d1",
          200: "#fec7a7",
          300: "#fda97a",
          400: "#fb8a4b",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        surface: {
          DEFAULT: "#f8fafc",
          raised: "#ffffff",
          subtle: "#f1f5f9",
        },
        navy: {
          DEFAULT: "#0b1220",
          light: "#131d33",
          contrast: "#e7ecff",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#475569",
          subtle: "#64748b",
        },
        border: "#e2e8f0",
        success: "#059669",
        warning: "#ca8a04",
        danger: "#dc2626",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 18px 40px -24px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [forms],
};

export default config;

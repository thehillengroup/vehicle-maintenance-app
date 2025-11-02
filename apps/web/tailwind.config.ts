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
          50: "#f1f6ff",
          100: "#dde8ff",
          200: "#b8cfff",
          300: "#86acff",
          400: "#4d80ff",
          500: "#265cff",
          600: "#123ede",
          700: "#0d2fb0",
          800: "#0f2c8c",
          900: "#112a70",
        },
        border: "#d6e1ff",
        card: "#ffffff",
        muted: {
          50: "#f8fafc",
          100: "#eef2ff",
          500: "#64748b",
        },
      },
      boxShadow: {
        card: "0 10px 30px -15px rgba(17, 42, 112, 0.35)",
      },
    },
  },
  plugins: [forms],
};

export default config;

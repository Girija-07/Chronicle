// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        danger:  "#ef4444",
        info:    "#3b82f6",
      },
      fontFamily: {
        sans:  ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono:  ["Fira Code", "monospace"],
      },
      fontSize: {
        "xs":   ["0.75rem",  { lineHeight: "1rem" }],
        "sm":   ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem",     { lineHeight: "1.5rem" }],
        "lg":   ["1.125rem", { lineHeight: "1.75rem" }],
        "xl":   ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl":  ["1.5rem",   { lineHeight: "2rem" }],
        "3xl":  ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl":  ["2.25rem",  { lineHeight: "2.5rem" }],
        "5xl":  ["3rem",     { lineHeight: "1" }],
        "6xl":  ["3.75rem",  { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "prose-lg": "75ch",
        "content":  "1200px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "card":      "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover":"0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)",
        "modal":     "0 20px 60px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
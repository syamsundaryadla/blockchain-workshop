import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8FAFC",
          muted: "#F1F5F9",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F8FAFC",
          card: "#FFFFFF",
          border: "#CBD5E1",
          hover: "#F1F5F9",
        },
        primary: {
          DEFAULT: "#2563EB", // Royal Blue
          dark: "#1D4ED8",
          light: "#DBEAFE",
          glow: "rgba(37, 99, 235, 0.12)",
        },
        heading: "#0F172A", // Dark Navy
        accent: {
          DEFAULT: "#0D9488", // Teal
          dark: "#0F766E",
          light: "#CCFBF1",
        },
        success: {
          DEFAULT: "#059669", // Emerald
          light: "#D1FAE5",
          border: "#A7F3D0",
        },
        warning: {
          DEFAULT: "#D97706", // Amber
          light: "#FEF3C7",
          border: "#FDE68A",
        },
        danger: {
          DEFAULT: "#DC2626", // Red
          light: "#FEE2E2",
          border: "#FECACA",
        },
        text: {
          DEFAULT: "#334155", // Slate
          heading: "#0F172A", // Dark Navy
          muted: "#64748B", // Slate 500
          dim: "#94A3B8", // Slate 400
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

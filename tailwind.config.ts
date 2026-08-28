/** @type {import('tailwindcss').Config} */
import { withUt } from "uploadthing/tw";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

module.exports = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        mustard: {
          50: "#FDF9EE",
          100: "#FAF1D5",
          200: "#F5E2AA",
          300: "#ECCF75",
          400: "#E2B742",
          500: "#D49A25",
          600: "#C88A2B", // Primary Accent Brand Gold
          700: "#A46B1E",
          800: "#84531C",
          900: "#6D441B",
        },
        terracotta: {
          50: "#FAF3EF",
          100: "#F3E3D9",
          200: "#E7C5B2",
          300: "#D8A284",
          400: "#C27A52",
          500: "#9C4E1F",
          600: "#7A4117", // Earthy secondary
          700: "#5F3110",
          800: "#48250C",
          900: "#361B09",
        },
        heritageTeal: {
          50: "#F0F7F7",
          100: "#DBEBEB",
          200: "#B8D7D7",
          300: "#86BABD",
          400: "#4E9498",
          500: "#2A6668",
          600: "#1D4D4F", // Dark forest teal / footer / divider blocks
          700: "#163A3C",
          800: "#102A2B",
          900: "#0A1B1C",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        parchment: {
          50: "#FCFAF6",
          100: "#FDFBF7", // Content background
          200: "#F7F2E7",
          300: "#EFE6D5",
          400: "#DFD2BA",
          500: "#C4B294",
        },
        primaryGreen: {
          50: "#F3FAF5",
          100: "#DDF4E5",
          200: "#BCE8CA",
          300: "#92D6A7",
          400: "#5CB878",
          500: "#2E8B57",
          600: "#C88A2B", // Brand Color
          700: "#A46B1E", // Hover
          800: "#7A4117", // Active
          900: "#1D4D4F", // Footer / Dark Sections
        },
        cvsGreen: {
          DEFAULT: "#C88A2B",
        },
        coral: {
          "500": "#C88A2B",
        },
        grey: {
          "50": "#FAF8F5",
          "400": "#AFAFAF",
          "500": "#757575",
          "600": "#545454",
        },
        black: "#1A1714",
        white: "#FFFFFF",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      spacing: {
        "1920": "1920px",
        "1080": "1080px",
      },
      fontFamily: {
        sans: ["var(--font-bengali)", "var(--font-inter)", "sans-serif"],
        serif: ["var(--font-dm-serif)", "var(--font-bengali)", "serif"],
        bengali: ["var(--font-bengali)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate, typography],
});

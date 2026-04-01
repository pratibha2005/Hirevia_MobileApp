import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Manrope", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        /* ── Surfaces ── */
        surface: {
          base:    "var(--surface-base)",
          low:     "var(--surface-low)",
          lowest:  "var(--surface-lowest)",
          mid:     "var(--surface-mid)",
          high:    "var(--surface-high)",
          highest: "var(--surface-highest)",
        },

        /* ── Text ── */
        "on-surface": {
          DEFAULT: "var(--on-surface)",
          variant: "var(--on-surface-variant)",
          subtle:  "var(--on-surface-subtle)",
        },

        /* ── Brand ── */
        primary: {
          DEFAULT:  "var(--primary)",
          hover:    "var(--primary-hover)",
          light:    "var(--primary-light)",
          glow:     "var(--primary-glow)",
          gradient: {
            start: "var(--primary-gradient-start)",
            end:   "var(--primary-gradient-end)",
          },
          fixed: "var(--primary-fixed)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light:   "var(--secondary-light)",
        },

        /* ── Semantic ── */
        success: "var(--success)",
        danger:  "var(--danger)",
        warning: "var(--warning)",

        /* ── Glass ── */
        glass: {
          DEFAULT: "var(--glass-bg)",
          border:  "var(--glass-border)",
        },

        /* ── Legacy ── */
        "on-primary-fixed": {
          variant: "var(--on-primary-fixed-variant)",
        },
        outline: {
          variant: "var(--outline-variant)",
        },
      },

      borderRadius: {
        "4xl": "2rem",
        "3xl": "1.5rem",
        "2xl": "1.25rem",
        xl:    "1rem",        // cards: 16px
        lg:    "0.75rem",     // modals inner
        md:    "0.625rem",    // buttons/inputs: 10px
        sm:    "0.375rem",
        full:  "9999px",
      },

      boxShadow: {
        glass:      "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
        "glow-sm":  "0 4px 16px rgba(79,70,229,0.35)",
        "glow-md":  "0 8px 32px rgba(79,70,229,0.3), 0 0 0 1px rgba(79,70,229,0.2)",
        "glow-lg":  "0 0 48px rgba(79,70,229,0.4), 0 0 96px rgba(79,70,229,0.15)",
        "card":     "0 4px 24px rgba(0,0,0,0.5)",
        "card-hover":"0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,70,229,0.25)",
        "drawer":   "-8px 0 40px rgba(0,0,0,0.6)",
        "modal":    "0 24px 80px rgba(0,0,0,0.7)",
      },

      backdropBlur: {
        xs:    "4px",
        sm:    "8px",
        md:    "12px",
        lg:    "16px",
        xl:    "20px",
        "2xl": "28px",
        "3xl": "40px",
      },

      keyframes: {
        "pulse-ring": {
          "0%":   { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        "fade-up": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-ring":     "pulse-ring 1.8s ease-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-up":        "fade-up 0.3s ease-out",
        "float":          "float 3s ease-in-out infinite",
        shimmer:          "shimmer 2s linear infinite",
      },

      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, var(--primary) 0%, var(--primary-gradient-end) 100%)",
        "accent-gradient":  "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)",
        "card-gradient":    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
        "sidebar-gradient": "linear-gradient(180deg, rgba(79,70,229,0.08) 0%, transparent 60%)",
        "dark-gradient":    "linear-gradient(180deg, #0F1830 0%, #0B1020 100%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

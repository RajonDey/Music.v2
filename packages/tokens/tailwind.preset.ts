import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        card: "var(--bg-card)",
        elevated: "var(--bg-elevated)",
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent-primary)",
          strong: "var(--accent-strong)",
          secondary: "var(--accent-secondary)",
          soft: "var(--accent-soft)",
        },
        stage: {
          discovering: "var(--stage-discovering)",
          learning: "var(--stage-learning)",
          comfortable: "var(--stage-comfortable)",
          recorded: "var(--stage-recorded)",
          shared: "var(--stage-shared)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "140ms",
        base: "220ms",
        slow: "420ms",
      },
      letterSpacing: {
        tightish: "-0.015em",
      },
      maxWidth: {
        prose: "60ch",
      },
      animation: {
        rise: "hm-rise var(--dur-slow) var(--ease-out) both",
        fade: "hm-fade var(--dur-base) var(--ease-out) both",
      },
    },
  },
};

export default preset;

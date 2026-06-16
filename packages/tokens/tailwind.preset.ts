import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        card: "var(--bg-card)",
        elevated: "var(--bg-elevated)",
        border: "var(--border)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent-primary)",
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
      },
    },
  },
};

export default preset;

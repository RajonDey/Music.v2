import type { Config } from "tailwindcss";
import musicPreset from "@music/tokens/tailwind-preset";

const config: Config = {
  presets: [musicPreset as Config],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;

/*
 * Hallmark · macrostructure: Long Document · S1 left-margin-numbered list
 * Tools the artist uses. Editorial numbered list with hairline rules.
 */
import type { Metadata } from "next";
import { SectionLabel } from "@music/ui";
import { SiteFooter } from "@/components/public/SiteFooter";
import { Reveal } from "@/components/public/Reveal";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "The gear and software Rajon Dey uses to craft melodies and sounds — guitar, Ableton Live, VST plugins, recording gear, and MIDI.",
};

const tools = [
  {
    name: "Guitar",
    body: "My guitar is the heart of my creativity. It keeps me connected to the music and fuels my passion every day.",
  },
  {
    name: "DAW — Ableton Live",
    body: "I use Ableton Live to record, mix, and produce tracks. It's where the magic happens in the studio.",
  },
  {
    name: "VST Plugins & Effects",
    body: "Serum, Omnisphere, and others — essential for adding depth and flavor, from ambient soundscapes to intricate melodies.",
  },
  {
    name: "Microphone & Recording Gear",
    body: "Quality recording gear keeps the sound crisp and true to the vision of the track.",
  },
  {
    name: "MIDI Controller",
    body: "My virtual instrument for triggering sounds, building beats, and experimenting with melodies in real time.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-32 sm:px-10">
        <SectionLabel className="mb-5">Tools</SectionLabel>
        <h1 className="font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
          The kit behind the sound
        </h1>
        <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-secondary">
          Creating music is a dynamic process, and the right tools help bring
          ideas to life. Here&apos;s a glimpse of what I reach for when I craft
          melodies and sounds.
        </p>

        <ol className="mt-14">
          {tools.map((tool, i) => (
            <Reveal
              as="li"
              key={tool.name}
              delay={i * 70}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-border py-7 sm:gap-x-7"
            >
              <span className="pt-1 font-display text-sm tabular-nums text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-xl tracking-[-0.01em] text-primary">
                  {tool.name}
                </h2>
                <p className="mt-2 leading-relaxed text-secondary">
                  {tool.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <p className="mt-12 max-w-prose leading-relaxed text-secondary">
          Just a brief overview of what I rely on to bring music to life. Each
          one plays a part in turning a vague idea into something I can
          actually hear.
        </p>
      </div>

      <SiteFooter />
    </>
  );
}

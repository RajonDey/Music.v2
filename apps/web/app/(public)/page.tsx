import Link from "next/link";
import { Badge, Brand, Card, SectionLabel } from "@music/ui";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";

const listen = [
  {
    label: "SoundCloud",
    handle: "/rajondey",
    href: PUBLIC_SITE.social.soundcloud,
  },
  {
    label: "YouTube",
    handle: "@rajjondey",
    href: PUBLIC_SITE.social.youtube,
  },
  {
    label: "Instagram",
    handle: "@rajjon.dey",
    href: PUBLIC_SITE.social.instagram,
  },
];

export default function PublicHomePage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Brand />
        <Link
          href="/login"
          className="text-sm text-secondary transition hover:text-primary"
        >
          Music OS <span aria-hidden>&rarr;</span>
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        {/* Hero ---------------------------------------------------------- */}
        <section className="pt-12 sm:pt-20">
          <SectionLabel>Rajon Dey · guitar &amp; vocals</SectionLabel>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tightish text-primary sm:text-7xl">
            Feel the
            <br />
            Sound
          </h1>
          <p className="mt-7 max-w-prose text-lg leading-relaxed text-secondary">
            Software engineer by day, learning guitar and voice by morning. I make
            music for the joy of it — not for metrics, not for an audience, not for
            pressure. Just a slow, honest practice.
          </p>
          <p className="mt-4 max-w-prose italic leading-relaxed text-muted">
            &ldquo;Every masterpiece begins with a single note.&rdquo;
          </p>
        </section>

        {/* Currently learning ------------------------------------------- */}
        <section className="mt-16" aria-labelledby="learning-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="learning-heading" className="font-display text-xl text-primary">
              Currently learning
            </h2>
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              this season
            </span>
          </div>
          <Card variant="accent" className="mt-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl text-primary">
                  Knockin&apos; on Heaven&apos;s Door
                </p>
                <p className="mt-1 text-sm text-secondary">Bob Dylan</p>
              </div>
              <Badge className="bg-stage-learning/15 text-stage-learning">
                Learning
              </Badge>
            </div>
            <p className="mt-4 max-w-prose leading-relaxed text-secondary">
              Working the chord changes and a softer vocal on the chorus. Taking it
              slow — the kind of song you grow into.
            </p>
          </Card>
        </section>

        {/* Listen -------------------------------------------------------- */}
        <section className="mt-16" aria-labelledby="listen-heading">
          <h2 id="listen-heading" className="font-display text-xl text-primary">
            Listen
          </h2>
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {listen.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-4 transition"
                >
                  <span className="font-display text-lg text-primary transition group-hover:text-accent">
                    {item.label}
                  </span>
                  <span className="flex items-center gap-3 text-sm text-muted">
                    {item.handle}
                    <span
                      aria-hidden
                      className="transition group-hover:translate-x-0.5 group-hover:text-accent"
                    >
                      &rarr;
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Latest -------------------------------------------------------- */}
        <section className="mt-16" aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="font-display text-xl text-primary">
            Latest share
          </h2>
          <p className="mt-4 max-w-prose leading-relaxed text-muted">
            Nothing posted just yet — the first recordings are still finding their
            feet. When something feels worth sharing, it lands here.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Brand subtle />
          <div className="flex items-center gap-5 text-sm text-muted">
            <span>Feel the Sound</span>
            <Link href="/login" className="transition hover:text-primary">
              Music OS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

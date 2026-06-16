import Link from "next/link";
import { Card } from "@music/ui";

export default function PublicHomePage() {
  return (
    <main className="mx-auto min-h-dvh max-w-lg px-6 py-16">
      <header className="pt-8">
        <p className="text-sm text-muted">Rajon Dey</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-primary">
          Feel the Sound
        </h1>
        <p className="mt-4 text-secondary leading-relaxed">
          Software engineer by day, learner on guitar and vocals by morning. Music for joy —
          not for metrics, not for pressure.
        </p>
      </header>

      <section className="mt-10 space-y-4" aria-labelledby="learning-heading">
        <h2 id="learning-heading" className="font-display text-lg text-primary">
          Currently learning
        </h2>
        <Card>
          <p className="font-display text-xl text-primary">Knockin&apos; on Heaven&apos;s Door</p>
          <p className="mt-1 text-sm text-secondary">Bob Dylan</p>
          <p className="mt-3 text-sm text-muted">Chord changes and a softer vocal on the chorus.</p>
        </Card>
      </section>

      <section className="mt-10" aria-labelledby="listen-heading">
        <h2 id="listen-heading" className="font-display text-lg text-primary">
          Listen
        </h2>
        <ul className="mt-4 space-y-2">
          <li>
            <span className="text-sm text-muted">SoundCloud — coming soon</span>
          </li>
          <li>
            <span className="text-sm text-muted">YouTube — coming soon</span>
          </li>
        </ul>
      </section>

      <Link
        href="/login"
        className="mt-12 inline-flex min-h-11 w-fit items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-base transition hover:brightness-110"
      >
        Open Music OS
      </Link>
    </main>
  );
}

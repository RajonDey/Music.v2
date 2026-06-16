import { Badge, Card } from "@music/ui";

type Entry = {
  day: string;
  date: string;
  song: string;
  quality: string;
  note: string;
};

const entries: Entry[] = [
  {
    day: "Fri",
    date: "Jun 13",
    song: "Knockin' on Heaven's Door",
    quality: "good flow",
    note: "Chorus finally felt loose — stopped gripping the neck.",
  },
  {
    day: "Wed",
    date: "Jun 11",
    song: "Knockin' on Heaven's Door",
    quality: "solid",
    note: "Slow practice on the G–D change. Less rushed.",
  },
  {
    day: "Mon",
    date: "Jun 9",
    song: "Freestyle",
    quality: "okay",
    note: "Just noodled and warmed up the voice. Low-key day.",
  },
];

export function SessionDiaryList() {
  return (
    <Card>
      <h2 className="font-display text-xl text-primary">This week&apos;s sessions</h2>
      <p className="mt-1 text-sm text-muted">A plain diary — no graphs, no trends.</p>

      <ul className="mt-5 divide-y divide-border">
        {entries.map((entry, i) => (
          <li key={i} className="flex gap-4 py-4">
            <div className="w-12 shrink-0 text-center">
              <p className="text-xs uppercase tracking-wide text-muted">{entry.day}</p>
              <p className="font-display text-sm text-secondary">{entry.date}</p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-display text-primary">{entry.song}</p>
                <Badge className="bg-accent-soft text-accent">{entry.quality}</Badge>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-secondary">{entry.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

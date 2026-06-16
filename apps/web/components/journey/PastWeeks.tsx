import { Card } from "@music/ui";

type Week = {
  label: string;
  focus: string;
  win: string;
  feel: string;
};

const weeks: Week[] = [
  {
    label: "Jun 2 – Jun 8",
    focus: "Knockin' on Heaven's Door — verse timing",
    win: "Played the verse start to finish without stopping.",
    feel: "Steadier. Starting to enjoy the slow parts.",
  },
  {
    label: "May 26 – Jun 1",
    focus: "Open chords + humming the melody",
    win: "Stopped apologising for how it sounded.",
    feel: "Nervous but curious.",
  },
];

export function PastWeeks() {
  return (
    <div>
      <h2 className="mb-3 px-1 font-display text-xl text-primary">Past weeks</h2>
      <div className="space-y-3">
        {weeks.map((week) => (
          <Card key={week.label} interactive className="p-0">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="font-display text-primary">{week.label}</p>
                  <p className="mt-0.5 text-sm text-muted">{week.focus}</p>
                </div>
                <span
                  aria-hidden
                  className="text-muted transition group-open:rotate-180"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5"
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-3 border-t border-border px-5 pb-5 pt-4 sm:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">
                    One win
                  </p>
                  <p className="mt-1 leading-relaxed text-secondary">{week.win}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">
                    Overall feel
                  </p>
                  <p className="mt-1 leading-relaxed text-secondary">{week.feel}</p>
                </div>
              </div>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
}

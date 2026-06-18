import { Button, Card, FieldLabel, TextArea } from "@music/ui";
import { QUALITY_LABELS, type Session, type Song } from "@music/types";
import type { RecentSkill, SkillGroup } from "@/lib/practice";
import { discardSession, logSession } from "@/app/(private)/studio/actions";

function SkillTagger({
  recentSkills,
  skillGroups,
}: {
  recentSkills: RecentSkill[];
  skillGroups: SkillGroup[];
}) {
  const recentIds = new Set(recentSkills.map((s) => s.id));

  return (
    <div className="space-y-3">
      {recentSkills.length > 0 ? (
        <div>
          <p className="mb-2 text-xs text-muted">Recent — tap what you touched today</p>
          <div className="flex flex-wrap gap-2">
            {recentSkills.map((skill) => (
              <label key={skill.id} className="cursor-pointer">
                <input type="checkbox" name="skills" value={skill.id} className="peer sr-only" />
                <span className="inline-block rounded-full border border-border bg-elevated px-3.5 py-1.5 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                  {skill.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <details className="rounded-lg border border-border bg-elevated">
        <summary className="cursor-pointer list-none px-3.5 py-2.5 text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
          Browse all skills
        </summary>
        <div className="space-y-1.5 border-t border-border px-3.5 py-3">
          {skillGroups.map((group) => (
            <details key={group.category} className="rounded-lg border border-border bg-card">
              <summary className="cursor-pointer list-none px-3 py-2 text-xs text-secondary [&::-webkit-details-marker]:hidden">
                {group.category}
                <span className="text-muted"> · {group.skills.length}</span>
              </summary>
              <div className="flex flex-wrap gap-2 border-t border-border px-3 py-2">
                {group.skills
                  .filter((skill) => !recentIds.has(skill.id))
                  .map((skill) => (
                    <label key={skill.id} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill.id}
                        className="peer sr-only"
                      />
                      <span className="inline-block rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                        {skill.name}
                      </span>
                    </label>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </details>
    </div>
  );
}

export function ReflectionBlock({
  session,
  songs,
  skillGroups,
  recentSkills,
}: {
  session: Session;
  songs: Song[];
  skillGroups: SkillGroup[];
  recentSkills: RecentSkill[];
}) {
  return (
    <Card>
      <h2 className="font-display text-xl text-primary">After practice</h2>
      <p className="mt-1 text-sm text-muted">What shifted today?</p>

      <form action={logSession.bind(null, session.id)} className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="reflection-worked">
            What did you actually work on?
          </FieldLabel>
          <TextArea
            id="reflection-worked"
            name="what_worked_on"
            rows={3}
            placeholder="Ran the verse twice, tried a softer strum…"
          />
        </div>

        <div>
          <FieldLabel htmlFor="reflection-better">
            What&apos;s one thing that felt better?
          </FieldLabel>
          <TextArea
            id="reflection-better"
            name="what_felt_better"
            rows={2}
            placeholder="The G chord change felt less rushed."
          />
        </div>

        <div>
          <FieldLabel htmlFor="reflection-stuck" hint="optional">
            Did anything feel stuck?
          </FieldLabel>
          <TextArea
            id="reflection-stuck"
            name="what_felt_stuck"
            rows={2}
            placeholder="Skip if nothing comes to mind."
          />
        </div>

        {songs.length > 0 ? (
          <div>
            <FieldLabel>Which songs did you touch?</FieldLabel>
            <p className="mb-2 text-xs text-muted">
              Tag them here so each song&apos;s Practice log fills automatically.
            </p>
            <div className="flex flex-wrap gap-2">
              {songs.map((song) => (
                <label key={song.id} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="songs"
                    value={song.id}
                    defaultChecked={song.id === session.song_id}
                    className="peer sr-only"
                  />
                  <span className="inline-block rounded-full border border-border bg-elevated px-3.5 py-1.5 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary">
                    {song.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {skillGroups.length > 0 ? (
          <div>
            <FieldLabel>Anything you practised? (optional)</FieldLabel>
            <SkillTagger recentSkills={recentSkills} skillGroups={skillGroups} />
          </div>
        ) : null}

        <div>
          <FieldLabel>How did the session feel?</FieldLabel>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Session quality">
            {QUALITY_LABELS.map((label, index) => (
              <label key={label} className="cursor-pointer">
                <input
                  type="radio"
                  name="quality_rating"
                  value={index + 1}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary peer-checked:shadow-sm">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">Log session</Button>
          <button
            type="submit"
            formAction={discardSession.bind(null, session.id)}
            className="text-xs text-muted underline-offset-4 transition hover:text-secondary hover:underline"
          >
            Discard this session
          </button>
        </div>
      </form>
    </Card>
  );
}

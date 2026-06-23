import { Button, FieldLabel, TextArea } from "@music/ui";
import { QUALITY_LABELS, type Session, type Song } from "@music/types";
import type { RecentSkill, SkillGroup } from "@/lib/practice";
import { SkillTagger } from "@/components/session/SkillTagger";

type SessionReflectionFormProps = {
  sessionId: string;
  action: (sessionId: string, formData: FormData) => Promise<void>;
  session: Session;
  songs: Song[];
  skillGroups: SkillGroup[];
  recentSkills: RecentSkill[];
  songIds: string[];
  skillIds: string[];
  submitLabel: string;
  /** Hides song/skill chrome when the session anchor already covers them. */
  compact?: boolean;
};

export function SessionReflectionForm({
  sessionId,
  action,
  session,
  songs,
  skillGroups,
  recentSkills,
  songIds,
  skillIds,
  submitLabel,
  compact = false,
}: SessionReflectionFormProps) {
  const selectedSongs = new Set(
    songIds.length > 0 ? songIds : session.song_id ? [session.song_id] : [],
  );
  const singleAnchorSong =
    compact && selectedSongs.size === 1 ? [...selectedSongs][0] : null;
  const anchorSkillPreselected =
    compact && skillIds.length === 1 ? skillIds[0] : null;

  return (
    <form action={action.bind(null, sessionId)} className="space-y-5">
      <div>
        <FieldLabel htmlFor="reflection-worked">What did you actually work on?</FieldLabel>
        <TextArea
          id="reflection-worked"
          name="what_worked_on"
          rows={3}
          defaultValue={session.what_worked_on ?? ""}
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
          defaultValue={session.what_felt_better ?? ""}
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
          defaultValue={session.what_felt_stuck ?? ""}
          placeholder="Skip if nothing comes to mind."
        />
      </div>

      {singleAnchorSong ? (
        <input type="hidden" name="songs" value={singleAnchorSong} />
      ) : songs.length > 0 ? (
        <div>
          <FieldLabel hint="optional">Any other songs?</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {songs.map((song) => (
              <label key={song.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="songs"
                  value={song.id}
                  defaultChecked={selectedSongs.has(song.id)}
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

      {anchorSkillPreselected ? (
        <input type="hidden" name="skills" value={anchorSkillPreselected} />
      ) : skillGroups.length > 0 ? (
        <div>
          <FieldLabel hint="optional">Anything else you practised?</FieldLabel>
          <SkillTagger
            recentSkills={recentSkills}
            skillGroups={skillGroups}
            defaultSkillIds={skillIds}
            maxRecent={compact ? 6 : 8}
          />
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
                defaultChecked={session.quality_rating === index + 1}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary peer-checked:shadow-sm">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

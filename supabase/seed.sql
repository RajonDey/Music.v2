insert into public.songs (name, artist, stage, comfort_level, learning_stage, why_this_song, notes)
select
  'Knockin'' on Heaven''s Door',
  'Bob Dylan',
  'learning',
  'getting_there',
  'singing_added',
  'Current practice song — chords and vocal feel.',
  'Bridge chord change still needs work.'
where not exists (
  select 1 from public.songs where name = 'Knockin'' on Heaven''s Door' and artist = 'Bob Dylan'
);

-- ---------------------------------------------------------------------------
-- Skills catalogue (Phase 5 / Music OS v2). 11 categories, mapped to 6 radar axes.
-- tier: milestone (binary) / progress (1-5) / evergreen (moments log).
-- Re-runnable: unique (category, name) guards against duplicates.
-- skill_states rows are created automatically by the skills_create_state trigger.
-- ---------------------------------------------------------------------------
insert into public.skills (domain, category, name, tier, radar_axis, position)
select 'guitar', v.category, v.name, v.tier, v.radar_axis, row_number() over ()
from (values
  -- 1. Rhythm & Timing -> Rhythm
  ('Rhythm & Timing', 'Strumming with a steady pulse', 'milestone', 'Rhythm'),
  ('Rhythm & Timing', 'Down-up strumming patterns', 'milestone', 'Rhythm'),
  ('Rhythm & Timing', 'Syncopated strumming', 'progress', 'Rhythm'),
  ('Rhythm & Timing', 'Palm muting', 'milestone', 'Rhythm'),
  ('Rhythm & Timing', 'Playing with a metronome', 'milestone', 'Rhythm'),
  ('Rhythm & Timing', 'Internalising time signatures (4/4, 3/4, 6/8, 12/8)', 'progress', 'Rhythm'),
  ('Rhythm & Timing', 'Accenting off-beats', 'progress', 'Rhythm'),
  ('Rhythm & Timing', 'Subdividing beats', 'progress', 'Rhythm'),
  ('Rhythm & Timing', 'Playing in a band/ensemble context', 'evergreen', 'Rhythm'),
  ('Rhythm & Timing', 'Recognising tempo changes', 'progress', 'Rhythm'),
  -- 2. Chords -> Chords
  ('Chords', 'Open chords', 'milestone', 'Chords'),
  ('Chords', 'Power chords (two-note and three-note)', 'milestone', 'Chords'),
  ('Chords', 'Barre chords (major, minor, dominant 7)', 'progress', 'Chords'),
  ('Chords', 'Triads (major, minor, diminished, augmented) on all string sets', 'progress', 'Chords'),
  ('Chords', 'Seventh chords (maj7, m7, dom7, m7b5)', 'progress', 'Chords'),
  ('Chords', 'Extended chords (9th, 11th, 13th)', 'progress', 'Chords'),
  ('Chords', 'Chord inversions', 'progress', 'Chords'),
  ('Chords', 'Shell voicings', 'progress', 'Chords'),
  ('Chords', 'Slash chords', 'milestone', 'Chords'),
  ('Chords', 'Quartal harmony', 'progress', 'Chords'),
  ('Chords', 'Chord substitution', 'progress', 'Chords'),
  ('Chords', 'Moving smoothly between chord shapes', 'progress', 'Chords'),
  -- 3. Fretboard Knowledge -> Theory
  ('Fretboard Knowledge', 'Notes on all strings up to 12th fret', 'progress', 'Theory'),
  ('Fretboard Knowledge', 'Octave shapes', 'milestone', 'Theory'),
  ('Fretboard Knowledge', 'Intervals on the fretboard', 'progress', 'Theory'),
  ('Fretboard Knowledge', 'Identifying root notes', 'milestone', 'Theory'),
  ('Fretboard Knowledge', 'CAGED system', 'progress', 'Theory'),
  ('Fretboard Knowledge', 'Scale patterns across the neck', 'progress', 'Theory'),
  ('Fretboard Knowledge', 'Chord tone locations', 'progress', 'Theory'),
  ('Fretboard Knowledge', 'Memorising fretboard by intervals, not just note names', 'progress', 'Theory'),
  -- 4. Scales & Modes -> Theory
  ('Scales & Modes', 'Major scale (all positions)', 'progress', 'Theory'),
  ('Scales & Modes', 'Natural minor scale', 'progress', 'Theory'),
  ('Scales & Modes', 'Pentatonic major & minor', 'milestone', 'Theory'),
  ('Scales & Modes', 'Blues scale', 'milestone', 'Theory'),
  ('Scales & Modes', 'Modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian)', 'progress', 'Theory'),
  ('Scales & Modes', 'Harmonic minor', 'progress', 'Theory'),
  ('Scales & Modes', 'Melodic minor', 'progress', 'Theory'),
  ('Scales & Modes', 'Whole-tone scale', 'progress', 'Theory'),
  ('Scales & Modes', 'Diminished scale', 'progress', 'Theory'),
  ('Scales & Modes', 'Symmetrical scales', 'progress', 'Theory'),
  ('Scales & Modes', 'Sequencing scales (thirds, fourths, etc.)', 'progress', 'Theory'),
  -- 5. Lead Techniques -> Lead
  ('Lead Techniques', 'Alternate picking', 'progress', 'Lead'),
  ('Lead Techniques', 'Economy picking', 'progress', 'Lead'),
  ('Lead Techniques', 'Sweep picking', 'progress', 'Lead'),
  ('Lead Techniques', 'String skipping', 'progress', 'Lead'),
  ('Lead Techniques', 'Legato (hammer-ons, pull-offs)', 'progress', 'Lead'),
  ('Lead Techniques', 'Bends (half, full, pre-bend, unison)', 'progress', 'Lead'),
  ('Lead Techniques', 'Vibrato (wrist, finger)', 'progress', 'Lead'),
  ('Lead Techniques', 'Slides (legato, shift, glissando)', 'milestone', 'Lead'),
  ('Lead Techniques', 'Tapping (one-hand, two-hand)', 'progress', 'Lead'),
  ('Lead Techniques', 'Harmonics (natural, artificial, pinch)', 'progress', 'Lead'),
  ('Lead Techniques', 'Whammy bar techniques', 'progress', 'Lead'),
  ('Lead Techniques', 'Controlled feedback', 'evergreen', 'Lead'),
  -- 6. Improvisation -> Lead
  ('Improvisation', 'Playing over chord changes', 'progress', 'Lead'),
  ('Improvisation', 'Target notes (chord tones)', 'progress', 'Lead'),
  ('Improvisation', 'Phrasing (call & response, motifs)', 'evergreen', 'Lead'),
  ('Improvisation', 'Using space & rests', 'evergreen', 'Lead'),
  ('Improvisation', 'Melodic development', 'evergreen', 'Lead'),
  ('Improvisation', 'Trading fours/eights', 'evergreen', 'Lead'),
  ('Improvisation', 'Soloing over modulations', 'progress', 'Lead'),
  ('Improvisation', 'Playing outside the key', 'progress', 'Lead'),
  ('Improvisation', 'Using dynamics', 'evergreen', 'Lead'),
  ('Improvisation', 'Developing a personal melodic vocabulary', 'evergreen', 'Lead'),
  -- 7. Music Theory -> Theory (ear training mapped to Ear axis)
  ('Music Theory', 'Interval recognition', 'progress', 'Theory'),
  ('Music Theory', 'Major & minor scale construction', 'milestone', 'Theory'),
  ('Music Theory', 'Chord construction (triads, 7ths, extensions)', 'progress', 'Theory'),
  ('Music Theory', 'Diatonic harmony (chords in a key)', 'progress', 'Theory'),
  ('Music Theory', 'Roman numeral analysis', 'progress', 'Theory'),
  ('Music Theory', 'Circle of fifths', 'milestone', 'Theory'),
  ('Music Theory', 'Transposition', 'progress', 'Theory'),
  ('Music Theory', 'Modes as derived from major scale', 'progress', 'Theory'),
  ('Music Theory', 'Key signatures', 'milestone', 'Theory'),
  ('Music Theory', 'Basic form & structure (verse-chorus, AABA, 12-bar blues)', 'milestone', 'Theory'),
  ('Music Theory', 'Counterpoint basics', 'progress', 'Theory'),
  ('Music Theory', 'Ear training (intervals, chords, progressions)', 'evergreen', 'Ear'),
  -- 8. Reading & Notation -> Theory
  ('Reading & Notation', 'Standard notation (treble clef)', 'progress', 'Theory'),
  ('Reading & Notation', 'Tablature', 'milestone', 'Theory'),
  ('Reading & Notation', 'Chord charts', 'milestone', 'Theory'),
  ('Reading & Notation', 'Rhythm slashes', 'milestone', 'Theory'),
  ('Reading & Notation', 'Sight-reading', 'evergreen', 'Theory'),
  ('Reading & Notation', 'Lead sheets', 'progress', 'Theory'),
  ('Reading & Notation', 'Nashville Number System', 'progress', 'Theory'),
  ('Reading & Notation', 'Writing out own arrangements', 'evergreen', 'Theory'),
  -- 9. Repertoire & Performance -> Performance
  ('Repertoire & Performance', 'Memorising songs', 'evergreen', 'Performance'),
  ('Repertoire & Performance', 'Performing with singing', 'progress', 'Performance'),
  ('Repertoire & Performance', 'Playing with a backing track', 'milestone', 'Performance'),
  ('Repertoire & Performance', 'Stage presence', 'evergreen', 'Performance'),
  ('Repertoire & Performance', 'Playing in different genres (rock, blues, jazz, folk, classical, etc.)', 'evergreen', 'Performance'),
  ('Repertoire & Performance', 'Comping behind a soloist', 'progress', 'Performance'),
  ('Repertoire & Performance', 'Playing in a group (eye contact, dynamics)', 'evergreen', 'Performance'),
  ('Repertoire & Performance', 'Session-style: quick arrangement', 'progress', 'Performance'),
  ('Repertoire & Performance', 'Building a set list', 'milestone', 'Performance'),
  -- 10. Technical & Physical -> Performance
  ('Technical & Physical', 'Proper posture (sitting & standing)', 'milestone', 'Performance'),
  ('Technical & Physical', 'Left-hand finger independence', 'progress', 'Performance'),
  ('Technical & Physical', 'Right-hand fingerstyle (classical, clawhammer, etc.)', 'progress', 'Performance'),
  ('Technical & Physical', 'Hybrid picking', 'progress', 'Performance'),
  ('Technical & Physical', 'Using a pick with precision', 'progress', 'Performance'),
  ('Technical & Physical', 'Stretching & hand care', 'milestone', 'Performance'),
  ('Technical & Physical', 'Speed development (controlled)', 'progress', 'Performance'),
  ('Technical & Physical', 'Clean vs. distorted playing', 'milestone', 'Performance'),
  ('Technical & Physical', 'Amplifier & pedal knowledge (for electric)', 'progress', 'Performance'),
  -- 11. Ear & Creativity -> Ear
  ('Ear & Creativity', 'Learning songs by ear', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Recognising intervals by ear', 'progress', 'Ear'),
  ('Ear & Creativity', 'Transcribing solos', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Identifying chord progressions by ear', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Writing original riffs', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Composing chord progressions', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Lyric writing (if applicable)', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Arranging for solo guitar', 'evergreen', 'Ear'),
  ('Ear & Creativity', 'Producing/recording basics', 'progress', 'Ear')
) as v(category, name, tier, radar_axis)
on conflict (domain, category, name) do nothing;

-- ---------------------------------------------------------------------------
-- Vocal skills catalogue (Phase 8). 12 categories, 83 skills.
-- Warm-up ritual lives on /vocal — not duplicated here.
-- ---------------------------------------------------------------------------
insert into public.skills (domain, category, name, tier, radar_axis, position)
select 'vocal', v.category, v.name, v.tier, v.radar_axis, row_number() over ()
from (values
  -- Breath & Support -> Breath
  ('Breath & Support', 'Diaphragmatic (low) breathing', 'milestone', 'Breath'),
  ('Breath & Support', 'Breath control / management', 'progress', 'Breath'),
  ('Breath & Support', 'Sustained airflow on long phrases', 'progress', 'Breath'),
  ('Breath & Support', 'Breath support without tension', 'progress', 'Breath'),
  ('Breath & Support', 'Staggered breathing (ensemble / long phrases)', 'progress', 'Breath'),
  ('Breath & Support', 'Fast / silent catch breaths', 'progress', 'Breath'),
  ('Breath & Support', 'Appoggio technique', 'milestone', 'Breath'),
  -- Registers & Range -> Range
  ('Registers & Range', 'Chest voice', 'milestone', 'Range'),
  ('Registers & Range', 'Head voice', 'milestone', 'Range'),
  ('Registers & Range', 'Mixed voice (blending chest / head)', 'progress', 'Range'),
  ('Registers & Range', 'Falsetto', 'progress', 'Range'),
  ('Registers & Range', 'Vocal fry (M0)', 'progress', 'Range'),
  ('Registers & Range', 'Whistle register', 'progress', 'Range'),
  ('Registers & Range', 'Navigating the passaggio', 'progress', 'Range'),
  ('Registers & Range', 'Extending range (top & bottom)', 'progress', 'Range'),
  -- Pitch & Ear Training -> Pitch
  ('Pitch & Ear Training', 'Singing in tune unaccompanied', 'progress', 'Pitch'),
  ('Pitch & Ear Training', 'Matching pitch with an instrument', 'milestone', 'Pitch'),
  ('Pitch & Ear Training', 'Interval recognition by ear', 'progress', 'Pitch'),
  ('Pitch & Ear Training', 'Recognizing chord tones while singing', 'progress', 'Pitch'),
  ('Pitch & Ear Training', 'Hearing harmony intervals by ear', 'progress', 'Pitch'),
  ('Pitch & Ear Training', 'Self-correcting pitch mid-note', 'progress', 'Pitch'),
  -- Tone & Resonance -> Tone
  ('Tone & Resonance', 'Forward placement (''mask'' resonance)', 'progress', 'Tone'),
  ('Tone & Resonance', 'Open throat / relaxed larynx', 'progress', 'Tone'),
  ('Tone & Resonance', 'Vowel modification on high notes', 'progress', 'Tone'),
  ('Tone & Resonance', 'Nasal vs. oral resonance balance', 'progress', 'Tone'),
  ('Tone & Resonance', 'Singer''s formant ("ring")', 'progress', 'Tone'),
  ('Tone & Resonance', 'Warm vs. bright tone control', 'progress', 'Tone'),
  ('Tone & Resonance', 'Vibrato (natural, controlled)', 'progress', 'Tone'),
  ('Tone & Resonance', 'Straight tone', 'progress', 'Tone'),
  -- Vocal Techniques -> Technique
  ('Vocal Techniques', 'Belting (safe)', 'progress', 'Technique'),
  ('Vocal Techniques', 'Twang', 'progress', 'Technique'),
  ('Vocal Techniques', 'Vocal runs / riffs / melisma', 'progress', 'Technique'),
  ('Vocal Techniques', 'Growl / rasp / distortion (safe use)', 'progress', 'Technique'),
  ('Vocal Techniques', 'Falsetto flips / yodels', 'progress', 'Technique'),
  ('Vocal Techniques', 'Trills', 'progress', 'Technique'),
  ('Vocal Techniques', 'Onsets (glottal, breathy, clean)', 'progress', 'Technique'),
  ('Vocal Techniques', 'Offsets / releases', 'progress', 'Technique'),
  ('Vocal Techniques', 'Dynamics / messa di voce', 'progress', 'Technique'),
  ('Vocal Techniques', 'Staccato vs. legato phrasing', 'progress', 'Technique'),
  -- Diction & Lyrics -> Technique
  ('Diction & Lyrics', 'Vowel purity', 'progress', 'Technique'),
  ('Diction & Lyrics', 'Consonant articulation / clarity', 'progress', 'Technique'),
  ('Diction & Lyrics', 'IPA basics for singers', 'milestone', 'Technique'),
  ('Diction & Lyrics', 'Diphthong handling', 'progress', 'Technique'),
  ('Diction & Lyrics', 'Language-specific diction', 'evergreen', 'Technique'),
  ('Diction & Lyrics', 'Phrasing for meaning / storytelling', 'evergreen', 'Technique'),
  -- Style & Genre -> Expression
  ('Style & Genre', 'Pop vocal styling', 'evergreen', 'Expression'),
  ('Style & Genre', 'Rock / belt-driven styling', 'evergreen', 'Expression'),
  ('Style & Genre', 'R&B / soul riffing & runs', 'progress', 'Expression'),
  ('Style & Genre', 'Jazz phrasing & scatting', 'evergreen', 'Expression'),
  ('Style & Genre', 'Classical / legit technique', 'progress', 'Expression'),
  ('Style & Genre', 'Musical theater legit vs. belt', 'evergreen', 'Expression'),
  ('Style & Genre', 'Folk / acoustic intimacy', 'evergreen', 'Expression'),
  ('Style & Genre', 'Genre-appropriate ornamentation', 'progress', 'Expression'),
  -- Harmony & Ensemble -> Expression
  ('Harmony & Ensemble', 'Singing harmony parts', 'progress', 'Expression'),
  ('Harmony & Ensemble', 'Blending with other voices', 'progress', 'Expression'),
  ('Harmony & Ensemble', 'Call and response', 'evergreen', 'Expression'),
  ('Harmony & Ensemble', 'Tuning to match a group', 'progress', 'Expression'),
  ('Harmony & Ensemble', 'Layering recorded harmonies', 'evergreen', 'Expression'),
  -- Performance & Stage Presence -> Expression
  ('Performance & Stage Presence', 'Live mic technique (distance & angle)', 'progress', 'Expression'),
  ('Performance & Stage Presence', 'Stage movement / presence', 'evergreen', 'Expression'),
  ('Performance & Stage Presence', 'Eye contact / audience connection', 'evergreen', 'Expression'),
  ('Performance & Stage Presence', 'Performing with a backing track', 'milestone', 'Expression'),
  ('Performance & Stage Presence', 'Handling nerves / performance anxiety', 'evergreen', 'Expression'),
  ('Performance & Stage Presence', 'Emotional connection / interpretation', 'evergreen', 'Expression'),
  ('Performance & Stage Presence', 'Memorizing lyrics', 'evergreen', 'Expression'),
  ('Performance & Stage Presence', 'Adapting energy to venue size', 'evergreen', 'Expression'),
  -- Vocal Health & Physical -> Breath
  ('Vocal Health & Physical', 'Cool-down routines', 'milestone', 'Breath'),
  ('Vocal Health & Physical', 'Posture for singing', 'milestone', 'Breath'),
  ('Vocal Health & Physical', 'Hydration & vocal care', 'milestone', 'Breath'),
  ('Vocal Health & Physical', 'Recognizing strain vs. healthy effort', 'progress', 'Breath'),
  ('Vocal Health & Physical', 'Vocal rest practices', 'milestone', 'Breath'),
  ('Vocal Health & Physical', 'SOVT exercises (straw, lip trills)', 'milestone', 'Breath'),
  ('Vocal Health & Physical', 'Avoiding fatigue on heavy-use days', 'evergreen', 'Breath'),
  -- Reading & Notation -> Technique
  ('Reading & Notation', 'Reading vocal sheet music (treble clef)', 'progress', 'Technique'),
  ('Reading & Notation', 'Lead sheets / lyrics with chords', 'milestone', 'Technique'),
  ('Reading & Notation', 'Following a click track', 'progress', 'Technique'),
  ('Reading & Notation', 'Sight-singing', 'progress', 'Technique'),
  ('Reading & Notation', 'Rhythm reading', 'progress', 'Technique'),
  -- Recording & Mic Craft -> Technique
  ('Recording & Mic Craft', 'Studio mic technique', 'progress', 'Technique'),
  ('Recording & Mic Craft', 'Comping vocal takes', 'evergreen', 'Technique'),
  ('Recording & Mic Craft', 'Doubling / harmony stacking', 'evergreen', 'Technique'),
  ('Recording & Mic Craft', 'Riding dynamics for the mic', 'progress', 'Technique'),
  ('Recording & Mic Craft', 'Basic vocal editing awareness', 'milestone', 'Technique')
) as v(category, name, tier, radar_axis)
on conflict (domain, category, name) do nothing;

-- ---------------------------------------------------------------------------
-- Default vocal warm-up routine (pitch accuracy + confidence focus).
-- ---------------------------------------------------------------------------
insert into public.vocal_warmups (position, name, duration_seconds)
select v.position, v.name, v.duration_seconds
from (values
  (1, 'Lip trills', 120),
  (2, 'Humming (gentle sirens)', 120),
  (3, 'Scales on "ma"', 180),
  (4, 'Full song passage', 180)
) as v(position, name, duration_seconds)
where not exists (select 1 from public.vocal_warmups);

insert into public.songs (name, artist, stage, comfort_level, why_this_song, notes)
select
  'Knockin'' on Heaven''s Door',
  'Bob Dylan',
  'learning',
  'getting_there',
  'Current practice song — chords and vocal feel.',
  'Bridge chord change still needs work.'
where not exists (
  select 1 from public.songs where name = 'Knockin'' on Heaven''s Door' and artist = 'Bob Dylan'
);

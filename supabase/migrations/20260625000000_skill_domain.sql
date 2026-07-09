-- Vocal Skills Lab: domain discriminator on skills + snapshots.
-- Guitar rows default domain='guitar'; vocal catalogue seeded separately.

alter table public.skills
  add column if not exists domain text not null default 'guitar'
    check (domain in ('guitar', 'vocal'));

alter table public.skills drop constraint if exists skills_category_name_key;
alter table public.skills drop constraint if exists skills_radar_axis_check;

alter table public.skills add constraint skills_radar_axis_check check (
  radar_axis in (
    'Rhythm', 'Chords', 'Theory', 'Lead', 'Performance', 'Ear',
    'Breath', 'Range', 'Pitch', 'Tone', 'Technique', 'Expression'
  )
);

alter table public.skills
  add constraint skills_domain_category_name_key unique (domain, category, name);

create index if not exists skills_domain_category_idx
  on public.skills (domain, category, position);

-- Monthly snapshots: separate guitar vs vocal radar overlays (vocal wired later).
alter table public.skill_snapshots
  add column if not exists domain text not null default 'guitar'
    check (domain in ('guitar', 'vocal'));

alter table public.skill_snapshots drop constraint if exists skill_snapshots_month_label_axis_key;
alter table public.skill_snapshots drop constraint if exists skill_snapshots_axis_check;

alter table public.skill_snapshots add constraint skill_snapshots_axis_check check (
  axis in (
    'Rhythm', 'Chords', 'Theory', 'Lead', 'Performance', 'Ear',
    'Breath', 'Range', 'Pitch', 'Tone', 'Technique', 'Expression'
  )
);

alter table public.skill_snapshots
  add constraint skill_snapshots_month_label_axis_domain_key
  unique (month_label, axis, domain);

// One-off remote seeder: applies supabase/seed.sql data via the service-role API.
// Used because DDL/seed can't be run with only API keys; inserts (DML) can.
// Safe to re-run: skills upsert ignores duplicates; songs/warmups are guarded.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Plain node does not load .env.local — Next.js does. Check app dir, then repo root. */
function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key || process.env[key] !== undefined) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(resolve(scriptDir, "../.env.local"));
loadEnvFile(resolve(scriptDir, "../../../.env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const sql = readFileSync(new URL("../../../supabase/seed.sql", import.meta.url), "utf8");
const unq = (s) => s.replace(/''/g, "'");

function block(startMarker, endMarker) {
  const start = sql.indexOf(startMarker);
  const end = sql.indexOf(endMarker, start);
  return sql.slice(start + startMarker.length, end);
}

function parseSkills(startMarker, domain) {
  const skillsBlock = block(startMarker, ") as v(category, name, tier, radar_axis)");
  const skillRe =
    /\(\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'(\w+)'\s*,\s*'(\w+)'\s*\)/g;
  const skills = [];
  let m;
  while ((m = skillRe.exec(skillsBlock)) !== null) {
    skills.push({
      domain,
      category: unq(m[1]),
      name: unq(m[2]),
      tier: m[3],
      radar_axis: m[4],
      position: skills.length + 1,
    });
  }
  return skills;
}

// --- vocal warmups ---
const warmupBlock = block(
  "into public.vocal_warmups (position, name, duration_seconds)",
  ") as v(position, name, duration_seconds)",
);
const warmRe = /\(\s*(\d+)\s*,\s*'((?:[^']|'')*)'\s*,\s*(\d+)\s*\)/g;
const warmups = [];
let m;
while ((m = warmRe.exec(warmupBlock)) !== null) {
  warmups.push({
    position: Number(m[1]),
    name: unq(m[2]),
    duration_seconds: Number(m[3]),
  });
}

async function main() {
  // Dylan song (guarded)
  const dylan = await supabase
    .from("songs")
    .select("id")
    .eq("name", "Knockin' on Heaven's Door")
    .eq("artist", "Bob Dylan")
    .maybeSingle();
  if (!dylan.data) {
    const ins = await supabase.from("songs").insert({
      name: "Knockin' on Heaven's Door",
      artist: "Bob Dylan",
      stage: "learning",
      comfort_level: "getting_there",
      learning_stage: "singing_added",
      why_this_song: "Current practice song — chords and vocal feel.",
      notes: "Bridge chord change still needs work.",
    });
    if (ins.error) throw ins.error;
  }

  const guitarSkills = parseSkills("-- Skills catalogue (Phase 5", "guitar");
  const vocalSkills = parseSkills("-- Vocal skills catalogue (Phase 8)", "vocal");
  const skills = [...guitarSkills, ...vocalSkills];

  const sk = await supabase
    .from("skills")
    .upsert(skills, { onConflict: "domain,category,name", ignoreDuplicates: true });
  if (sk.error) throw sk.error;

  // Vocal warmups (only if empty)
  const existing = await supabase
    .from("vocal_warmups")
    .select("id", { count: "exact", head: true });
  if ((existing.count ?? 0) === 0 && warmups.length > 0) {
    const w = await supabase.from("vocal_warmups").insert(warmups);
    if (w.error) throw w.error;
  }

  const counts = {};
  for (const t of ["songs", "skills", "skill_states", "vocal_warmups"]) {
    const r = await supabase.from(t).select("id", { count: "exact", head: true });
    counts[t] = r.count ?? `err:${r.error?.message}`;
  }
  console.log("Parsed:", {
    guitarSkills: guitarSkills.length,
    vocalSkills: vocalSkills.length,
    warmups: warmups.length,
  });
  console.log("Remote counts:", counts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

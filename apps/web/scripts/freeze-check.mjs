/**
 * Pre-freeze verification: Supabase schema + optional local route smoke.
 *
 * Usage:
 *   node apps/web/scripts/freeze-check.mjs
 *   node apps/web/scripts/freeze-check.mjs --url http://localhost:3000
 *   node apps/web/scripts/freeze-check.mjs --url https://music.rajondey.com
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const scriptDir = dirname(fileURLToPath(import.meta.url));

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
loadEnvFile(resolve(scriptDir, "../../../.env"));

const urlArg = process.argv.find((a) => a.startsWith("--url="));
const baseUrl = (urlArg?.slice("--url=".length) ?? process.env.FREEZE_CHECK_URL ?? "").replace(
  /\/$/,
  "",
);

function authToken(password) {
  return createHash("sha256").update(`${password}:music-os-unlock`).digest("hex");
}

function pass(label, detail = "") {
  console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
  return true;
}

function fail(label, detail = "") {
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  return false;
}

async function checkSchema(supabase) {
  console.log("\n── Supabase schema ──");
  let ok = true;

  const tables = [
    "songs",
    "sessions",
    "skills",
    "skill_states",
    "skill_resources",
    "skill_moments",
    "skill_snapshots",
    "session_songs",
    "session_skills",
    "vocal_warmups",
    "monthly_reflections",
  ];

  for (const table of tables) {
    const res = await supabase.from(table).select("*", { count: "exact", head: true });
    if (res.error) {
      ok = fail(`table ${table}`, res.error.message) && ok;
    } else {
      pass(`table ${table}`, `${res.count ?? 0} rows`);
    }
  }

  const sessionCols = await supabase
    .from("sessions")
    .select("practice_kind, riyaz_feel, anchor_type, anchor_skill_id, song_focus")
    .limit(1);
  if (sessionCols.error) {
    ok = fail("sessions Phase 7–9 columns", sessionCols.error.message) && ok;
  } else {
    pass("sessions Phase 7–9 columns", "practice_kind, riyaz_feel, anchors");
  }

  const skillDomain = await supabase.from("skills").select("domain").limit(1);
  if (skillDomain.error) {
    ok = fail("skills.domain column", skillDomain.error.message) && ok;
  } else {
    pass("skills.domain column");
  }

  const practiceNote = await supabase
    .from("skill_states")
    .select("practice_note")
    .limit(1);
  if (practiceNote.error) {
    ok = fail("skill_states.practice_note", practiceNote.error.message) && ok;
  } else {
    pass("skill_states.practice_note");
  }

  const snapshotDomain = await supabase
    .from("skill_snapshots")
    .select("domain")
    .limit(1);
  if (snapshotDomain.error) {
    ok = fail("skill_snapshots.domain", snapshotDomain.error.message) && ok;
  } else {
    pass("skill_snapshots.domain");
  }

  const guitarCount = await supabase
    .from("skills")
    .select("id", { count: "exact", head: true })
    .eq("domain", "guitar");
  const vocalCount = await supabase
    .from("skills")
    .select("id", { count: "exact", head: true })
    .eq("domain", "vocal");

  if (guitarCount.error) {
    ok = fail("guitar skills seed", guitarCount.error.message) && ok;
  } else if ((guitarCount.count ?? 0) < 50) {
    ok = fail("guitar skills seed", `expected ~110, got ${guitarCount.count}`) && ok;
  } else {
    pass("guitar skills seed", `${guitarCount.count} skills`);
  }

  if (vocalCount.error) {
    ok = fail("vocal skills seed", vocalCount.error.message) && ok;
  } else if ((vocalCount.count ?? 0) < 50) {
    ok = fail("vocal skills seed", `expected ~83, got ${vocalCount.count}`) && ok;
  } else {
    pass("vocal skills seed", `${vocalCount.count} skills`);
  }

  const warmups = await supabase
    .from("vocal_warmups")
    .select("id", { count: "exact", head: true });
  if (warmups.error) {
    ok = fail("vocal_warmups seed", warmups.error.message) && ok;
  } else if ((warmups.count ?? 0) === 0) {
    ok = fail("vocal_warmups seed", "no rows — run seed-remote.mjs") && ok;
  } else {
    pass("vocal_warmups seed", `${warmups.count} steps`);
  }

  return ok;
}

async function checkEnv() {
  console.log("\n── Environment ──");
  let ok = true;

  if (process.env.MUSIC_OS_PASSWORD) {
    pass("MUSIC_OS_PASSWORD");
  } else {
    ok = fail("MUSIC_OS_PASSWORD", "missing") && ok;
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    pass("Supabase credentials");
  } else {
    ok = fail("Supabase credentials", "missing URL or service role key") && ok;
  }

  if (process.env.ANTHROPIC_API_KEY) {
    pass("ANTHROPIC_API_KEY", "coach enabled");
  } else {
    console.log("  ⚠ ANTHROPIC_API_KEY — coach will return 503 (optional but recommended)");
  }

  return ok;
}

async function checkRoutes(base) {
  console.log(`\n── HTTP smoke (${base}) ──`);
  let ok = true;
  const password = process.env.MUSIC_OS_PASSWORD;

  const publicRoutes = ["/", "/login"];
  for (const path of publicRoutes) {
    const res = await fetch(`${base}${path}`, { redirect: "manual" });
    if (res.status === 200) {
      pass(`${path}`, String(res.status));
    } else {
      ok = fail(`${path}`, `expected 200, got ${res.status}`) && ok;
    }
  }

  const protectedPaths = ["/studio", "/songs", "/skills", "/report"];
  const unauth = await fetch(`${base}/studio`, { redirect: "manual" });
  if (unauth.status === 307 || unauth.status === 302) {
    pass("/studio without auth", `redirects (${unauth.status})`);
  } else {
    ok = fail("/studio without auth", `expected redirect, got ${unauth.status}`) && ok;
  }

  if (!password) {
    console.log("  ⚠ Skipping authenticated routes — no MUSIC_OS_PASSWORD");
    return ok;
  }

  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!loginRes.ok) {
    ok = fail("POST /api/auth/login", String(loginRes.status)) && ok;
    return ok;
  }
  pass("POST /api/auth/login");

  const setCookie = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader = setCookie.map((c) => c.split(";")[0]).join("; ");
  if (!cookieHeader) {
    ok = fail("auth cookie", "login succeeded but no Set-Cookie") && ok;
    return ok;
  }

  for (const path of protectedPaths) {
    const res = await fetch(`${base}${path}`, {
      headers: { Cookie: cookieHeader },
      redirect: "manual",
    });
    const body = await res.text();
    const showsDbNotice = body.includes("just needs a database");
    if (res.status === 200 && !showsDbNotice) {
      pass(`${path} (authenticated)`, "200, db ready");
    } else if (res.status === 200 && showsDbNotice) {
      ok = fail(`${path} (authenticated)`, "200 but DbSetupNotice visible") && ok;
    } else {
      ok = fail(`${path} (authenticated)`, `status ${res.status}`) && ok;
    }
  }

  const vocalTab = await fetch(`${base}/skills?tab=vocal`, {
    headers: { Cookie: cookieHeader },
    redirect: "manual",
  });
  if (vocalTab.status === 200) {
    pass("/skills?tab=vocal", "200");
  } else {
    ok = fail("/skills?tab=vocal", String(vocalTab.status)) && ok;
  }

  const legacy = [
    ["/journey", "/report"],
    ["/releases", "/songs"],
    ["/vocal", "/skills"],
  ];
  for (const [from, toFragment] of legacy) {
    const res = await fetch(`${base}${from}`, {
      headers: { Cookie: cookieHeader },
      redirect: "manual",
    });
    const location = res.headers.get("location") ?? "";
    if ((res.status === 307 || res.status === 302) && location.includes(toFragment)) {
      pass(`${from} redirect`, `→ ${location}`);
    } else {
      ok = fail(`${from} redirect`, `status ${res.status}, location ${location || "(none)"}`) && ok;
    }
  }

  return ok;
}

async function main() {
  console.log("Music OS freeze check\n");

  const envOk = await checkEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let schemaOk = false;
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    schemaOk = await checkSchema(supabase);
  }

  let routesOk = true;
  if (baseUrl) {
    routesOk = await checkRoutes(baseUrl);
  } else {
    console.log("\n── HTTP smoke ──");
    console.log("  ⚠ Skipped — pass --url=http://localhost:3000 or set FREEZE_CHECK_URL");
  }

  const allOk = envOk && schemaOk && routesOk;
  console.log(allOk ? "\n✅ All checks passed\n" : "\n❌ Some checks failed — fix before freezing\n");
  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

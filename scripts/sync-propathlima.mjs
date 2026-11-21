/* Συγχρονισμός από το Προπάθλημα προς το Supabase: βαθμολογία ΣΤ Ομίλου + αγώνες του PAPEI SC (αποτελέσματα και επόμενοι).
   Τρέχει αυτόματα από το GitHub Actions (.github/workflows/sync-propathlima.yml) κάθε ~15 λεπτά.
   - Χωρίς κλειδιά (SUPABASE_URL / SUPABASE_SERVICE_KEY) ή με DRY_RUN=1: μόνο διαβάζει και τυπώνει, ΔΕΝ γράφει τίποτα.
   - Αν η ανάγνωση της σελίδας δεν βγάλει λογικά αποτελέσματα, σταματά χωρίς να αγγίξει τη βάση.
   - Αγώνες που έχεις κλειδώσει/ολοκληρώσει χειροκίνητα από το admin δεν αλλάζουν. */
import { readFileSync } from "node:fs";

const SOURCE = "https://propathlima.gr/group-f-26-27/";
const TEAM_PAGE = "https://propathlima.gr/team/papei-sc/";
const SEASON = "2026/27";
const SEASON_START = "2026-08-01";
const US_NAME = "PAPEI SC";
const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const DRY = process.env.DRY_RUN === "1" || !SB_URL || !SB_KEY;

/* ---------- βοηθητικά ---------- */
const lkey = (n) => String(n).replace(/\(.*?\)/g, "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ς/g, "σ").replace(/[^a-z0-9α-ω]/g, "");
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9α-ωά-ώ]+/g, "-").replace(/^-|-$/g, "") || "x";
const dec = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const txt = (h) => dec(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const int = (s) => (/^-?\d+$/.test(String(s).trim()) ? parseInt(s, 10) : NaN);
/* Ώρα Ελλάδας -> ISO (UTC), με σωστό θερινό/χειμερινό */
function ath(d, t) {
  const p = d.split("-"), k = t.split(":"), u = Date.UTC(+p[0], p[1] - 1, +p[2], +k[0], +k[1]);
  const off = (s) => { const o = {}; new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Athens", hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(new Date(s)).forEach((x) => (o[x.type] = +x.value)); return Date.UTC(o.year, o.month - 1, o.day, o.hour, o.minute) - s; };
  return new Date(u - off(u - off(u))).toISOString();
}
const athDay = (iso) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date(iso));

/* ---------- ανάγνωση σελίδας ---------- */
function tableRows(html) {
  return [...html.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((m) => ({
    raw: m[0],
    cells: [...m[0].matchAll(/<t[dh][\s\S]*?<\/t[dh]>/gi)].map((c) => ({ html: c[0], text: txt(c[0]) })),
  }));
}
function imgSrc(cellHtml) {
  const tag = (cellHtml.match(/<img[^>]*>/i) || [])[0];
  if (!tag) return "";
  for (const a of ["data-lazy-src", "data-src", "src"]) {
    const m = tag.match(new RegExp(`\\s${a}\\s*=\\s*"([^"]+)"`, "i"));
    if (m && !m[1].startsWith("data:")) { try { return new URL(dec(m[1]), SOURCE).href; } catch { /* αγνόησε */ } }
  }
  return "";
}
function parseStandings(html) {
  /* Δεν στηριζόμαστε σε επικεφαλίδες ή κλάσεις: κρατάμε τον πίνακα με τις περισσότερες γραμμές της μορφής
     θέση, όνομα, αγώνες, Ν, Ι, Η, γκολ υπέρ, γκολ κατά (ή "υπέρ-κατά"), [διαφορά], βαθμοί */
  let best = [];
  for (const t of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const out = [];
    for (const r of tableRows(t[0])) {
      const c = r.cells.map((x) => x.text);
      if (c.length < 8 || !/^\d+\.?$/.test(c[0].trim()) || !c[1] || /^-?\d+$/.test(c[1])) continue;
      const rest = c.slice(2);
      const nums = rest.map((x) => int(x));
      const g = rest.findIndex((x) => /^\d+\s*[-–:]\s*\d+$/.test(x));
      let p, w, d, l, gf, ga, pts;
      if (g === 4) { [p, w, d, l] = nums.slice(0, 4); [gf, ga] = rest[4].split(/[-–:]/).map((x) => +x); pts = nums[nums.length - 1]; }
      else if (g < 0 && rest.length >= 7) { [p, w, d, l, gf, ga] = nums.slice(0, 6); pts = nums[nums.length - 1]; }
      else continue;
      if ([p, w, d, l, gf, ga, pts].some((x) => x == null || Number.isNaN(x))) continue;
      out.push({ logo: imgSrc(r.cells[1].html), rank: parseInt(c[0], 10), name: c[1], played: p, won: w, drawn: d, lost: l, gf, ga, points: pts });
    }
    if (out.length > best.length) best = out;
  }
  return best;
}
function parseEvents(html) {
  const out = new Map();
  for (const r of tableRows(html)) {
    const id = (r.raw.match(/sport-event\/(\d+)/) || [])[1];
    if (!id || out.has(id)) continue;
    const c = r.cells.map((x) => x.text);
    const di = c.findIndex((x) => /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(x));
    const ri = c.findIndex((x, i) => i > di && /^\d+\s*[-–:]\s*\d+$/.test(x) || (i > di && /^\d{1,2}:\d{2}$/.test(x)));
    if (di < 0 || ri < 1 || !c[ri - 1] || !c[ri + 1]) continue;
    const dm = c[di].match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
    const sm = c[ri].match(/^(\d+)\s*[-–:]\s*(\d+)$/);
    const isScore = sm && !/^\d{1,2}:\d{2}$/.test(c[ri]);
    const md = int(c[c.length - 1]);
    out.set(id, { id, date: dm[1], time: dm[2], home: c[ri - 1], away: c[ri + 1], hs: isScore ? +sm[1] : null, as: isScore ? +sm[2] : null, round: Number.isNaN(md) ? null : md });
  }
  return [...out.values()];
}

/* ---------- Supabase (REST) ---------- */
async function sb(path, opt = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { ...opt, headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...(opt.headers || {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${path}: ${t}`);
  return t ? JSON.parse(t) : [];
}
const same = (a, b) => (a ?? null) === (b ?? null);

async function main() {
  let html;
  if (process.env.SOURCE_FILE) html = readFileSync(process.env.SOURCE_FILE, "utf8");
  else {
    const res = await fetch(SOURCE, { headers: { "User-Agent": "Mozilla/5.0 (compatible; PAPEI-SC-sync/1.0)", "Accept-Language": "el,en;q=0.8" } });
    html = await res.text();
    console.log(`Προπάθλημα: HTTP ${res.status}, ${html.length} χαρακτήρες, ${(html.match(/<table/gi) || []).length} πίνακες`);
    if (!res.ok) throw new Error(`Το Προπάθλημα απάντησε ${res.status}. Πιθανόν μπλοκάρει τα αιτήματα του GitHub. Αρχή απάντησης: ${html.slice(0, 200).replace(/\s+/g, " ")}`);
  }
  const standings = parseStandings(html), events = parseEvents(html).map((e) => ({ ...e, src: "group" }));
  /* σελίδα της ομάδας: βοηθά να ενημερώνονται τα αποτελέσματα των δικών μας αγώνων (προαιρετικό, δεν σταματά τον συγχρονισμό) */
  try {
    const tr = await fetch(TEAM_PAGE, { headers: { "User-Agent": "Mozilla/5.0 (compatible; PAPEI-SC-sync/1.0)", "Accept-Language": "el,en;q=0.8" } });
    if (tr.ok) {
      const have = new Set(events.map((e) => e.id));
      const extra = parseEvents(await tr.text()).filter((e) => !have.has(e.id) && e.date >= SEASON_START).map((e) => ({ ...e, src: "team" }));
      console.log(`Σελίδα ομάδας: ${extra.length} επιπλέον αγώνες`);
      events.push(...extra);
    } else console.log(`Σελίδα ομάδας: HTTP ${tr.status} (αγνοείται)`);
  } catch (e) { console.log("Σελίδα ομάδας: δεν διαβάστηκε (αγνοείται):", e.message); }
  console.log(`Βαθμολογία: ${standings.length} ομάδες · Αγώνες στη σελίδα: ${events.length}`);
  if (standings.length < 8) {
    [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].slice(0, 4).forEach((t, i) => { const r = tableRows(t[0]).slice(0, 2).map((x) => x.cells.map((c) => c.text).join(" | ")); console.log(`Πίνακας ${i + 1}:`, r.join(" // ").slice(0, 300)); });
  }
  if (standings.length < 8) throw new Error("Η ανάγνωση της βαθμολογίας δεν έβγαλε λογικά αποτελέσματα (λιγότερες από 8 ομάδες). Δεν γράφτηκε τίποτα. Μάλλον άλλαξε η σελίδα ή μπλοκάρει το αίτημα.");
  const ranks = standings.map((s) => s.rank).sort((a, b) => a - b);
  if (ranks[0] !== 1 || new Set(ranks).size !== ranks.length) throw new Error("Οι θέσεις της βαθμολογίας δεν βγαίνουν σωστές. Δεν γράφτηκε τίποτα.");
  const usKey = lkey(US_NAME);
  const mine = events.filter((e) => lkey(e.home) === usKey || lkey(e.away) === usKey);
  console.log(`Αγώνες του ${US_NAME}: ${mine.length}`);
  if (DRY) {
    console.log(DRY ? "DRY RUN: δεν γράφω στη βάση.\n" : "");
    console.table(standings);
    console.table(mine);
    return;
  }

  /* ομάδες */
  const teams = await sb("teams?select=id,name,is_us,logo_path"), aliases = await sb("team_aliases?select=alias,team_id");
  const byKey = new Map();
  teams.forEach((t) => byKey.set(lkey(t.name), t.id));
  aliases.forEach((a) => byKey.set(lkey(a.alias), a.team_id));
  const usTeam = teams.find((t) => t.is_us) || teams.find((t) => lkey(t.name) === usKey);
  if (!usTeam) throw new Error(`Δεν βρέθηκε η ομάδα ${US_NAME} στη βάση.`);
  async function teamId(name, logo) {
    const k = lkey(name);
    if (byKey.has(k)) return byKey.get(k);
    let r;
    try { r = await sb("teams", { method: "POST", body: JSON.stringify({ name, slug: slug(name), is_us: false, ...(logo ? { logo_path: logo } : {}) }) }); }
    catch (e) { r = await sb("teams", { method: "POST", body: JSON.stringify({ name, slug: slug(name) + "-" + Math.random().toString(36).slice(2, 6), is_us: false, ...(logo ? { logo_path: logo } : {}) }) }); }
    await sb("team_aliases", { method: "POST", body: JSON.stringify({ alias: name, team_id: r[0].id }) }).catch(() => {});
    byKey.set(k, r[0].id);
    console.log("Νέα ομάδα:", name);
    return r[0].id;
  }

  /* βαθμολογία: ενημέρωση γραμμή-γραμμή (ο πίνακας δεν αδειάζει ποτέ ενδιάμεσα) */
  const ex = await sb(`standings?season=eq.${encodeURIComponent(SEASON)}&select=*`);
  const exBy = new Map(ex.map((r) => [r.team_id, r]));
  const seen = new Set();
  let ch = 0, lc = 0;
  for (const s of standings) {
    const tid = await teamId(s.name, s.logo);
    seen.add(tid);
    /* logo από το Προπάθλημα: μόνο αν η ομάδα δεν έχει logo ή το είχε βάλει ο συγχρονισμός. Δεν πειράζουμε logo που ανέβασες εσύ από το admin ούτε το δικό μας */
    const tm = teams.find((t) => t.id === tid);
    if (/^https:\/\/propathlima\.gr\/wp-content\//.test(s.logo) && tm && !tm.is_us && (!tm.logo_path || /propathlima\.gr/.test(tm.logo_path)) && tm.logo_path !== s.logo) {
      await sb(`teams?id=eq.${tid}`, { method: "PATCH", body: JSON.stringify({ logo_path: s.logo }) }); tm.logo_path = s.logo; lc++;
    }
    const row = { season: SEASON, team_id: tid, rank: s.rank, played: s.played, won: s.won, drawn: s.drawn, lost: s.lost, gf: s.gf, ga: s.ga, points: s.points };
    const old = exBy.get(tid);
    if (!old) { await sb("standings", { method: "POST", body: JSON.stringify(row) }); ch++; continue; }
    if (["rank", "played", "won", "drawn", "lost", "gf", "ga", "points"].some((k) => !same(old[k], row[k]))) {
      await sb(`standings?season=eq.${encodeURIComponent(SEASON)}&team_id=eq.${tid}`, { method: "PATCH", body: JSON.stringify(row) }); ch++;
    }
  }
  for (const r of ex) if (!seen.has(r.team_id)) { await sb(`standings?season=eq.${encodeURIComponent(SEASON)}&team_id=eq.${r.team_id}`, { method: "DELETE" }); ch++; }
  console.log(`Βαθμολογία: ${ch} αλλαγές · Logos: ${lc} ενημερώσεις.`);

  /* αγώνες του PAPEI SC */
  if (!mine.length) { console.log("Δεν βρέθηκαν αγώνες στη σελίδα (ίσως αλλάζει η μορφή της λίστας). Η βαθμολογία συγχρονίστηκε κανονικά."); return; }
  const ms = await sb(`matches?season=eq.${encodeURIComponent(SEASON)}&select=id,external_id,source,locked,status,home_team,away_team,home_score,away_score,kickoff`);
  let mc = 0;
  for (const e of mine) {
    const home = await teamId(e.home), away = await teamId(e.away);
    const kickoff = ath(e.date, e.time), fin = e.hs != null;
    let old = ms.find((m) => m.external_id === e.id);
    /* χειροκίνητος αγώνας (π.χ. ο «επόμενος») που τώρα εμφανίστηκε και στο Προπάθλημα: τον "δένουμε" αντί να φτιάξουμε διπλότυπο */
    if (!old) old = ms.find((m) => !m.external_id && m.home_team === home && m.away_team === away && m.kickoff && Math.abs(new Date(m.kickoff) - new Date(kickoff)) < 36e5 * 30 && athDay(m.kickoff) === e.date);
    const fields = { home_score: e.hs, away_score: e.as, status: fin ? "finished" : "scheduled", kickoff, external_id: e.id, source: "propathlima" };
    if (e.round != null) fields.round_label = `${e.round}η αγ.`;
    if (!old) { if (e.src !== "group") continue; await sb("matches", { method: "POST", body: JSON.stringify({ season: SEASON, competition: "Πρωτάθλημα", home_team: home, away_team: away, locked: false, ...fields }) }); mc++; continue; }
    if (old.locked && old.status === "finished") continue; /* σεβόμαστε ό,τι έχεις οριστικοποιήσει στο admin */
    const upd = {};
    for (const k of ["home_score", "away_score", "status", "external_id"]) if (!same(old[k], fields[k])) upd[k] = fields[k];
    if (!old.locked && !same(old.kickoff && new Date(old.kickoff).toISOString(), kickoff)) upd.kickoff = kickoff;
    if (Object.keys(upd).length) { await sb(`matches?id=eq.${old.id}`, { method: "PATCH", body: JSON.stringify(upd) }); mc++; }
  }
  console.log(`Αγώνες: ${mc} αλλαγές.`);
}
main().catch((e) => { console.error("ΣΦΑΛΜΑ:", e.message); process.exit(1); });

-- PAPEI SC: Supabase schema. Run once in Supabase > SQL Editor.
-- Public visitors can only READ published data. Only the admin (one user) can write.

create table admins (user_id uuid primary key references auth.users on delete cascade);
create function is_admin() returns boolean language sql security definer stable
  as $$ select exists(select 1 from admins where user_id = auth.uid()) $$;

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null,
  logo_path text,                      -- Storage: team-logos/<file>; null = placeholder
  is_us boolean not null default false);
create table team_aliases (            -- exact spellings only; never fuzzy-match logos
  alias text primary key, team_id uuid not null references teams on delete cascade);

create table players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, slug text unique not null,
  position text, shirt_number int, bio text, photo_path text,
  show_on_roster boolean not null default true, created_at timestamptz default now());

create table matches (
  id uuid primary key default gen_random_uuid(),
  season text not null, competition text not null, round_label text,
  kickoff timestamptz,                 -- stored in UTC, shown as Europe/Athens
  home_team uuid not null references teams, away_team uuid not null references teams,
  home_score int, away_score int,
  status text not null default 'scheduled' check (status in ('scheduled','live','finished','postponed')),
  venue text, venue_map_url text,
  source text not null default 'manual' check (source in ('manual','propathlima')),
  external_id text,                    -- Propathlima sport-event id
  locked boolean not null default false, -- true = sync must not overwrite manual edits
  unique (source, external_id));

create table appearances (
  match_id uuid references matches on delete cascade,
  player_id uuid references players on delete cascade,
  primary key (match_id, player_id));   -- one appearance per player per match

create table match_events (            -- one row per goal; assist lives on the same row
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches on delete cascade,
  seq int not null,                    -- 1,2,3... per match
  kind text not null default 'goal' check (kind in ('goal','own_goal')),
  scorer_id uuid references players, assist_id uuid references players,
  minute int, source text not null default 'manual', external_id text,
  unique (match_id, seq),              -- same event can't be entered twice
  unique (source, external_id),
  check (assist_id is distinct from scorer_id));

create table standings (
  season text, group_name text, team_id uuid references teams,
  rank int, played int, won int, drawn int, lost int, gf int, ga int, points int,
  updated_at timestamptz default now(),
  primary key (season, group_name, team_id));

create table site_settings (key text primary key, draft jsonb, published jsonb,
  updated_at timestamptz default now());   -- design tokens, section order; draft vs published
create table sync_log (id bigserial primary key, source text, started_at timestamptz default now(),
  finished_at timestamptz, status text, inserted int default 0, updated int default 0,
  skipped int default 0, error text);

-- Stats are always computed from events, never typed in by hand.
create view player_stats as
select p.id, p.full_name,
  (select count(*) from match_events e where e.scorer_id = p.id and e.kind = 'goal') as goals,
  (select count(*) from match_events e where e.assist_id = p.id) as assists,
  (select count(*) from appearances a where a.player_id = p.id) as appearances
from players p;

-- Row Level Security
do $$ declare t text; begin
  foreach t in array array['admins','teams','team_aliases','players','matches','appearances',
    'match_events','standings','site_settings','sync_log'] loop
    execute format('alter table %I enable row level security', t);
    if t not in ('admins','sync_log') then
      execute format('create policy "public read" on %I for select using (true)', t);
    end if;
    execute format('create policy "admin all" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop; end $$;
-- Note: site_settings.draft is readable by the public. Keep secrets out of it.
-- To hide drafts later, move them to a separate admin-only table.

-- Storage (public read, admin write)
insert into storage.buckets (id, name, public) values
  ('player-photos', 'player-photos', true), ('team-logos', 'team-logos', true),
  ('site-media', 'site-media', true) on conflict do nothing;
create policy "media admin write" on storage.objects for all
  using (bucket_id in ('player-photos','team-logos','site-media') and is_admin())
  with check (bucket_id in ('player-photos','team-logos','site-media') and is_admin());
-- After your first login, make yourself admin (replace the email):
-- insert into admins select id from auth.users where email = 'YOUR_EMAIL';

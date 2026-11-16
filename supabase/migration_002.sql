-- Τρέξε ΜΕΤΑ το schema.sql. Κρατά τα υπάρχοντα σύνολα παικτών ως «βάση», ώστε να μην διπλομετρηθούν.
-- Από εδώ και πέρα καταχωρείς γκολ/ασίστ/παρουσίες ανά αγώνα στο admin.
alter table players add column if not exists base_goals int not null default 0,
  add column if not exists base_assists int not null default 0,
  add column if not exists base_apps int not null default 0;
create or replace view player_stats as
select p.id, p.full_name,
  p.base_goals + (select count(*) from match_events e where e.scorer_id = p.id and e.kind = 'goal') as goals,
  p.base_assists + (select count(*) from match_events e where e.assist_id = p.id) as assists,
  p.base_apps + (select count(*) from appearances a where a.player_id = p.id) as appearances
from players p;

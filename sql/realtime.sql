-- Τρέξε το μία φορά στο Supabase: SQL Editor -> New query -> Run.
-- Ενεργοποιεί τις ζωντανές ενημερώσεις: όταν αλλάζει κάτι (σκορ, γκολ, βαθμολογία, παίκτης, εμφάνιση)
-- το site το δείχνει στους επισκέπτες χωρίς refresh. Αν το τρέξεις δεύτερη φορά βγάζει σφάλμα "already member": αγνόησέ το.
do $$
declare t text;
begin
  foreach t in array array['teams','players','matches','match_events','appearances','standings','site_settings']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
-- Η ανάγνωση γίνεται με το δημόσιο (anon) κλειδί, άρα ισχύουν τα ίδια select policies που ήδη έχεις για κάθε πίνακα.

-- Schéma TonaBk — à coller dans l'éditeur SQL de Supabase

create table quartiers (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  commune text not null default 'Ibanda'
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  telephone text not null,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'valide', 'suspendu')),
  created_at timestamptz not null default now()
);

create table maisons (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text not null default '',
  prix numeric not null,
  chambres int not null default 1,
  douches int not null default 1,
  superficie int,
  type text not null default 'maison' check (type in ('maison', 'appartement', 'chambre', 'parcelle', 'boutique')),
  operation text not null default 'louer' check (operation in ('louer', 'vendre')),
  quartier_id uuid references quartiers(id),
  agent_id uuid references agents(id),
  statut text not null default 'brouillon' check (statut in ('brouillon', 'publiee', 'louee', 'vendue')),
  verifie boolean not null default false,
  a_la_une boolean not null default false,
  vues int not null default 0,
  created_at timestamptz not null default now()
);

create table photos_maison (
  id uuid primary key default gen_random_uuid(),
  maison_id uuid references maisons(id) on delete cascade,
  url text not null,
  ordre int not null default 0
);

create table avis (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  note int not null check (note between 1 and 5),
  commentaire text,
  created_at timestamptz not null default now()
);

-- Quartiers d'Ibanda déjà connus (à compléter au fil du temps)
insert into quartiers (nom) values
  ('Labotte'), ('Avenue Saio'), ('Hypodrome'), ('Nguba'), ('Mukukwe'),
  ('Sinelac'), ('Nyofu'), ('Kasaï'), ('Vamaro');

-- Sécurité (RLS) : lecture publique des annonces publiées,
-- écriture réservée aux utilisateurs authentifiés (admin pour l'instant)
alter table maisons enable row level security;
alter table photos_maison enable row level security;
alter table quartiers enable row level security;

create policy "lecture_publique_maisons_publiees"
  on maisons for select
  using (statut = 'publiee');

create policy "lecture_publique_quartiers"
  on quartiers for select
  using (true);

create policy "lecture_publique_photos"
  on photos_maison for select
  using (true);

create policy "ecriture_admin_maisons"
  on maisons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "ecriture_admin_photos"
  on photos_maison for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Incrémenter les vues sans ouvrir l'écriture publique sur la table
create or replace function incrementer_vues(maison_id uuid)
returns void
language sql
security definer
as $$
  update maisons set vues = vues + 1 where id = maison_id and statut = 'publiee';
$$;

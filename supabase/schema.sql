-- ============================================================
-- VITRINE — Supabase Schema
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Extension UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: models
-- ============================================================
create table public.models (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  age         integer not null check (age > 0 and age < 120),
  city        text not null,
  country     text not null,
  height      text,
  cover_image text not null,
  images      text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TABLE: analytics
-- ============================================================
create table public.analytics (
  id         uuid primary key default gen_random_uuid(),
  model_id   uuid not null references public.models(id) on delete cascade,
  type       text not null check (type in ('view', 'click', 'time')),
  value      numeric,
  created_at timestamptz not null default now()
);

-- Index pour les requêtes analytics
create index idx_analytics_model_id  on public.analytics(model_id);
create index idx_analytics_type      on public.analytics(type);
create index idx_analytics_created   on public.analytics(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.models    enable row level security;
alter table public.analytics enable row level security;

-- Lecture publique des models (pour le feed)
create policy "models_public_read"
  on public.models for select
  using (true);

-- Écriture models : service role uniquement (via API routes Next.js)
create policy "models_service_write"
  on public.models for all
  using (auth.role() = 'service_role');

-- Analytics : service role pour écrire, admin authentifié pour lire
create policy "analytics_service_write"
  on public.analytics for all
  using (auth.role() = 'service_role');

create policy "analytics_admin_read"
  on public.analytics for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- VUE: model_stats  (dashboard admin)
-- ============================================================
create or replace view public.model_stats as
  select
    m.id as model_id,
    count(case when a.type = 'view'  then 1 end)::int  as impressions,
    count(case when a.type = 'click' then 1 end)::int  as clicks,
    case
      when count(case when a.type = 'view' then 1 end) = 0 then 0.0
      else round(
        count(case when a.type = 'click' then 1 end)::numeric /
        count(case when a.type = 'view'  then 1 end)::numeric,
        4
      )
    end as ctr,
    coalesce(avg(case when a.type = 'time' then a.value end), 0)::numeric(10,1) as avg_time_spent
  from public.models m
  left join public.analytics a on a.model_id = m.id
  group by m.id;

-- ============================================================
-- STORAGE: bucket model-images
-- (à créer aussi dans Dashboard > Storage > New bucket)
-- Nom: model-images  |  Public: oui
-- ============================================================

-- Lecture publique des images
create policy "public_read_model_images"
  on storage.objects for select
  using (bucket_id = 'model-images');

-- Upload : admin authentifié
create policy "admin_upload_model_images"
  on storage.objects for insert
  with check (bucket_id = 'model-images' and auth.role() = 'authenticated');

-- Suppression : admin authentifié
create policy "admin_delete_model_images"
  on storage.objects for delete
  using (bucket_id = 'model-images' and auth.role() = 'authenticated');

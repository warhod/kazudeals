-- Catalog games scraped from DekuDeals (public read/write via API for cache refresh).

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  deku_url text not null,
  image_url text,
  current_price numeric,
  msrp numeric,
  description text,
  platform text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint games_deku_url_key unique (deku_url)
);

create index if not exists games_updated_at_idx on public.games (updated_at desc);

comment on table public.games is 'KazuDeals game metadata; upserted by the web API scraper.';

alter table public.games enable row level security;

drop policy if exists "games_select_public" on public.games;
create policy "games_select_public"
  on public.games for select
  to anon, authenticated
  using (true);

drop policy if exists "games_insert_public" on public.games;
create policy "games_insert_public"
  on public.games for insert
  to anon, authenticated
  with check (true);

drop policy if exists "games_update_public" on public.games;
create policy "games_update_public"
  on public.games for update
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update on table public.games to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
  before update on public.games
  for each row
  execute procedure public.set_updated_at();

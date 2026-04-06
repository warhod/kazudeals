-- User-owned groups with invite codes.

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint groups_invite_code_key unique (invite_code)
);

create index if not exists groups_owner_id_idx on public.groups (owner_id);

comment on table public.groups is 'Sharing circles; owner manages membership and deletion.';

alter table public.groups enable row level security;

drop policy if exists "groups_select_authenticated" on public.groups;
create policy "groups_select_authenticated"
  on public.groups for select
  to authenticated
  using (true);

drop policy if exists "groups_insert_authenticated" on public.groups;
create policy "groups_insert_authenticated"
  on public.groups for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "groups_update_owner" on public.groups;
create policy "groups_update_owner"
  on public.groups for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "groups_delete_owner" on public.groups;
create policy "groups_delete_owner"
  on public.groups for delete
  to authenticated
  using (auth.uid() = owner_id);

grant select, insert, update, delete on table public.groups to authenticated;

-- Group membership (many-to-many users <-> groups).

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  constraint group_members_group_user_key unique (group_id, user_id)
);

create index if not exists group_members_user_id_idx on public.group_members (user_id);
create index if not exists group_members_group_id_idx on public.group_members (group_id);

comment on table public.group_members is 'Who belongs to which group.';

alter table public.group_members enable row level security;

drop policy if exists "group_members_select_same_group" on public.group_members;
create policy "group_members_select_same_group"
  on public.group_members for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
    )
  );

drop policy if exists "group_members_insert_authenticated" on public.group_members;
create policy "group_members_insert_authenticated"
  on public.group_members for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "group_members_delete_owner_or_self" on public.group_members;
create policy "group_members_delete_owner_or_self"
  on public.group_members for delete
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.groups g
      where g.id = group_members.group_id
        and g.owner_id = auth.uid()
    )
  );

grant select, insert, delete on table public.group_members to authenticated;

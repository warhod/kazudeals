-- Loan requests between group members.

do $$
begin
  create type public.loan_status as enum (
    'requested',
    'approved',
    'declined',
    'returned'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.game_loans (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  borrower_id uuid not null references auth.users (id) on delete cascade,
  group_id uuid not null references public.groups (id) on delete cascade,
  status public.loan_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint game_loans_owner_neq_borrower check (owner_id <> borrower_id)
);

create index if not exists game_loans_owner_idx on public.game_loans (owner_id);
create index if not exists game_loans_borrower_idx on public.game_loans (borrower_id);
create index if not exists game_loans_group_idx on public.game_loans (group_id);

comment on table public.game_loans is 'Borrow/return flow scoped to a group.';

alter table public.game_loans enable row level security;

drop policy if exists "game_loans_select_participant" on public.game_loans;
create policy "game_loans_select_participant"
  on public.game_loans for select
  to authenticated
  using (auth.uid() = owner_id or auth.uid() = borrower_id);

drop policy if exists "game_loans_insert_borrower" on public.game_loans;
create policy "game_loans_insert_borrower"
  on public.game_loans for insert
  to authenticated
  with check (auth.uid() = borrower_id);

drop policy if exists "game_loans_update_participant" on public.game_loans;
create policy "game_loans_update_participant"
  on public.game_loans for update
  to authenticated
  using (auth.uid() = owner_id or auth.uid() = borrower_id)
  with check (auth.uid() = owner_id or auth.uid() = borrower_id);

grant select, insert, update on table public.game_loans to authenticated;

drop trigger if exists game_loans_set_updated_at on public.game_loans;
create trigger game_loans_set_updated_at
  before update on public.game_loans
  for each row
  execute procedure public.set_updated_at();

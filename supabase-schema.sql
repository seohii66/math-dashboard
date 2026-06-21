-- Math Practice Hub — Supabase schema (single-student setup)
-- Run this in: Supabase project → SQL Editor → New query → Run

create table if not exists app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Seed the single row the app reads/writes.
insert into app_state (id, data) values ('singleton', '{"attempts":{},"assigned":{}}')
on conflict (id) do nothing;

-- Row Level Security: this is a single student's practice data (not sensitive),
-- so we allow the public anon key to read and write this one table.
alter table app_state enable row level security;

drop policy if exists "anon read"   on app_state;
drop policy if exists "anon insert" on app_state;
drop policy if exists "anon update" on app_state;

create policy "anon read"   on app_state for select using (true);
create policy "anon insert" on app_state for insert with check (true);
create policy "anon update" on app_state for update using (true) with check (true);

-- Enable realtime so the teacher's screen updates as the student answers.
alter publication supabase_realtime add table app_state;

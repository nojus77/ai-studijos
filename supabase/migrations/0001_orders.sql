create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  email text not null,
  tier text not null,
  amount_cents integer not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "service_role_all" on public.orders;
create policy "service_role_all" on public.orders for all to service_role using (true) with check (true);

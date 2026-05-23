create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  vardas text not null,
  imone text,
  email text not null,
  telefonas text,
  komandos_dydis text,
  situacija text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "service_role_all" on public.leads;
create policy "service_role_all" on public.leads
  for all to service_role
  using (true) with check (true);

drop policy if exists "service_role_all" on public.newsletter_subscribers;
create policy "service_role_all" on public.newsletter_subscribers
  for all to service_role
  using (true) with check (true);

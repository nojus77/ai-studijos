-- Add items JSON column to orders to capture line-item-level detail
-- when a single checkout session contains multiple products (base tier + bumps).
alter table public.orders
  add column if not exists items jsonb;

-- Remember a successful email verification on one browser for 72 hours.
-- Only a hash of the browser's random secret is stored here.
begin;
create table if not exists public.login_email_trust (
  token_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists login_email_trust_user_idx on public.login_email_trust(user_id);
alter table public.login_email_trust enable row level security;
revoke all on public.login_email_trust from public, anon, authenticated;
grant select, insert, delete on public.login_email_trust to service_role;
commit;

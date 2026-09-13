-- Email verification is bound to each Auth session, never to mutable user metadata.
begin;
-- Do not silently replace another project's request guard.
do $$ begin
  if exists (
    select 1 from pg_db_role_setting s join pg_roles r on r.oid = s.setrole,
      unnest(s.setconfig) setting
    where r.rolname = 'authenticator' and setting like 'pgrst.db_pre_request=%'
      and setting not in ('pgrst.db_pre_request=', 'pgrst.db_pre_request=public.require_verified_email_request')
  ) then
    raise exception 'Existing PostgREST pre-request hook must be composed with email verification before rollout';
  end if;
end $$;
create table public.login_email_challenges (
  token_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  expires_at timestamptz not null,
  sent_at timestamptz not null default now(),
  attempts integer not null default 0
);
create table public.email_verified_sessions (
  session_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  verified_at timestamptz not null default now()
);
alter table public.login_email_challenges enable row level security;
alter table public.email_verified_sessions enable row level security;
revoke all on public.login_email_challenges, public.email_verified_sessions from public, anon, authenticated;
grant all on public.login_email_challenges, public.email_verified_sessions to service_role;

create function public.claim_email_attempt(challenge_hash text)
returns setof public.login_email_challenges
language sql security definer set search_path = '' as $$
  update public.login_email_challenges
  set attempts = attempts + 1
  where token_hash = challenge_hash and expires_at > now() and attempts < 5
  returning *;
$$;
revoke all on function public.claim_email_attempt(text) from public, anon, authenticated;
grant execute on function public.claim_email_attempt(text) to service_role;

create function public.has_verified_email_session()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.email_verified_sessions s
    join public.users u on u.id = s.user_id
    where s.user_id = auth.uid() and u.status = 'active'
      and s.session_id::text = (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'session_id')
  );
$$;
revoke all on function public.has_verified_email_session() from public;
grant execute on function public.has_verified_email_session() to authenticated, service_role;

-- Restrictive policies also protect owner-only reads and Realtime subscriptions.
do $$ declare t record; begin
  for t in select schemaname, tablename from pg_tables
    where (schemaname = 'public' and tablename not in ('login_email_challenges', 'email_verified_sessions'))
       or (schemaname = 'storage' and tablename = 'objects')
  loop
    execute format('create policy email_verification_required on %I.%I as restrictive for all to authenticated using ((select public.has_verified_email_session())) with check ((select public.has_verified_email_session()))', t.schemaname, t.tablename);
  end loop;
end $$;

-- PostgREST checks RPC calls too, including SECURITY DEFINER functions.
create function public.require_verified_email_request()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role' = 'authenticated'
     and not public.has_verified_email_session() then
    raise sqlstate '42501' using message = 'Email verification required. Sign in again.';
  end if;
end $$;
grant execute on function public.require_verified_email_request() to authenticated, anon, service_role;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'authenticator') then
    execute 'alter role authenticator set pgrst.db_pre_request = ''public.require_verified_email_request''';
  end if;
end $$;
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
commit;

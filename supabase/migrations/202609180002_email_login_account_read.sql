-- RLS bypass does not grant SQL table privileges. Email login checks account
-- status with the server-only service role before issuing a browser session.
grant select (id, role, status) on public.users to service_role;

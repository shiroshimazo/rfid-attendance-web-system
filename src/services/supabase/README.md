# Supabase

- `client.ts` creates the cookie-aware browser client used for sign-in and sign-out.
- `server.ts` creates the server client used by route and role guards.
- `config.ts` validates the public Supabase URL and publishable key.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
in the ignored root `.env` file before starting the application.

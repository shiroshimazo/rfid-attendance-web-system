# Authentication

Supabase Authentication, session verification, role resolution, password recovery, and route protection.

## Remembered email verification

Apply `supabase/migrations/202609190002_remember_email_verification.sql` after the
email-login migrations before deploying this change. Successful six-digit email
verification creates a random, HttpOnly browser cookie valid for exactly 72 hours.
Only its SHA-256 hash, account ID, email and expiry are stored in `login_email_trust`.
The table is accessible only to the server's service role.

Every login still checks the password and active account. A matching, unexpired
browser token allows the new Auth session to be registered as email verified
without sending another code. Logout removes the Auth session but keeps this
cookie. Password-only logins do not extend its deadline. After 72 hours, on another
browser, after clearing cookies, or for another account/email, a new code is required.
The six-digit code itself still expires after 10 minutes and is not reusable.
Existing signed-in sessions retain their current lifetime; the 72-hour rule is
checked when signing in again.

Delete a user's `login_email_trust` rows to revoke remembered browsers. To disable
the feature while retaining data, revert the application release; the old login
flow ignores this table and always requires a code. No schema deletion is needed.

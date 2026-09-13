# Email verification after password sign-in

Admin, teacher, and student accounts now use password verification followed by a six-digit email code. The browser receives no password session. A server-only, single-use challenge binds password proof to the email verification. Challenges expire after 10 minutes and allow five attempts; resend does not reset either limit.

Successful verification records the new Auth session ID. Server account checks, restrictive database policies, and the PostgREST pre-request hook require that session record. Direct password, recovery, or magic-link sessions cannot access application records. Existing sessions must sign in again after rollout. This is custom email step-up verification, not Supabase's native AAL2 MFA; native MFA supports authenticator apps and phone factors.

## Required rollout

1. In Supabase Authentication, configure a production SMTP sender that can deliver to all school accounts. Confirm email addresses are real, complete addresses such as `name@example.com`.
2. Update the **Magic Link** email template to contain the code, without a login link:
   ```html
   <h2>Your sign-in verification code</h2>
   <p>Enter this code to finish signing in: <strong>{{ .Token }}</strong></p>
   <p>If you did not request this code, ignore this email.</p>
   ```
3. Set Email OTP length to **6** and expiration to **600 seconds**. Supabase shares this expiration setting with other email links, including password recovery. Review that effect before rollout. Keep Auth rate limits enabled.
4. Confirm `SUPABASE_SERVICE_ROLE_KEY` exists only on the Next.js server. No additional mail API key is needed in this application.
5. During a coordinated maintenance window, apply `supabase/migrations/202609180001_email_login_verification.sql` and deploy the application together. Old application versions cannot log in after the migration. The migration preserves account and attendance data. It refuses to overwrite a different PostgREST pre-request hook; compose existing enforcement before proceeding if one is installed.
6. Verify password then email sign-in for each role, wrong/expired codes, resend limits, browser refresh, sign-out, inactive accounts, and password recovery. Test a direct password-only Supabase session: table requests and RPCs must fail. Test private storage and Realtime too. Supabase Auth endpoints remain governed by Supabase's own policies; this change does not turn email OTP into native AAL2.

Local validation: `node --test tests/profile-lifecycle.test.mjs`, TypeScript, and focused ESLint. Actual SMTP delivery and hosted PostgREST configuration require a live smoke test; local database tests do not prove email delivery.

## Rollback

Restore the prior application version and run `supabase/rollback_email_login_verification.sql` in the same maintenance window. This removes the new access requirement, returning to password-only application access. Challenge/session tables remain for diagnosis; no account or attendance records are deleted.

Expired challenge rows can be periodically deleted by a trusted administrator. Verification records should be removed when their corresponding Auth sessions no longer exist. Do not grant browser clients writes to either security table. Future business tables need the same restrictive policy.

References: https://supabase.com/docs/guides/auth/auth-email-passwordless and https://supabase.com/docs/guides/auth/auth-mfa.

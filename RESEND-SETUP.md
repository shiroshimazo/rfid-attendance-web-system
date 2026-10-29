# Resend email setup

Calendar notifications already send through the Resend API. Sign-in verification and password recovery use Supabase Auth, which can deliver through Resend SMTP.

## Calendar notifications

Set these values in the root `.env` file. This file is ignored by Git. Do not put the key in `.env.example`, browser code, or any variable starting with `NEXT_PUBLIC_`.

```dotenv
RESEND_API_KEY=re_your_actual_key
CALENDAR_EMAIL_FROM="School Calendar <calendar@your-verified-domain.com>"
CALENDAR_EMAIL_REPLY_TO=
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

Use a sender on a domain verified in Resend. `NEXT_PUBLIC_APP_URL` must be an HTTPS origin without a path or query; it is used for links inside emails. Restart the development server after changing settings. For deployment, configure the same values in the hosting provider's environment settings and redeploy.

Apply the [calendar migrations](supabase/migrations/README.md) before publishing calendar entries. See the [calendar documentation](src/features/calendar/README.md#email-setup) for dispatch, delivery history, and retry behavior. Provider acceptance does not guarantee inbox delivery.

## Sign-in and password recovery

These emails are sent by Supabase Auth. Setting `RESEND_API_KEY` in the application does not configure Supabase SMTP.

In the Supabase dashboard, open **Authentication > Email > SMTP Settings**, enable custom SMTP, and enter:

- Sender email: an address on your verified Resend domain.
- Sender name: your school or application name.
- Host: `smtp.resend.com`.
- Port: `465`.
- Username: `resend`.
- Password: your Resend API key.

Save the SMTP settings. Follow [email verification rollout](EMAIL-LOGIN-VERIFICATION.md#required-rollout) for the six-digit code template, expiration, and database requirements.

## Local checks

```sh
node --test tests/calendar-email.test.mjs tests/calendar-notifications.test.mjs tests/calendar-delivery.test.mjs tests/email-login-actions.test.mjs tests/password-recovery.test.mjs
```

These tests mock delivery and do not send email. Verify real delivery separately after configuring the sender and credentials.

References: [Resend with Next.js](https://resend.com/docs/send-with-nextjs), [Resend SMTP with Supabase](https://resend.com/docs/send-with-supabase-smtp).

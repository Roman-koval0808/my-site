# Consultation form

The homepage consultation form delivers real email. The site logs in to the NetSwagger mailbox at
Namecheap Private Email and sends each valid submission to `info@netswagger.org`. The visitor only
sees the success panel once the mail server has accepted the message.

**The form needs a mailbox login before it can send.** Until `SMTP_USER` and `SMTP_PASS` are set,
every submission fails with the visitor-facing error and the reason is written to the server log.
See [Configuration](#configuration).

## How it works

The mailbox password must never reach the browser, so delivery runs in a TanStack Start **server
function** (`createServerFn`). Its body is compiled into the server bundle only; the client bundle
contains a `fetch` call to the function's URL and nothing else. `createCsrfMiddleware` in
`src/start.ts` already guards server functions against cross-site calls.

The server function talks SMTP to `mail.privateemail.com` on port 465 (TLS from the first byte)
through a small client in `src/lib/smtp.server.ts`. It is built on `node:tls`, which Cloudflare
Workers support under `nodejs_compat`, so the same code runs in production on Cloudflare and under
Node during `npm run dev`. nodemailer is not used because it depends on Node APIs Workers do not
fully provide. Cloudflare blocks outbound port 25, but 465 is allowed.

The `.server.ts` suffix is load-bearing: TanStack Start's import protection refuses to ship
`*.server.*` files to the browser.

## Structure

| File                                 | Responsibility                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| `src/lib/contact-schema.ts`          | Zod schema, field limits, dropdown options, and messages. Shared by client and server. |
| `src/lib/contact-email.ts`           | Builds the subject, text, and HTML bodies. Pure, so it is unit tested.                 |
| `src/lib/smtp.server.ts`             | SMTP client and MIME message builder. **Server only.**                                 |
| `src/lib/contact-server.ts`          | The server function. Reads the mailbox settings and sends. **Server only.**            |
| `src/lib/contact-delivery.ts`        | `submitContactRequest`, the client wrapper the form calls.                             |
| `src/lib/contact-submit.ts`          | The `ContactSubmitter` contract, `ContactSubmitError`, and the simulated submitter.    |
| `src/components/contact-section.tsx` | UI, inline validation, loading state, focus management, and success/error feedback.    |

## Configuration

Copy `.env.example` to `.env.local` for development (`npm run dev` loads it automatically), and set
the same names as secrets on your host for production. Never prefix them with `VITE_`, which would
bundle them into the browser.

| Variable           | Required | Purpose                                                           |
| ------------------ | -------- | ----------------------------------------------------------------- |
| `SMTP_USER`        | Yes      | The mailbox address the site logs in as. Also the sender address. |
| `SMTP_PASS`        | Yes      | That mailbox's password.                                          |
| `SMTP_HOST`        | No       | Defaults to `mail.privateemail.com`.                              |
| `SMTP_PORT`        | No       | Defaults to `465`. Must be a port that uses TLS from the start.   |
| `CONTACT_TO_EMAIL` | No       | Where inquiries land. Defaults to `info@netswagger.org`.          |

Steps:

1. Choose the mailbox the site sends from. A separate mailbox such as `website@netswagger.org` is
   safest, if your Private Email plan has one to spare: the password stored on the server then
   opens only that mailbox, not the inbox customers write to. Using `info@netswagger.org` itself
   also works.
2. Put its address and password in `.env.local` as `SMTP_USER` and `SMTP_PASS`.
3. Add the same values as secrets on the production host. On Cloudflare that is
   `npx wrangler secret put SMTP_PASS` (and the same for `SMTP_USER`), or the dashboard.

The sender is always `SMTP_USER`, because the mail server only lets a mailbox send as itself. The
visitor's address is set as `Reply-To`, so replying from the inbox reaches them directly. If you
change the mailbox password in Namecheap, update it in both places or the form will start failing.

## Behavior

- Required: first name, last name, email, and message. Optional: phone, company, subject, service,
  and budget. The schema runs in the browser and again on the server, which is the check that counts.
- A field shows its error when you leave it after editing it, and every field is checked on submit.
  On submit, focus moves to the first invalid field.
- While sending, fields are locked and the button shows a spinner. Repeat clicks and Enter presses
  are ignored, because a ref is set synchronously, so a double click cannot slip through.
- Success appears only after the mail server accepts the message, and the form is cleared at that
  point. Once accepted, a slow goodbye from the server is not treated as a failure, so the visitor
  is never prompted to send the same inquiry twice.
- On failure the entered values are kept so the visitor can retry, and the form shows: "We couldn't
  send your message. Please try again or contact us directly at `info@netswagger.org`."
- Sending the identical request twice is blocked with a notice. This is in memory only and resets on
  reload.
- A hidden honeypot field is checked in the browser and again on the server. A bot that fills it is
  told the message was sent, and nothing is delivered.

## Notes on safety

- The schema rejects control characters in single-line fields, and the message builder strips line
  breaks from headers and encodes the subject, so a crafted field cannot inject extra mail headers.
- Everything the visitor types is HTML-escaped before it reaches the email body.
- Failures return a bare `{ ok: false }` to the browser. The reason (a wrong password, a refused
  message, a timeout) goes to the server log only, and never includes the password.
- There is no rate limiting yet. If the form attracts spam, add it in front of the server function;
  the honeypot alone only stops naive bots. Namecheap also limits how much a mailbox may send.

## Verification

```sh
npm run test:contact   # schema, email format, and SMTP tests
npx tsc --noEmit
npm run build
```

`tests/smtp.test.ts` runs the full SMTP exchange against a local fake server, including a refused
login, a refused message, a timeout, and a dropped connection. No real mail is sent.

To confirm the mail code never reaches the browser, build and search the client output. It should
print nothing:

```sh
grep -rE "privateemail|SMTP_PASS|AUTH PLAIN" .output/public/
```

End-to-end delivery needs the real password. With it in `.env.local`, run `npm run dev`, submit the
form, and confirm the message arrives at `info@netswagger.org`.

# Consultation form

The homepage consultation form runs entirely in the browser. There is no backend, API route, database, or email provider. Submitting a valid form simulates delivery (about 1.2 seconds), shows "Thank you! We received your request and will get back to you soon.", and clears the form.

**Nothing is delivered yet.** Connect a real service (below) before relying on the form for inquiries.

## Structure

| File                                 | Responsibility                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `src/lib/contact-schema.ts`          | Zod schema, field limits, dropdown options, and error messages. Reusable by a future backend.             |
| `src/lib/contact-submit.ts`          | `submitContactRequest`, the single swap point for delivery. Currently a simulated submitter.              |
| `src/components/contact-section.tsx` | UI, inline validation, loading state, focus management, duplicate prevention, and success/error feedback. |

## Behavior

- Required: first name, last name, email, and message. Optional: phone, company, subject, service, and budget.
- Email must be a complete address such as `name@company.com`. Phone, when given, may contain digits, spaces, and `+ ( ) . -`, and must have 7–15 digits.
- A field shows its error when you leave it after editing it, and every field is checked on submit. Errors clear as soon as the value is fixed. On submit, focus moves to the first invalid field.
- While sending, fields are locked and the button shows a spinner. Repeat clicks and Enter presses are ignored.
- Sending exactly the same request again after it succeeded is blocked with a notice. This check is in memory only and resets on page reload.
- A hidden honeypot field stops simple bots before delivery.

## Connecting a real email service

Replace the `submitContactRequest` export at the bottom of `src/lib/contact-submit.ts`. The form component needs no changes. The contract is:

- Resolve when the request is accepted.
- Throw `ContactSubmitError(message, fieldErrors?)` for rejections the visitor should see. The message appears above the submit button, and field errors appear inline.
- Any other thrown error shows a generic "couldn't confirm your submission" message with the email and phone fallback.

```ts
export const submitContactRequest: ContactSubmitter = async (data) => {
  const response = await fetch("https://your-form-endpoint.example", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok)
    throw new ContactSubmitError(
      "We couldn't send your request. Please try again or contact us directly.",
    );
};
```

Before going live:

- Never put secret API keys in browser code. Services that accept a public form ID can be called directly. Anything that needs a secret key requires a server or serverless function.
- Validate again on the receiving side (`contactSchema` can be reused). Client-side validation, the honeypot, and the duplicate check can all be bypassed, so add server-side spam protection and rate limiting too.

## Verification

Run `npm run test:contact`, `npx tsc --noEmit`, and `npm run build`. The tests cover required fields, email and phone rules, error messages, and the simulated submitter. They make no network requests.

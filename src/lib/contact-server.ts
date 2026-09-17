import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema.ts";
import { contactEmail } from "./contact-email.ts";
import { sendMail } from "./smtp.server.ts";

/**
 * Delivery result handed back to the browser. Deliberately coarse: the visitor is told whether the
 * message went out, never why it didn't. Reasons (a wrong password, a refused message) are for the
 * server log, not for a stranger's browser.
 */
export type ContactDeliveryResult = { ok: boolean };

/** Namecheap Private Email, which hosts netswagger.org mail. */
const defaultHost = "mail.privateemail.com";
const defaultPort = 465;
const defaultTo = "info@netswagger.org";

/**
 * Sends the inquiry by logging in to the NetSwagger mailbox over SMTP.
 *
 * This is a server function: the body runs on the server only and is never bundled into the client,
 * so the mailbox password stays out of the browser. `createCsrfMiddleware` in src/start.ts already
 * guards server functions against cross-site calls. See docs/contact-setup.md for the settings.
 */
export const sendContactEmail = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<ContactDeliveryResult> => {
    // The honeypot is re-checked here because the browser check can be bypassed. Report success so
    // a bot learns nothing, but send nothing.
    if (data.website) return { ok: true };

    const user = process.env["SMTP_USER"];
    const pass = process.env["SMTP_PASS"];
    if (!user || !pass) {
      console.error(
        "Contact form is not configured: set SMTP_USER and SMTP_PASS. See docs/contact-setup.md.",
      );
      return { ok: false };
    }
    const host = process.env["SMTP_HOST"] || defaultHost;
    const port = Number(process.env["SMTP_PORT"] || defaultPort);
    const to = process.env["CONTACT_TO_EMAIL"] || defaultTo;

    const email = contactEmail(data, new Date());
    try {
      await sendMail(
        { host, port, user, pass },
        {
          // Mail servers only let a mailbox send as itself, so the sender is the login address.
          from: { name: "NetSwagger Website", address: user },
          to,
          // So hitting Reply in the inbox answers the visitor, not the website mailbox.
          replyTo: email.replyTo,
          subject: email.subject,
          text: email.text,
          html: email.html,
        },
      );
      return { ok: true };
    } catch (error) {
      console.error("Could not send the inquiry:", error instanceof Error ? error.message : error);
      return { ok: false };
    }
  });

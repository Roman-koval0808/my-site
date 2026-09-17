import type { ContactValues } from "./contact-schema.ts";

/** The detail fields, in the order NetSwagger reads them. `message` is rendered separately. */
const labels: [Exclude<keyof ContactValues, "message" | "website">, string][] = [
  ["firstName", "First name"],
  ["lastName", "Last name"],
  ["email", "Email"],
  ["phone", "Phone number"],
  ["company", "Company name"],
  ["subject", "Subject"],
  ["service", "Service interested in"],
  ["budget", "Project budget"],
];

/** Shown for optional fields the visitor left blank, so the layout stays readable. */
const blank = "—";

export function contactSubject(data: ContactValues) {
  return `New Website Inquiry — ${data.firstName} ${data.lastName}`;
}

/**
 * Eastern time, matching where NetSwagger is. Workers runtimes have shipped full ICU for a while,
 * but a runtime without the time zone data would throw here, and a contact email is not worth
 * losing over a date format — so fall back to the ISO timestamp.
 */
function formatTimestamp(at: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "short",
      timeZoneName: "short",
    }).format(at);
  } catch {
    return at.toISOString();
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Builds the inquiry email. Pure and side-effect free so it can be unit tested without sending
 * anything. Every value is escaped for the HTML part; the schema has already rejected the CR/LF
 * that would otherwise allow header injection through the subject.
 */
export function contactEmail(data: ContactValues, submittedAt: Date) {
  const rows = labels.map(([key, label]) => [label, data[key].trim() || blank] as const);
  const stamp = formatTimestamp(submittedAt);

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    `Submitted: ${stamp}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const cells = rows
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:6px 16px 6px 0;color:#716960;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#2c2a26;font-size:14px">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join("");

  const html = [
    `<div style="margin:0;padding:24px;background:#faf7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">`,
    `<div style="max-width:560px;margin:0 auto;background:#fdfdfb;border:1px solid #e3e4dd;border-radius:12px;padding:28px">`,
    `<h1 style="margin:0 0 4px;font-size:18px;color:#2c2a26">New website inquiry</h1>`,
    `<p style="margin:0 0 20px;font-size:13px;color:#716960">${escapeHtml(stamp)}</p>`,
    `<table style="width:100%;border-collapse:collapse">${cells}</table>`,
    `<p style="margin:24px 0 6px;font-size:13px;color:#716960">Message</p>`,
    `<div style="white-space:pre-wrap;font-size:14px;line-height:1.7;color:#2c2a26">${escapeHtml(data.message)}</div>`,
    `</div></div>`,
  ].join("");

  return { subject: contactSubject(data), text, html, replyTo: data.email };
}

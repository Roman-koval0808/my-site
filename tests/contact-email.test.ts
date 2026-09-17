import assert from "node:assert/strict";
import { test } from "node:test";
import { emptyContact } from "../src/lib/contact-schema.ts";
import type { ContactValues } from "../src/lib/contact-schema.ts";
import { contactEmail, contactSubject } from "../src/lib/contact-email.ts";

const valid: ContactValues = {
  ...emptyContact,
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "336-298-6469",
  company: "Example Co",
  subject: "New app",
  service: "Web Development",
  budget: "$10,000–$25,000",
  message: "Line one.\nLine two.",
};
const at = new Date("2026-09-16T15:04:05Z");

test("the subject follows the required format", () => {
  assert.equal(contactSubject(valid), "New Website Inquiry — Ada Lovelace");
  assert.equal(contactEmail(valid, at).subject, "New Website Inquiry — Ada Lovelace");
});

test("every submitted field and the timestamp reach the text body", () => {
  const { text } = contactEmail(valid, at);
  for (const value of [
    "Ada",
    "Lovelace",
    "ada@example.com",
    "336-298-6469",
    "Example Co",
    "New app",
    "Web Development",
    "$10,000–$25,000",
    "Line one.",
    "Line two.",
  ])
    assert.ok(text.includes(value), `missing from email: ${value}`);
  assert.match(text, /Submitted: .+/);
});

test("blank optional fields render as a dash instead of an empty value", () => {
  const bare = { ...emptyContact, firstName: "A", lastName: "B", email: "a@b.co", message: "Hi" };
  const { text } = contactEmail(bare, at);
  assert.ok(text.includes("Phone number: —"));
  assert.ok(text.includes("Company name: —"));
  assert.ok(text.includes("Project budget: —"));
});

test("the visitor's address becomes the reply-to", () => {
  assert.equal(contactEmail(valid, at).replyTo, "ada@example.com");
});

test("visitor text cannot inject markup into the html part", () => {
  const hostile = {
    ...valid,
    company: 'Ex & <script>alert("x")</script>',
    message: "<b>hi</b>",
  };
  const { html } = contactEmail(hostile, at);
  assert.ok(!html.includes("<script>"), "raw script tag reached the html body");
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("&lt;b&gt;hi&lt;/b&gt;"));
  assert.ok(html.includes("&amp;"));
});

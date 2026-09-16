import assert from "node:assert/strict";
import { test } from "node:test";
import { contactSchema, emptyContact, fieldErrors } from "../src/lib/contact-schema.ts";
import type { ContactValues } from "../src/lib/contact-schema.ts";
import { ContactSubmitError, createSimulatedSubmitter } from "../src/lib/contact-submit.ts";

const valid: ContactValues = {
  ...emptyContact,
  firstName: "Test",
  lastName: "Person",
  email: "test@example.com",
  phone: "+1 (336) 298-6469",
  company: "Example Co",
  subject: "Test project",
  service: "Web Development",
  budget: "$10,000–$25,000",
  message: "A test inquiry.",
};
function errorsFor(data: ContactValues) {
  const result = contactSchema.safeParse(data);
  return result.success ? {} : fieldErrors(result.error);
}

test("an empty form reports every required field and no optional ones", () => {
  assert.deepEqual(Object.keys(errorsFor(emptyContact)).sort(), [
    "email",
    "firstName",
    "lastName",
    "message",
  ]);
  assert.deepEqual(
    errorsFor({ ...emptyContact, firstName: "A", lastName: "B", email: "a@b.co", message: "Hi" }),
    {},
  );
});

test("whitespace-only required fields are rejected and values are trimmed", () => {
  const errors = errorsFor({ ...valid, firstName: "  ", lastName: "\t", message: "   " });
  assert.equal(errors.firstName, "Please enter your first name.");
  assert.equal(errors.lastName, "Please enter your last name.");
  assert.equal(errors.message, "Please tell us how we can help you.");
  const parsed = contactSchema.parse({
    ...valid,
    firstName: "  Test ",
    email: " test@example.com ",
  });
  assert.equal(parsed.firstName, "Test");
  assert.equal(parsed.email, "test@example.com");
});

test("email must be a complete address, with a distinct message when missing", () => {
  assert.equal(errorsFor({ ...valid, email: "" }).email, "Please enter your email address.");
  for (const email of [
    "test",
    "test@",
    "@example.com",
    "test@example",
    "te st@example.com",
    "test@@example.com",
    "test@example..com",
  ])
    assert.equal(
      errorsFor({ ...valid, email }).email,
      "Please enter a valid email address, like name@company.com.",
      email,
    );
  for (const email of ["name@example.com", "first.last+tag@mail.example.co.uk"])
    assert.equal(errorsFor({ ...valid, email }).email, undefined, email);
});

test("phone is optional but must be a plausible number when given", () => {
  for (const phone of ["", "336-298-6469", "+1 (336) 298-6469", "336.298.6469", "+44 20 7946 0958"])
    assert.equal(errorsFor({ ...valid, phone }).phone, undefined, phone);
  for (const phone of ["123", "call me", "336-298-646x", "1234567890123456", "++1 336 298 6469"])
    assert.ok(errorsFor({ ...valid, phone }).phone, phone);
});

test("rejects unknown dropdown values and multi-line single-line fields", () => {
  assert.ok(errorsFor({ ...valid, service: "Invented" as ContactValues["service"] }).service);
  assert.ok(errorsFor({ ...valid, subject: "Hello\r\nBcc: attacker@example.com" }).subject);
});

test("the simulated submitter waits, then resolves without any network request", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Must not send");
  });
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let settled = false;
  const pending = createSimulatedSubmitter(1200)(valid).then(() => {
    settled = true;
  });
  t.mock.timers.tick(1199);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false);
  t.mock.timers.tick(1);
  await pending;
  assert.equal(settled, true);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("the simulated submitter rejects invalid data with field errors", async () => {
  await assert.rejects(
    createSimulatedSubmitter(0)({ ...valid, email: "invalid", message: "" }),
    (error) => {
      assert.ok(error instanceof ContactSubmitError);
      assert.ok(error.fieldErrors.email);
      assert.ok(error.fieldErrors.message);
      return true;
    },
  );
});

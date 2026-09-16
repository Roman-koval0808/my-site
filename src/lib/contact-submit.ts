import { contactSchema, fieldErrors } from "./contact-schema.ts";
import type { ContactErrors, ContactValues } from "./contact-schema.ts";

/**
 * Delivers a validated consultation request.
 * Resolve when the request is accepted. Throw ContactSubmitError with a visitor-facing message
 * (and optional field errors) when it is rejected. Any other error shows a generic fallback.
 */
export type ContactSubmitter = (data: ContactValues) => Promise<void>;

export class ContactSubmitError extends Error {
  readonly fieldErrors: ContactErrors;
  constructor(message: string, errors: ContactErrors = {}) {
    super(message);
    this.name = "ContactSubmitError";
    this.fieldErrors = errors;
  }
}

/** Frontend-only stand-in for a delivery service. Nothing is sent, stored, or logged. */
export function createSimulatedSubmitter(delayMs = 1200): ContactSubmitter {
  return async (data) => {
    // Re-check the payload the way a real endpoint would.
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success)
      throw new ContactSubmitError(
        "Please check the highlighted fields and try again.",
        fieldErrors(parsed.error),
      );
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  };
}

// Swap point: replace with a ContactSubmitter that calls your email service or API.
export const submitContactRequest: ContactSubmitter = createSimulatedSubmitter();

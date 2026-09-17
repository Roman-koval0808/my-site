import { contactSchema, fieldErrors } from "./contact-schema.ts";
import { ContactSubmitError } from "./contact-submit.ts";
import type { ContactSubmitter } from "./contact-submit.ts";
import { sendContactEmail } from "./contact-server.ts";

export const deliveryFailure =
  "We couldn't send your message. Please try again or contact us directly at info@netswagger.org.";

/**
 * Real delivery. Resolves only once the server function confirms the email was accepted, so the
 * success panel can never appear for a message that was not sent.
 */
export const submitContactRequest: ContactSubmitter = async (data) => {
  // Re-checked here so a malformed payload surfaces as inline field errors rather than a generic
  // failure from the server.
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success)
    throw new ContactSubmitError(
      "Please check the highlighted fields and try again.",
      fieldErrors(parsed.error),
    );

  let result;
  try {
    result = await sendContactEmail({ data: parsed.data });
  } catch (error) {
    console.error(error);
    throw new ContactSubmitError(deliveryFailure);
  }
  if (!result.ok) throw new ContactSubmitError(deliveryFailure);
};

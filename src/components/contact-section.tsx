import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  Linkedin,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import {
  contactBudgets,
  contactSchema,
  contactServices,
  contactSuccess,
  emptyContact,
  fieldErrors,
} from "@/lib/contact-schema";
import type { ContactErrors, ContactValues } from "@/lib/contact-schema";
import { ContactSubmitError } from "@/lib/contact-submit";
import { deliveryFailure, submitContactRequest } from "@/lib/contact-delivery";
import { TrustpilotWidget } from "@/components/trustpilot-widget";

const textFields = [
  {
    name: "firstName",
    label: "First Name",
    required: true,
    type: "text",
    autoComplete: "given-name",
    maxLength: 80,
  },
  {
    name: "lastName",
    label: "Last Name",
    required: true,
    type: "text",
    autoComplete: "family-name",
    maxLength: 80,
  },
  {
    name: "email",
    label: "Email Address",
    required: true,
    type: "email",
    autoComplete: "email",
    maxLength: 254,
  },
  {
    name: "phone",
    label: "Phone Number",
    required: false,
    type: "tel",
    autoComplete: "tel",
    maxLength: 40,
  },
  {
    name: "company",
    label: "Company Name",
    required: false,
    type: "text",
    autoComplete: "organization",
    maxLength: 160,
  },
  {
    name: "subject",
    label: "Subject",
    required: false,
    type: "text",
    autoComplete: "off",
    maxLength: 160,
  },
] as const;
// Visual order, used to focus the first invalid field.
const fieldOrder: (keyof ContactValues)[] = [
  ...textFields.map((field) => field.name),
  "service",
  "budget",
  "message",
];
const genericFailure = deliveryFailure;
const blockedFailure = "We couldn't submit this request. Please contact us by email or phone.";
const duplicateNotice =
  "You've already sent this request, and we'll get back to you soon. To send a new one, change your details first.";

function FieldError({ name, message }: { name: keyof ContactValues; message: string | undefined }) {
  return message ? (
    <p className="field-error" id={`contact-${name}-error`}>
      <CircleAlert size={14} aria-hidden="true" />
      {message}
    </p>
  ) : null;
}

export function ContactSection() {
  const [values, setValues] = useState<ContactValues>({ ...emptyContact });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  // Refs update synchronously, so double clicks and repeated Enter presses can't slip through.
  const locked = useRef(false);
  const attempted = useRef(false);
  const edited = useRef(new Set<keyof ContactValues>());
  // In-memory fingerprint of the last accepted request, used to block identical resubmissions.
  const lastSent = useRef("");
  const focusNext = useRef<(() => HTMLElement | null | undefined) | null>(null);

  // Focus after the render that shows the target, so it is mounted and enabled.
  useEffect(() => {
    const target = focusNext.current?.();
    focusNext.current = null;
    target?.focus();
  });

  function control(name: keyof ContactValues) {
    return formRef.current?.elements.namedItem(name) as HTMLElement | null | undefined;
  }
  function validateField(name: keyof ContactValues, data: ContactValues) {
    const result = contactSchema.safeParse(data);
    const error = result.success ? undefined : fieldErrors(result.error)[name];
    setErrors((previous) => {
      if (previous[name] === error) return previous;
      const copy = { ...previous };
      if (error) copy[name] = error;
      else delete copy[name];
      return copy;
    });
  }
  function change(name: keyof ContactValues, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    edited.current.add(name);
    if (failure) setFailure("");
    // A field that already shows an error is re-checked while typing, so it clears once fixed.
    if (errors[name]) validateField(name, next);
  }
  function blur(name: keyof ContactValues) {
    // Skip untouched fields so tabbing through the form doesn't flag them.
    if (attempted.current || edited.current.has(name)) validateField(name, values);
  }
  function showProblem(nextErrors: ContactErrors, message = "") {
    const first = fieldOrder.find((name) => nextErrors[name]);
    focusNext.current = () => (first ? control(first) : submitRef.current);
    setErrors({ ...nextErrors });
    setFailure(message);
    setStatus("idle");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    attempted.current = true;
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) return showProblem(fieldErrors(parsed.error));
    // Bots that fill the hidden field never reach the delivery service.
    if (parsed.data.website) return showProblem({}, blockedFailure);
    const fingerprint = JSON.stringify({ ...parsed.data, email: parsed.data.email.toLowerCase() });
    if (fingerprint === lastSent.current) return showProblem({}, duplicateNotice);
    locked.current = true;
    setErrors({});
    setFailure("");
    setStatus("submitting");
    try {
      await submitContactRequest(parsed.data);
      lastSent.current = fingerprint;
      attempted.current = false;
      edited.current.clear();
      focusNext.current = () => successRef.current;
      setValues({ ...emptyContact });
      setStatus("success");
    } catch (error) {
      if (error instanceof ContactSubmitError) showProblem(error.fieldErrors, error.message);
      else showProblem({}, genericFailure);
    } finally {
      locked.current = false;
    }
  }
  const busy = status === "submitting";
  return (
    <section
      id="contact"
      className="shell consultation-section"
      aria-labelledby="consultation-heading"
    >
      <div className="consultation-layout">
        <div className="consultation-intro">
          <p className="eyebrow">
            <span />
            FREE CONSULTATION & ESTIMATE
          </p>
          <h2 id="consultation-heading">
            Let's build
            <br />
            <span>something great.</span>
          </h2>
          <p className="consultation-lead">
            Let's become a team together and create success. Tell us about your idea, and let's
            explore what's possible.
          </p>
          <div className="consultation-promise">
            <span>
              <Check size={17} />
            </span>
            <p>
              We focus on your project
              <br />
              <strong>like it's our own.</strong>
            </p>
          </div>
          <TrustpilotWidget />
          <div className="consultation-details">
            <p className="consultation-detail-title">Prefer to speak to someone now?</p>
            <a href="tel:+13362986469">
              <Phone size={19} strokeWidth={1.5} />
              <span>
                <small>GIVE US A CALL</small>336-298-6469
              </span>
              <ArrowUpRight size={16} />
            </a>
            <a href="mailto:info@netswagger.org">
              <Mail size={19} strokeWidth={1.5} />
              <span>
                <small>SEND US AN EMAIL</small>info@netswagger.org
              </span>
              <ArrowUpRight size={16} />
            </a>
            <a href="https://www.linkedin.com/company/netswagger" target="_blank" rel="noreferrer">
              <Linkedin size={19} strokeWidth={1.5} />
              <span>
                <small>FOLLOW US</small>NetSwagger on LinkedIn
              </span>
              <ArrowUpRight size={16} />
            </a>
            <a
              href="https://www.trustpilot.com/review/netswagger.org"
              target="_blank"
              rel="noreferrer"
            >
              <Star size={19} strokeWidth={1.5} />
              <span>
                <small>READ OUR REVIEWS</small>NetSwagger on Trustpilot
              </span>
              <ArrowUpRight size={16} />
            </a>
            <address>
              <MapPin size={19} strokeWidth={1.5} />
              <span>
                <small>FIND US</small>NetSwagger Enterprises LLC
                <br />
                5762 Tomahawk Rd
                <br />
                Winston-Salem, NC 27106
              </span>
            </address>
          </div>
        </div>
        <div className="consultation-form-panel">
          {status === "success" ? (
            <div
              className="consultation-success"
              ref={successRef}
              tabIndex={-1}
              role="group"
              aria-labelledby="consultation-success-heading"
              aria-describedby="consultation-success-message"
            >
              <span className="success-icon" aria-hidden="true">
                <Check size={28} />
              </span>
              <h3 id="consultation-success-heading">You're on our radar.</h3>
              <p id="consultation-success-message">{contactSuccess}</p>
              <button
                type="button"
                className="button button-outline"
                onClick={() => {
                  focusNext.current = () => control("firstName");
                  setStatus("idle");
                }}
              >
                Send another request <ArrowUpRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="consultation-form-heading">
                <h3>Tell us about your project</h3>
                <p>A great working relationship starts here.</p>
              </div>
              <p className="required-note">
                Fields marked <span aria-hidden="true">*</span>
                <span className="sr-only">with an asterisk</span> are required.
              </p>
              <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy}>
                <fieldset disabled={busy} className="consultation-fields">
                  <legend className="sr-only">Your contact and project details</legend>
                  {textFields.map((field) => (
                    <div className="consultation-field" key={field.name}>
                      <label htmlFor={`contact-${field.name}`}>
                        {field.label}
                        {field.required ? (
                          <span aria-hidden="true"> *</span>
                        ) : (
                          <small> Optional</small>
                        )}
                      </label>
                      <input
                        id={`contact-${field.name}`}
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        autoCapitalize={field.type === "email" ? "none" : undefined}
                        spellCheck={field.type === "email" ? false : undefined}
                        maxLength={field.maxLength}
                        required={field.required}
                        value={values[field.name]}
                        onChange={(event) => change(field.name, event.target.value)}
                        onBlur={() => blur(field.name)}
                        aria-invalid={!!errors[field.name]}
                        aria-describedby={
                          errors[field.name] ? `contact-${field.name}-error` : undefined
                        }
                      />
                      <FieldError name={field.name} message={errors[field.name]} />
                    </div>
                  ))}
                  <div className="consultation-field">
                    <label htmlFor="contact-service">
                      Service Interested In <small>Optional</small>
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={values.service}
                      onChange={(event) => change("service", event.target.value)}
                      onBlur={() => blur("service")}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? "contact-service-error" : undefined}
                    >
                      <option value="">Select a service</option>
                      {contactServices.map((service) => (
                        <option key={service}>{service}</option>
                      ))}
                    </select>
                    <FieldError name="service" message={errors.service} />
                  </div>
                  <div className="consultation-field">
                    <label htmlFor="contact-budget">
                      Project Budget <small>Optional</small>
                    </label>
                    <select
                      id="contact-budget"
                      name="budget"
                      value={values.budget}
                      onChange={(event) => change("budget", event.target.value)}
                      onBlur={() => blur("budget")}
                      aria-invalid={!!errors.budget}
                      aria-describedby={errors.budget ? "contact-budget-error" : undefined}
                    >
                      <option value="">Select a range (USD)</option>
                      {contactBudgets.map((budget) => (
                        <option key={budget}>{budget}</option>
                      ))}
                    </select>
                    <FieldError name="budget" message={errors.budget} />
                  </div>
                  <div className="consultation-field consultation-message">
                    <label htmlFor="contact-message">
                      How can we help you? <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      maxLength={5000}
                      required
                      placeholder="Tell us a little about your idea, your goals, and what you have in mind."
                      value={values.message}
                      onChange={(event) => change("message", event.target.value)}
                      onBlur={() => blur("message")}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                    />
                    <FieldError name="message" message={errors.message} />
                  </div>
                  <div className="consultation-honeypot" aria-hidden="true">
                    <label htmlFor="contact-website">Leave this field empty</label>
                    <input
                      id="contact-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={(event) => change("website", event.target.value)}
                    />
                  </div>
                </fieldset>
                {failure && (
                  <div className="consultation-error" role="alert">
                    <CircleAlert size={18} aria-hidden="true" />
                    <div>
                      <p>{failure}</p>
                      <a href="mailto:info@netswagger.org">
                        Email us directly <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                )}
                {/* aria-disabled keeps keyboard focus on the button while sending. */}
                <button
                  ref={submitRef}
                  className="button consultation-submit"
                  type="submit"
                  aria-disabled={busy}
                >
                  {busy ? (
                    <>
                      <LoaderCircle size={18} className="submit-spinner" aria-hidden="true" />
                      Sending your request…
                    </>
                  ) : (
                    <>
                      Get My Free Consultation <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
                <p className="consultation-privacy">
                  We'll use your information to respond to your inquiry.{" "}
                  <a href="https://www.netswagger.org/privacy-policy">Privacy policy</a>
                </p>
              </form>
            </>
          )}
          <p role="status" className="sr-only">
            {busy ? "Sending your consultation request. Please wait." : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

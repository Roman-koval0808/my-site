import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { findPayee, type Payee } from "@/lib/payees";

export const Route = createFileRoute("/freelancer/$uuid")({
  loader: ({ params }) => {
    const payee = findPayee(params.uuid);
    if (!payee) throw notFound();
    return payee;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} · ${loaderData.layout === "profile" ? "Contact details" : "Payment details"} | NetSwagger`
          : "Contact details | NetSwagger",
      },
      {
        name: "description",
        content: "Professional profile and contact details published by NetSwagger.",
      },
      // Personal contact details don't belong in a search index. Left crawlable
      // on purpose: a robots.txt block would stop crawlers reading this tag.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PayeeRecord,
  notFoundComponent: MissingRecord,
});

type Detail = {
  key: string;
  label: string;
  /** One entry per rendered line. */
  lines: string[];
  href?: string;
};

function detailsFor(payee: Payee): Detail[] {
  return [
    {
      key: "phone",
      label: "Phone",
      lines: [payee.phone],
      href: `tel:${payee.phone.replace(/\s/g, "")}`,
    },
    {
      key: "email",
      label: "Email",
      lines: [payee.email],
      href: `mailto:${payee.email}`,
    },
    ...(payee.companyEmail
      ? [
          {
            key: "companyEmail",
            label: "Company email",
            lines: [payee.companyEmail],
            href: `mailto:${payee.companyEmail}`,
          },
        ]
      : []),
    { key: "address", label: "Address", lines: payee.address },
    ...(payee.skills?.length ? [{ key: "skills", label: "Skills", lines: payee.skills }] : []),
    { key: "company", label: "Company", lines: [payee.company] },
  ];
}

/** Falls back to a generated line so a record reads well without hand-written copy. */
function summaryFor(payee: Payee) {
  if (payee.summary) return payee.summary;
  return `${payee.name} is a ${payee.role.toLowerCase()} for ${payee.company}. The details below are the current ones on file`;
}

/**
 * Tracks which value was last copied, so its button can confirm it. `key` is
 * empty when the clipboard is unavailable; `note` is what gets announced.
 */
function useCopy() {
  const [state, setState] = useState({ key: "", note: "" });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(key: string, label: string, text: string) {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setState({ key, note: `${label} copied.` });
      timer.current = setTimeout(() => setState({ key: "", note: "" }), 2400);
    } catch {
      // Clipboard access can be blocked; the text stays selectable on the page.
      setState({
        key: "",
        note: `Couldn't copy ${label.toLowerCase()}. Select the text to copy it.`,
      });
    }
  }

  return { copied: state.key, note: state.note, copy };
}

function PageHeader() {
  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <Link to="/" aria-label="NetSwagger home">
          <Brand />
        </Link>
        <Link to="/" className="text-link payee-back">
          <ArrowLeft size={16} /> Back to website
        </Link>
      </nav>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="site-footer payee-footer">
      <div className="shell footer-bottom">
        <span>© 2026 NetSwagger Enterprises LLC. All rights reserved.</span>
        <a href="https://www.netswagger.org/privacy-policy">Privacy policy</a>
        <a href="mailto:info@netswagger.org">info@netswagger.org</a>
      </div>
    </footer>
  );
}

const capabilities = [
  { icon: Cloud, name: "Scalable Systems", description: "Building for growth" },
  { icon: Database, name: "Cloud Infrastructure", description: "Modern & reliable" },
  { icon: Cpu, name: "AI Integrations", description: "Turning ideas into impact" },
  { icon: ShieldCheck, name: "Reliable Software", description: "Secure by design" },
];
const contactIcons = {
  phone: Phone,
  email: Mail,
  companyEmail: Mail,
  address: MapPin,
  company: Building2,
  skills: Code2,
};

function PayeeRecord() {
  const payee = Route.useLoaderData();
  return payee.layout === "profile" ? <ProfileRecord /> : <PaymentRecord />;
}
function PaymentRecord() {
  const payee = Route.useLoaderData();
  const { copied, note, copy } = useCopy();
  const details = detailsFor(payee);
  const everything = [
    `${payee.name} — ${payee.role}, ${payee.company}`,
    ...details.map((detail) => `${detail.label}: ${detail.lines.join(", ")}`),
    `PID: ${payee.id}`,
  ].join("\n");

  return (
    <div className="site payee">
      <a className="skip-link" href="#record">
        Skip to payment details
      </a>
      <PageHeader />
      <main className="payee-main">
        <article className="payee-sheet" id="record" aria-labelledby="payee-name">
          <div className="payee-meta">
            <p className="payee-reference">
              <small>PID</small>
              <span>{payee.id}</span>
            </p>
          </div>
          <h1 id="payee-name">{payee.name}</h1>
          <p className="payee-role">
            {payee.role} at <strong>{payee.company}</strong>
          </p>
          <p className="payee-summary">{summaryFor(payee)}</p>
          <div className="payee-actions">
            <button
              type="button"
              className="button button-outline button-small payee-copy-all"
              onClick={() => copy("all", "All details", everything)}
            >
              {copied === "all" ? (
                <>
                  <Check size={15} aria-hidden="true" /> Copied
                </>
              ) : (
                <>
                  <Copy size={15} aria-hidden="true" /> Copy all details
                </>
              )}
            </button>
          </div>
          <dl className="payee-table">
            {details.map((detail) => {
              const done = copied === detail.key;
              return (
                <div className="payee-line" key={detail.key}>
                  <dt>{detail.label}</dt>
                  <dd>
                    {detail.href ? (
                      <a className="payee-value" href={detail.href}>
                        {detail.lines[0]}
                      </a>
                    ) : (
                      <span className="payee-value">
                        {detail.lines.map((line, index) => (
                          <Fragment key={line}>
                            {index > 0 && <br />}
                            {line}
                          </Fragment>
                        ))}
                      </span>
                    )}
                    <button
                      type="button"
                      className={`payee-copy${done ? " is-copied" : ""}`}
                      onClick={() => copy(detail.key, detail.label, detail.lines.join(", "))}
                      aria-label={`Copy ${detail.label.toLowerCase()}`}
                    >
                      {done ? (
                        <Check size={16} aria-hidden="true" />
                      ) : (
                        <Copy size={16} aria-hidden="true" />
                      )}
                    </button>
                  </dd>
                </div>
              );
            })}
          </dl>
        </article>
      </main>
      <p role="status" className="sr-only">
        {note}
      </p>
      <PageFooter />
    </div>
  );
}

function ProfileRecord() {
  const payee = Route.useLoaderData();
  const { copied, note, copy } = useCopy();
  const details = detailsFor(payee);

  return (
    <div className="site payee profile-page">
      <a className="skip-link" href="#record">
        Skip to contact details
      </a>
      <div className="profile-photo" aria-hidden="true" />
      <PageHeader />
      <main className="profile-shell profile-main" id="record">
        <article className="profile-intro" aria-labelledby="payee-name">
          <p className="profile-eyebrow">
            Scalable systems <b>•</b> Cloud infrastructure <b>•</b> AI integrations
          </p>
          <h1 id="payee-name">{payee.name}</h1>
          <p className="profile-role">
            {payee.role}
            <br />
            {payee.company}
          </p>
          <p className="profile-summary">{summaryFor(payee)}</p>
          <ul className="profile-capabilities">
            {capabilities.map(({ icon: Icon, name, description }) => (
              <li key={name}>
                <span className="profile-icon">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <div>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </div>
              </li>
            ))}
          </ul>
          <div className="profile-company">
            <span className="profile-company-icon">
              <Building2 size={31} aria-hidden="true" />
            </span>
            <div>
              <p className="profile-eyebrow">Company</p>
              <strong>{payee.company}</strong>
              <p>Building secure, scalable digital systems.</p>
            </div>
          </div>
        </article>
        <section className="profile-contact" aria-labelledby="contact-heading">
          <p className="profile-eyebrow">Contact information</p>
          <h2 id="contact-heading">Get in touch with {payee.name.split(" ")[0]}</h2>
          <dl>
            {details.map((detail) => {
              const Icon = contactIcons[detail.key as keyof typeof contactIcons];
              const done = copied === detail.key;
              return (
                <div className="profile-contact-row" key={detail.key}>
                  <span className="profile-icon">
                    <Icon size={23} aria-hidden="true" />
                  </span>
                  <div className="profile-contact-value">
                    <dt>{detail.label}</dt>
                    <dd>
                      {detail.key === "skills" ? (
                        <ul className="profile-skills">
                          {detail.lines.map((skill) => (
                            <li key={skill}>{skill}</li>
                          ))}
                        </ul>
                      ) : detail.href ? (
                        <a href={detail.href}>{detail.lines[0]}</a>
                      ) : (
                        detail.lines.map((line, index) => (
                          <Fragment key={line}>
                            {index > 0 && <br />}
                            {line}
                          </Fragment>
                        ))
                      )}
                    </dd>
                  </div>
                  <button
                    type="button"
                    className="profile-copy"
                    onClick={() => copy(detail.key, detail.label, detail.lines.join(", "))}
                    aria-label={
                      done ? detail.label + " copied" : "Copy " + detail.label.toLowerCase()
                    }
                  >
                    {done ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              );
            })}
          </dl>
        </section>
      </main>
      <p role="status" className="sr-only">
        {note}
      </p>
      <PageFooter />
    </div>
  );
}
function MissingRecord() {
  return (
    <div className="site payee">
      <PageHeader />
      <main className="payee-main">
        <div className="payee-sheet payee-missing">
          <h1>This record isn't available.</h1>
          <p>
            The link may be incomplete, or the record may have been taken down. Check the address
            you were sent, and get in touch if you need it again.
          </p>
          <div className="payee-missing-actions">
            <Link to="/" className="button">
              Go to our website <ArrowUpRight size={17} />
            </Link>
            <a className="text-link" href="mailto:info@netswagger.org">
              Email us <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}

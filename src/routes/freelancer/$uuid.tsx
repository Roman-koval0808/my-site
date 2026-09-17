import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy, ShieldAlert } from "lucide-react";
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
          ? `${loaderData.name} · Payment details | NetSwagger`
          : "Payment details | NetSwagger",
      },
      {
        name: "description",
        content: "Payment and contact details published by NetSwagger.",
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
    { key: "address", label: "Address", lines: payee.address },
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

function PayeeRecord() {
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

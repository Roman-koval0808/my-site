import type { CSSProperties, ReactNode } from "react";
import type { TrustSlot } from "@/lib/trust";

/**
 * DEMO ARTWORK — every company and badge below is invented, drawn in code purely so the trust
 * sections can be presented before real assets exist. None of it represents a real organisation,
 * certification body, or client of NetSwagger, and no real trademark is used.
 *
 * Replace one by setting `image` on its slot; `image` always wins over this artwork. Delete this
 * file's import from trust-sections.tsx to fall back to empty placeholder slots.
 */

function Lockup({
  accent,
  name,
  sub,
  stacked,
  wide,
  dot,
  initials,
  symbol,
}: {
  accent: string;
  name: string;
  sub?: string;
  stacked?: boolean;
  wide?: boolean;
  dot?: boolean;
  initials?: string;
  symbol?: ReactNode;
}) {
  return (
    <span className="logo-lockup" style={{ "--accent": accent } as CSSProperties}>
      {symbol && <span className="logo-symbol">{symbol}</span>}
      {initials && (
        <span className="logo-tile">
          <span>{initials}</span>
        </span>
      )}
      <span className={stacked ? "logo-words is-stacked" : "logo-words"}>
        <span className={wide ? "logo-word is-wide" : "logo-word"}>
          {name}
          {dot && <i className="logo-dot" aria-hidden="true" />}
        </span>
        {sub && <span className={stacked ? "logo-sub" : "logo-word-light"}>{sub}</span>}
      </span>
      <span className="sr-only"> (sample logo)</span>
    </span>
  );
}

const symbols = {
  // Healthcare: a rounded tile with a medical cross.
  health: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6.5" fill="currentColor" opacity=".16" />
      <path d="M10 6h4v4h4v4h-4v4h-4v-4H6v-4h4V6Z" fill="currentColor" />
    </svg>
  ),
  // Cloud: stacked planes suggesting layered infrastructure.
  cloud: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 21.5 8 12 13.5 2.5 8 12 2.5Z" fill="currentColor" />
      <path
        d="m3 12.5 9 5.2 9-5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity=".5"
      />
    </svg>
  ),
  // AI: three nodes wired into a triangle.
  ai: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5 5.5 18h13L12 5.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="5.5" r="2.7" fill="currentColor" />
      <circle cx="5.5" cy="18" r="2.7" fill="currentColor" />
      <circle cx="18.5" cy="18" r="2.7" fill="currentColor" />
    </svg>
  ),
  // Logistics: paired chevrons for forward movement.
  freight: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m4 5 7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13 5 7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".42"
      />
    </svg>
  ),
  // Security: a shield split by a single line.
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.2 20.2 5.8v6.4c0 4.6-3.3 8.5-8.2 9.6-4.9-1.1-8.2-5-8.2-9.6V5.8L12 2.2Z"
        fill="currentColor"
        opacity=".16"
      />
      <path
        d="M12 2.2 20.2 5.8v6.4c0 4.6-3.3 8.5-8.2 9.6-4.9-1.1-8.2-5-8.2-9.6V5.8L12 2.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M12 7.2v9.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  // Mobile: a swept wing.
  wing: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3c0 8.2-4.2 13.6-10.6 15.4H4L21 3Z" fill="currentColor" />
      <path d="M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".4" />
    </svg>
  ),
};

/** Twelve invented client companies, two marquee rows of six. */
export const demoClientRows: TrustSlot[][] = [
  [
    {
      id: "northvale",
      name: "Northvale Capital",
      mark: <Lockup accent="#1f4e79" name="Northvale" sub="Capital" />,
    },
    {
      id: "medalink",
      name: "Medalink Health",
      mark: (
        <Lockup accent="#0f766e" name="Medalink" sub="Health" stacked symbol={symbols.health} />
      ),
    },
    {
      id: "cloudspire",
      name: "Cloudspire",
      mark: <Lockup accent="#2563eb" name="Cloudspire" symbol={symbols.cloud} />,
    },
    {
      id: "marketforge",
      name: "Marketforge",
      mark: <Lockup accent="#b45309" name="Marketforge" initials="MF" />,
    },
    {
      id: "neuronix",
      name: "Neuronix",
      mark: <Lockup accent="#6d28d9" name="Neuronix" symbol={symbols.ai} />,
    },
    {
      id: "verstell",
      name: "Verstell Systems",
      mark: <Lockup accent="#334155" name="Verstell" sub="Systems" stacked wide />,
    },
  ],
  [
    {
      id: "portway",
      name: "Portway Logistics",
      mark: (
        <Lockup accent="#0369a1" name="Portway" sub="Logistics" stacked symbol={symbols.freight} />
      ),
    },
    {
      id: "cipherline",
      name: "Cipherline",
      mark: <Lockup accent="#15803d" name="Cipherline" symbol={symbols.shield} />,
    },
    {
      id: "kestrel",
      name: "Kestrel Mobile",
      mark: <Lockup accent="#be123c" name="Kestrel" sub="Mobile" stacked symbol={symbols.wing} />,
    },
    {
      id: "lumen",
      name: "Lumen Media",
      mark: <Lockup accent="#c2410c" name="Lumen" sub="Media" dot />,
    },
    {
      id: "axiomgrid",
      name: "Axiom Grid",
      mark: <Lockup accent="#475569" name="Axiom Grid" initials="AG" />,
    },
    {
      id: "tessera",
      name: "Tessera Labs",
      mark: <Lockup accent="#0891b2" name="Tessera Labs" initials="TL" />,
    },
  ],
];

function Mark({
  accent,
  viewBox,
  children,
}: {
  accent: string;
  viewBox: string;
  children: ReactNode;
}) {
  return (
    <svg
      className="badge-mark"
      viewBox={viewBox}
      style={{ "--badge-accent": accent } as CSSProperties}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const shieldOutline = "M32 5 54 13v18c0 12.5-8.8 23-22 27C18.8 54 10 43.5 10 31V13L32 5Z";

/** Four invented engineering standards, shown as square badges. */
export const demoStandardBadges: TrustSlot[] = [
  {
    id: "software-quality",
    name: "Software Quality",
    detail: "Engineering quality standard",
    mark: (
      <Mark accent="#b8362d" viewBox="0 0 64 64">
        <path d={shieldOutline} fill="var(--badge-accent)" opacity=".12" />
        <path d={shieldOutline} fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="m22 31.5 7.5 7.5L44 24.5"
          fill="none"
          stroke="var(--badge-accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Mark>
    ),
  },
  {
    id: "secure-development",
    name: "Secure Development",
    detail: "Secure coding practices",
    mark: (
      <Mark accent="#2f5d8c" viewBox="0 0 64 64">
        <path
          d="M32 4 55 17v30L32 60 9 47V17L32 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M27 31v-4.5a5 5 0 0 1 10 0V31"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect x="23" y="31" width="18" height="14" rx="2.5" fill="var(--badge-accent)" />
      </Mark>
    ),
  },
  {
    id: "cloud-engineering",
    name: "Cloud Engineering",
    detail: "Cloud architecture & delivery",
    mark: (
      <Mark accent="#2b7a9b" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="20" fill="var(--badge-accent)" opacity=".1" />
        <path
          d="M23 39h19a6.5 6.5 0 0 0 .5-13 9.5 9.5 0 0 0-18 2.2A5.7 5.7 0 0 0 23 39Z"
          fill="var(--badge-accent)"
        />
      </Mark>
    ),
  },
  {
    id: "data-security",
    name: "Data Security",
    detail: "Data protection practices",
    mark: (
      <Mark accent="#3f6b46" viewBox="0 0 64 64">
        <path d={shieldOutline} fill="none" stroke="currentColor" strokeWidth="2.5" />
        <ellipse cx="32" cy="24" rx="11" ry="4.5" fill="var(--badge-accent)" />
        <path
          d="M21 24v13c0 2.5 4.9 4.5 11 4.5s11-2 11-4.5V24"
          fill="none"
          stroke="var(--badge-accent)"
          strokeWidth="2.5"
        />
        <path
          d="M21 30.5c0 2.5 4.9 4.5 11 4.5s11-2 11-4.5"
          fill="none"
          stroke="var(--badge-accent)"
          strokeWidth="2.5"
        />
      </Mark>
    ),
  },
];

/** Four invented recognitions: one ribbon rosette and three seals. */
export const demoRecognitionBadges: TrustSlot[] = [
  {
    id: "devops-excellence",
    shape: "wide",
    name: "DevOps Excellence",
    detail: "Continuous delivery practice",
    mark: (
      <Mark accent="#a9762a" viewBox="0 0 64 72">
        <path d="M23 45 17 70l15-7.5L47 70l-6-25Z" fill="var(--badge-accent)" opacity=".9" />
        <circle cx="32" cy="28" r="23" fill="#fff" />
        <circle cx="32" cy="28" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="28" r="16" fill="var(--badge-accent)" opacity=".14" />
        <path
          d="M22 28c0-3.2 2.4-5.5 5.2-5.5 4.6 0 5.2 11 9.6 11 2.8 0 5.2-2.3 5.2-5.5s-2.4-5.5-5.2-5.5c-4.4 0-5 11-9.6 11C24.4 33.5 22 31.2 22 28Z"
          fill="none"
          stroke="var(--badge-accent)"
          strokeWidth="2.6"
        />
      </Mark>
    ),
  },
  {
    id: "mobile-development",
    shape: "seal",
    name: "Mobile Development",
    mark: (
      <Mark accent="#6d4c7d" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="none"
          stroke="var(--badge-accent)"
          strokeWidth="1.4"
          strokeDasharray="2 4.5"
        />
        <rect
          x="23"
          y="17"
          width="18"
          height="30"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M29 42h6" stroke="var(--badge-accent)" strokeWidth="2.6" strokeLinecap="round" />
      </Mark>
    ),
  },
  {
    id: "ux-excellence",
    shape: "seal",
    name: "UI/UX Excellence",
    mark: (
      <Mark accent="#a6456b" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect
          x="16"
          y="19"
          width="32"
          height="23"
          rx="3.5"
          fill="var(--badge-accent)"
          opacity=".13"
        />
        <rect
          x="16"
          y="19"
          width="32"
          height="23"
          rx="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M16 27h32" stroke="currentColor" strokeWidth="2.2" />
        <path d="m33 33 12 4.6-4.8 1.7-1.7 4.8L33 33Z" fill="var(--badge-accent)" />
      </Mark>
    ),
  },
  {
    id: "ai-engineering",
    shape: "seal",
    name: "AI Engineering",
    mark: (
      <Mark accent="#3d5ba9" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M22 23h20M22 41h20M22 23l20 18M42 23 22 41"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".5"
        />
        <circle cx="22" cy="23" r="4.2" fill="var(--badge-accent)" />
        <circle cx="42" cy="23" r="4.2" fill="var(--badge-accent)" />
        <circle cx="22" cy="41" r="4.2" fill="currentColor" />
        <circle cx="42" cy="41" r="4.2" fill="currentColor" />
        <circle cx="32" cy="32" r="5.4" fill="var(--badge-accent)" />
      </Mark>
    ),
  },
];

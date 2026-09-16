import { Award, BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import type { BadgeShape, TrustSlot } from "@/lib/trust";
import {
  demoClientRows,
  demoRecognitionBadges,
  demoStandardBadges,
} from "@/components/demo-brand-marks";

export type { TrustSlot } from "@/lib/trust";

/**
 * Certifications and awards, in two labelled groups. The slots currently hold demo artwork from
 * demo-brand-marks.tsx — invented badges that claim nothing.
 *
 * To show a real certification, set `image` on its slot (that always wins over the demo artwork):
 *
 *   import badgeOne from "@/assets/certifications/badge-one.png";
 *   { id: "badge-one", name: "Your certification", detail: "What it covers", image: badgeOne },
 *
 * Add the official badge image ONLY once NetSwagger holds that certification — these marks are
 * licensed to certified organisations, and showing one otherwise is a false claim. "wide" spans two
 * columns, "seal" renders as a disc, anything else is a standard card.
 */
const certificationGroups: { id: string; label: string; row?: boolean; slots: TrustSlot[] }[] = [
  { id: "standards", label: "Certifications & standards", slots: demoStandardBadges },
  { id: "recognition", label: "Awards & recognition", row: true, slots: demoRecognitionBadges },
];

/**
 * Client logos, one array per marquee row, currently holding demo companies.
 *
 *   import clientOne from "@/assets/clients/client-one.svg";
 *   { id: "client-one", name: "Client name", image: clientOne },
 *
 * Rows scroll in opposite directions, pause on hover, and hold still for visitors who prefer
 * reduced motion. Add a real client only when you have permission to show their logo.
 */
const clientRows = demoClientRows;

const shapeIcon = { card: ShieldCheck, wide: BadgeCheck, seal: Award };

function BadgeSlot({ slot, index }: { slot: TrustSlot; index: number }) {
  const shape: BadgeShape = slot.shape ?? "card";
  const Icon = shapeIcon[shape];
  const empty = !slot.image && !slot.mark;
  return (
    <li className={`badge-slot badge-${shape}${empty ? " is-empty" : ""}`}>
      {slot.image ? (
        <img src={slot.image} alt={slot.name ?? ""} loading="lazy" />
      ) : (
        (slot.mark ?? (
          <span className="slot-icon" aria-hidden="true">
            <Icon size={20} strokeWidth={1.6} />
          </span>
        ))
      )}
      <div className="badge-text">
        {shape === "wide" && <span className="badge-rule" aria-hidden="true" />}
        <p className={slot.name ? "badge-name" : "slot-label"}>
          {slot.name ?? `Badge slot ${index + 1}`}
          {slot.mark && <span className="sr-only"> (sample badge)</span>}
        </p>
        {/* A disc is too tight for a second line. */}
        {slot.detail && shape !== "seal" && <p className="badge-detail">{slot.detail}</p>}
      </div>
    </li>
  );
}

function LogoCell({
  slot,
  index,
  duplicate,
}: {
  slot: TrustSlot;
  index: number;
  duplicate?: boolean;
}) {
  const empty = !slot.image && !slot.mark;
  return (
    <li
      className={`logo-cell${empty ? " is-empty" : ""}${duplicate ? " is-duplicate" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {slot.image ? (
        <img src={slot.image} alt={slot.name ?? ""} loading="lazy" />
      ) : (
        (slot.mark ?? (
          <span className="client-slot">
            <Building2 size={18} strokeWidth={1.5} aria-hidden="true" />
            <span className="slot-label">Logo slot {index + 1}</span>
          </span>
        ))
      )}
    </li>
  );
}

export function CertificationsSection() {
  return (
    <section id="certifications" className="trust-section" aria-labelledby="certifications-heading">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              TRUST & STANDARDS
            </p>
            <h2 id="certifications-heading">
              Certifications &amp; <span>Recognition</span>
            </h2>
          </div>
          <p>The standards we work to, and the recognition that follows.</p>
        </div>
        {certificationGroups.map((group) => (
          <div className="badge-group" key={group.id}>
            <p className="badge-group-label">{group.label}</p>
            <ul className={group.row ? "badge-row" : "badge-grid"}>
              {group.slots.map((slot, index) => (
                <BadgeSlot slot={slot} index={index} key={slot.id} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ClientsSection() {
  return (
    <section id="clients" className="section shell" aria-labelledby="clients-heading">
      <div className="center-heading">
        <p className="eyebrow">
          <span />
          OUR CLIENTS
        </p>
        <h2 id="clients-heading">
          Trusted by <span>our clients</span>
        </h2>
        <p className="clients-statement">
          We partner with organizations to design, build, and deliver reliable digital products and
          software solutions.
        </p>
      </div>
      <div className="logo-rows">
        {clientRows.map((row, rowIndex) => {
          const offset = clientRows
            .slice(0, rowIndex)
            .reduce((total, previous) => total + previous.length, 0);
          return (
            <div className="logo-marquee" key={row[0]?.id ?? rowIndex}>
              {/* The second copy is decorative: it only exists to make the loop seamless. */}
              <ul className={rowIndex % 2 ? "logo-track is-reverse" : "logo-track"}>
                {row.map((slot, index) => (
                  <LogoCell slot={slot} index={offset + index} key={slot.id} />
                ))}
                {row.map((slot, index) => (
                  <LogoCell slot={slot} index={offset + index} key={`${slot.id}-copy`} duplicate />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

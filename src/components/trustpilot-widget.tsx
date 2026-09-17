import { useEffect, useRef } from "react";
import { ArrowUpRight, Star } from "lucide-react";

/**
 * Trustpilot TrustBox. The widget pulls the live score and review count from Trustpilot, so it
 * stays correct as reviews arrive — unlike a hardcoded "3.4 from 2 reviews", which would be wrong
 * the moment the third review lands.
 *
 * `businessUnitId` is specific to the NetSwagger account and starts empty. Until it is set, this
 * renders a plain link to the review page rather than an empty gap. Both values come from
 * Trustpilot Business -> Integrations -> pick a TrustBox: the snippet shown there contains
 * `data-businessunit-id` and `data-template-id`. See docs/trustpilot-setup.md.
 */
const businessUnitId: string = "";
/** "Micro Star" TrustBox. Confirm this against the snippet in your dashboard before going live. */
const templateId = "5419b732fbfb950b10de65e5";
const reviewUrl = "https://www.trustpilot.com/review/netswagger.org";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (element: HTMLElement, forceReload?: boolean) => void };
  }
}

export function TrustpilotWidget() {
  const ref = useRef<HTMLDivElement>(null);
  // The bootstrap script scans the page once, on load. A widget mounted by React afterwards has to
  // be initialised by hand. This is a no-op until the async script has defined window.Trustpilot.
  useEffect(() => {
    if (ref.current) window.Trustpilot?.loadFromElement(ref.current, true);
  }, []);

  if (!businessUnitId)
    return (
      <a className="trustpilot-fallback" href={reviewUrl} target="_blank" rel="noreferrer">
        <Star size={17} strokeWidth={1.5} />
        Read our reviews on Trustpilot
        <ArrowUpRight size={15} />
      </a>
    );

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height="24px"
      data-style-width="100%"
    >
      {/* Shown until the script upgrades it, and for visitors with JavaScript disabled. */}
      <a href={reviewUrl} target="_blank" rel="noreferrer">
        Trustpilot
      </a>
    </div>
  );
}

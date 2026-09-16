import type { ReactNode } from "react";

/** Badge silhouette. "card" is a standard badge, "wide" a report-style badge, "seal" a disc. */
export type BadgeShape = "card" | "wide" | "seal";

/**
 * One slot in the certification or client wall.
 *
 * `image` wins over `mark`, so a real logo file always replaces code-drawn artwork. A slot with
 * neither renders as an empty placeholder.
 */
export type TrustSlot = {
  /** Stable key for React. */
  id: string;
  /** Caption under the badge, and the image alt text. */
  name?: string;
  /** Optional second line, such as what a certification covers. */
  detail?: string;
  /** Imported image or URL — use this for real badges and client logos. */
  image?: string;
  /** Artwork drawn in code, used when there is no `image`. */
  mark?: ReactNode;
  /** Defaults to "card". */
  shape?: BadgeShape;
};

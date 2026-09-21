/**
 * Payment contacts published at /freelancer/<record id>.
 *
 * The record id is the row's primary key: digits only, and more than ten of
 * them. Anything that doesn't match an entry below is a 404, so a guessed or
 * truncated link never resolves to somebody's details.
 *
 * To publish another contact, add an entry here.
 */
export type Payee = {
  id: string;
  name: string;
  role: string;
  company?: string;
  phone: string;
  email: string;
  companyEmail?: string;
  /** Written one line per row, exactly as it should appear on an envelope. */
  address: string[];
  /** Profile summary. One is generated from the role and company when unset. */
  summary?: string;
  /** Skills shown on this contact profile when provided. */
  skills?: string[];
  /** Defaults to the original payment-details layout. */
  layout?: "payment" | "profile";
};

const payees: Payee[] = [
  {
    id: "12301708711685",
    name: "Pedro Diaz",
    layout: "profile",
    role: "Senior Lead Software Engineer",
    phone: "+48 459567619",
    email: "jfpmanager1025@outlook.com",
    skills: [
      "Full-stack Development",
      "C#",
      ".NET Core",
      "Secure Architecture",
      "Performance Optimization",
    ],
    company: "NetSwagger",
    companyEmail: "pedro@netswagger.org",
    address: ["Chmielna 21", "00-021 Warszawa", "Poland"],
    summary:
      "Pedro Diaz is a Senior/Lead Software Engineer with 10+ years of professional experience directing enterprise software architectures, healthcare interoperability frameworks, and high-performance clinical data platforms. He specializes deeply in full-stack C# / .NET Core engineering, FHIR-compliant API development, and scalable MongoDB document modeling.",
  },
  {
    id: "12301708710950",
    name: "Brandon Jackson",
    role: "Company Contact",
    company: "NetSwagger",
    phone: "+380 996775901",
    email: "vitali19stad@gmail.com",
    address: ["Kvitkova Street 6, Kornyn", "Ukraine 13514"],
  },
  {
    id: "12301708711284",
    name: "Angel Perez",
    layout: "profile",
    role: "Senior Software Engineer",
    skills: [
      "Full-stack Development",
      "Cloud Infrastructure",
      "Data Engineering",
      "AI / LLM Integrations",
      "Secure Architecture",
      "Performance Optimization",
    ],
    summary:
      "Angel Perez is a Senior Software Engineer with 9 years of experience building scalable full-stack applications, data platforms, and AI-powered systems. His expertise spans modern web development, cloud infrastructure, data engineering, and production AI/LLM integrations, with a strong focus on secure architecture, reliability, performance, and maintainable software.",
    company: "NetSwagger",
    phone: "+380 957086130",
    email: "morhunvitalii65@gmail.com",
    companyEmail: "angel@netswagger.org",
    address: ["Poltava Street, Building 162, Apartment 5", "Karlivka, 39500", "Ukraine"],
  },
];

const recordId = /^\d{11,}$/;

export function findPayee(id: string): Payee | undefined {
  return recordId.test(id) ? payees.find((payee) => payee.id === id) : undefined;
}

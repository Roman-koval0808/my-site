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
  company: string;
  phone: string;
  email: string;
  /** Written one line per row, exactly as it should appear on an envelope. */
  address: string[];
  /** Profile summary. One is generated from the role and company when unset. */
  summary?: string;
};

const payees: Payee[] = [
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
    role: "Company Contact",
    company: "NetSwagger",
    phone: "+380 957086130",
    email: "morhunvitalii65@gmail.com",
    address: ["Poltava Street, Building 162, Apartment 5", "Karlivka, 39500", "Ukraine"],
  },
];

const recordId = /^\d{11,}$/;

export function findPayee(id: string): Payee | undefined {
  return recordId.test(id) ? payees.find((payee) => payee.id === id) : undefined;
}

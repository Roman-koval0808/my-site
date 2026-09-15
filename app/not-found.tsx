import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFoundPage">
      <img src="/netswagger-logo.svg" alt="NetSwagger" />
      <p className="sectionKicker">Page not found</p>
      <h1>That page isn&apos;t here.</h1>
      <Link className="primaryButton" href="/">Return home <span aria-hidden="true">-&gt;</span></Link>
    </main>
  );
}

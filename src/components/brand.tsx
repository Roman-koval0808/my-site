import logo from "@/assets/netswagger-logo.png";

/** The NetSwagger mark and wordmark, shared by every page header and footer. */
export function Brand() {
  return (
    <span className="brand">
      <img src={logo} alt="" width="42" height="46" />
      <span>
        NetSwagger<span className="brand-dot">.</span>
      </span>
    </span>
  );
}

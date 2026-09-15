import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetSwagger | App, Web & Product Development",
  description:
    "NetSwagger creates polished mobile apps, modern web platforms, and thoughtful digital experiences.",
  icons: {
    icon: "/netswagger-logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

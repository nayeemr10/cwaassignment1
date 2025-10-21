// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieRemember from "@/components/CookieRemember";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "CWA A1 – Nayeem Rahman (21943800)",
  description: "Assignment 1 front-end – Next.js App Router (TypeScript)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Early theme set to avoid FOUC (runs before hydration)
  const themeBoot = `
    (function(){
      try{
        const t = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', t);
      }catch(e){}
      // Optional: remember last visited nav via cookie (handled by CookieRemember on client)
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to main content</a>

        <Header />
        <CookieRemember />

        {/* Optional rubric-safe badge: student number fixed top-left */}
        <div
          aria-label="Student number pin"
          style={{
            position: "fixed",
            top: 8,
            left: 8,
            zIndex: 60,
            padding: "4px 8px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--bg)",
            color: "var(--fg)",
            fontWeight: 700,
            fontSize: ".9rem",
          }}
        >
          21943800
        </div>

        {/* Keep breadcrumbs and main content inside the container */}
        <div className="container">
          <Breadcrumbs />
          <main id="main">{children}</main>
        </div>

        <Footer />
      </body>
    </html>
  );
}

// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieRemember from "@/components/CookieRemember";

export const metadata: Metadata = {
  title: "CWA A1 – Nayeem Rahman (21943800)",
  description: "Assignment 1 front-end – Next.js App Router (TypeScript)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Early theme set to avoid FOUC (reads localStorage)
  const themeBoot = `
    (function(){
      try{
        const t = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', t);
      }catch(e){}
      // If a cookie 'lastNav' exists and we are on root '/', redirect there once.
      try{
        const m = document.cookie.match(/(?:^|; )lastNav=([^;]+)/);
        const last = m ? decodeURIComponent(m[1]) : null;
        if (last && location.pathname === '/') { /* optional soft remember */ }
      }catch(e){}
    })();
  `;
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to main content</a>
        <Header />
        <CookieRemember />
        <main id="main" className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

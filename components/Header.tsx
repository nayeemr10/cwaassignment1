"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Tabs" },
  { href: "/pre-lab", label: "Pre-lab Questions", disabled: true },
  { href: "/escape-room", label: "Escape Room" },
  { href: "/coding-races", label: "Coding Races" },
  { href: "/court-room", label: "Court Room" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const saveCookie = (href: string) => {
    // Remember which menu tab you were on (cookie)
    document.cookie = `lastNav=${encodeURIComponent(href)}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  return (
    <header role="banner">
      <div className="nav">
        <div className="brand" aria-label="Student identity">
          <span>21943800</span>
          <small>Nayeem Rahman</small>
        </div>

        {/* Hamburger with CSS transform */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="primary-menu"
          className="hb btn"
          onClick={() => setOpen(o => !o)}
          style={{
            display: "inline-flex",
            gap: ".5rem",
            alignItems: "center",
            transition: "transform .25s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)" // CSS Transform ✔
          }}
        >
          ☰ Menu
        </button>

        <nav id="primary-menu" aria-label="Primary" className={`menu ${open ? "open" : ""}`}>
          {NAV.map(item => {
            if (item.disabled) {
              return (
                <span key={item.label} aria-disabled="true" className="btn" style={{ opacity: .4 }}>
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => saveCookie(item.href)}
                aria-current={pathname === item.href ? "page" : undefined}
                className="btn"
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

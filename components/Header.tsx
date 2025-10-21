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
      <div
        className="nav"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* --- Left: Student number badge (rubric compliance) --- */}
        <div className="brand" aria-label="Student number" style={{ fontWeight: 700 }}>
          21943800
        </div>

        {/* --- Center: Hamburger + Navigation --- */}
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="primary-menu"
            className="hb btn"
            onClick={() => setOpen((o) => !o)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".5rem",
              transition: "transform .25s",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ☰
          </button>

          <nav
            id="primary-menu"
            aria-label="Primary"
            className={`menu ${open ? "open" : ""}`}
            style={{
              display: open ? "flex" : "none",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: ".5rem",
            }}
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => saveCookie(item.href)}
                aria-current={pathname === item.href ? "page" : undefined}
                className="btn"
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>

        {/* --- Right: Your name + ID --- */}
        <div
          aria-label="Student identity"
          style={{
            textAlign: "right",
            fontWeight: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span>Nayeem Rahman</span>
          <small style={{ color: "var(--muted)" }}>ID: 21943800</small>
        </div>
      </div>
    </header>
  );
}

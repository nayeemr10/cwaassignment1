"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function titleFromSegment(seg: string) {
  return seg
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  if (pathname === "/") return null; // hide on home

  const parts = pathname.split("/").filter(Boolean);
  const items = parts.map((seg, i) => {
    const href = "/" + parts.slice(0, i + 1).join("/");
    return { name: titleFromSegment(seg), href };
  });

  return (
    <nav aria-label="Breadcrumb" style={{ margin: "0.75rem 0" }}>
      <ol
        style={{
          listStyle: "none",
          display: "flex",
          gap: ".5rem",
          padding: 0,
          margin: 0,
          alignItems: "center",
          color: "var(--muted)",
          fontSize: ".95rem",
          flexWrap: "wrap",
        }}
      >
        <li>
          <Link className="btn" href="/" aria-label="Home">
            Home
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={it.href} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span aria-hidden="true">/</span>
            {i < items.length - 1 ? (
              <Link className="btn" href={it.href}>{it.name}</Link>
            ) : (
              <span aria-current="page" style={{ fontWeight: 600 }}>{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

"use client";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }
  return (
    <button className="btn" aria-label="Toggle theme" onClick={toggle}>
      Dark/Light
    </button>
  );
}

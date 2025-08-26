export default function Footer() {
  const today = new Date().toLocaleDateString("en-AU");
  return (
    <footer role="contentinfo">
      <div className="container" style={{ padding: "1rem" }}>
        © {new Date().getFullYear()} • Nayeem Rahman • 21943800 • {today}
      </div>
    </footer>
  );
}

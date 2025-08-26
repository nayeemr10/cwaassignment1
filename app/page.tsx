// app/page.tsx
import TabsBuilder from "@/components/TabsBuilder";

export default function Home() {
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Tabs</h1>
      <p style={{ color: "var(--muted)" }}>
        Build up to 15 tabs, store them in <code>localStorage</code>, and generate HTML + JS with <strong>inline CSS only</strong>.
      </p>
      <TabsBuilder />
    </>
  );
}

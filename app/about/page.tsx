// about feature commit for A1
// app/about/page.tsx
export const dynamic = "force-static"; // simple page

export default function About() {
  return (
    <article className="card">
      <h1 style={{ marginTop: 0 }}>About this website</h1>
      <p><strong>Name:</strong> Nayeem Rahman</p>
      <p><strong>Student No:</strong> 21943800</p>
      <h2>How to use</h2>
      <ol>
        <li>Use <em>Tabs</em> page to create/rename up to 15 tabs.</li>
        <li>Type content on the right.</li>
        <li>Click <em>Copy to clipboard</em> and paste into <kbd>Hello.html</kbd>.</li>
        <li>Open the file in any browser.</li>
      </ol>
      <h2>Demo Video</h2>
      {/* Replace src with your recorded walkthrough (3–8 min). */}
      <video controls width={720} poster="" aria-label="Video walkthrough placeholder">
        <source src="/demo-placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </article>
  );
}

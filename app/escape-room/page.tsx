"use client";
import { useEffect, useMemo, useState } from "react";

type Puzzle = {
  id: string;
  title: string;
  solved: boolean;
  hint?: string;
};

const START_SECONDS = 180; // 3 min timer

export default function EscapeRoom() {
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [running, setRunning] = useState(false);

  const [puzzles, setPuzzles] = useState<Puzzle[]>([
    { id: "lock", title: "Find the 3-digit lock code", solved: false, hint: "Try summing visible clues" },
    { id: "wire", title: "Cut the correct wire", solved: false, hint: "Red? Blue? Green?" },
    { id: "riddle", title: "Answer the riddle", solved: false, hint: "I speak without a mouth..." },
  ]);

  // Timer controls
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  function start() { setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setSeconds(START_SECONDS); }

  function toggleSolved(id: string) {
    setPuzzles(ps => ps.map(p => p.id === id ? { ...p, solved: !p.solved } : p));
  }

  const allSolved = useMemo(() => puzzles.every(p => p.solved), [puzzles]);

  // “Output operational”: produce standalone HTML+JS with inline CSS ONLY
  const outputHtml = useMemo(() => {
    const list = puzzles.map(p =>
      `<li style="margin:.25rem 0">${p.solved ? "✅" : "❌"} ${escapeHtml(p.title)}</li>`
    ).join("");
    return `<!doctype html><meta charset="utf-8"><title>Escape Output</title>
<div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;max-width:800px;margin:16px auto">
  <h1 style="margin:0 0 12px">Escape Room – Status</h1>
  <ul style="padding-left:1rem;line-height:1.6">${list}</ul>
  <p style="margin-top:12px">${allSolved ? "All puzzles solved. You escaped! 🎉" : "Keep going…"}</p>
</div>`;
  }, [puzzles, allSolved]);

  function downloadOutput() {
    const blob = new Blob([outputHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "escape-output.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <h1 style={{ marginTop: 0 }}>Escape Room</h1>

      <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", alignItems:"center" }}>
        <button className="btn" onClick={start} aria-label="Start timer">Start</button>
        <button className="btn" onClick={pause} aria-label="Pause timer">Pause</button>
        <button className="btn" onClick={reset} aria-label="Reset timer">Reset</button>
        <button className="btn" onClick={downloadOutput} aria-label="Download output">Download Output</button>
        <span>Time left: <strong>{seconds}s</strong></span>
      </div>

      <h2>Puzzles</h2>
      <ul style={{ paddingLeft: "1rem" }}>
        {puzzles.map(p => (
          <li key={p.id} style={{ margin: ".5rem 0" }}>
            <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
              {/* Simple inline SVG icon for a puzzle lock */}
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 10V7a5 5 0 1110 0v3" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="checkbox"
                checked={p.solved}
                onChange={() => toggleSolved(p.id)}
                aria-label={`Mark ${p.title} as solved`}
              />
              <span>{p.title}</span>
              {p.hint && !p.solved && <span style={{ marginLeft: ".5rem", color: "var(--muted)" }}>(hint: {p.hint})</span>}
            </label>
          </li>
        ))}
      </ul>

      {allSolved && (
        <div aria-live="polite" style={{ border:"1px solid var(--border)", borderRadius:"12px", padding:"1rem", marginTop:"1rem" }}>
          <strong>🎉 You escaped!</strong> Download the output to include in MOODLE.
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

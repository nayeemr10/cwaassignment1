"use client";
import { useEffect, useMemo, useState } from "react";

type Puzzle = { id: string; title: string; solved: boolean; hint?: string };

const START_SECONDS = 180;

export default function EscapeRoom() {
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [running, setRunning] = useState(false);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([
    { id: "lock", title: "Find the 3-digit lock code", solved: false, hint: "Sum the clues" },
    { id: "wire", title: "Cut the correct wire", solved: false, hint: "Red? Blue? Green?" },
    { id: "riddle", title: "Answer the riddle", solved: false, hint: "I speak without a mouth..." },
  ]);
  const [newTitle, setNewTitle] = useState("");

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

  function addPuzzle() {
    const title = newTitle.trim();
    if (!title) return;
    setPuzzles(ps => [...ps, { id: crypto.randomUUID(), title, solved: false }]);
    setNewTitle("");
  }

  function removePuzzle(id: string) {
    setPuzzles(ps => ps.filter(p => p.id !== id));
  }

  const allSolved = puzzles.length > 0 && puzzles.every(p => p.solved);

  // Output: standalone HTML + inline CSS only
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

      {/* Controls */}
      <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", alignItems:"center" }}>
        <button className="btn" onClick={start} aria-label="Start timer">
          {/* play icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          &nbsp;Start
        </button>
        <button className="btn" onClick={pause} aria-label="Pause timer">
          {/* pause icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z" fill="currentColor"/></svg>
          &nbsp;Pause
        </button>
        <button className="btn" onClick={reset} aria-label="Reset timer">
          {/* reset icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6V2L7 7l5 5V8c2.76 0 5 2.24 5 5s-2.24 5-5 5a5 5 0 01-4.9-4h-2.1A7.1 7.1 0 0012 22c3.93 0 7.1-3.17 7.1-7.1S15.93 7.8 12 7.8z" fill="currentColor"/></svg>
          &nbsp;Reset
        </button>
        <button className="btn" onClick={downloadOutput} aria-label="Download output">
          {/* download icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14v-2H5v2zm7-18l-5.5 5.5h3.5V15h4V7.5H17L12 2z" fill="currentColor"/></svg>
          &nbsp;Download Output
        </button>
        <span>Time left: <strong>{seconds}s</strong></span>
      </div>

      {/* Add/remove puzzles (multiple options) */}
      <div style={{ display:"flex", gap:".5rem", alignItems:"center", marginTop:".75rem", flexWrap:"wrap" }}>
        <input
          type="text"
          placeholder="New puzzle title…"
          value={newTitle}
          onChange={(e)=>setNewTitle(e.target.value)}
          aria-label="New puzzle title"
        />
        <button className="btn" onClick={addPuzzle} aria-label="Add puzzle">
          {/* plus icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"/></svg>
          &nbsp;Add Puzzle
        </button>
      </div>

      <h2>Puzzles</h2>
      <ul style={{ paddingLeft: "1rem" }}>
        {puzzles.map(p => (
          <li key={p.id} style={{ margin: ".5rem 0" }}>
            <label style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap:"wrap" }}>
              {/* lock icon */}
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
              {!p.solved && p.hint && <span style={{ marginLeft: ".5rem", color: "var(--muted)" }}>(hint: {p.hint})</span>}
              <button className="btn" onClick={() => removePuzzle(p.id)} aria-label={`Remove ${p.title}`}>Remove</button>
            </label>
          </li>
        ))}
      </ul>

      {allSolved && (
        <div aria-live="polite" style={{ border:"1px solid var(--border)", borderRadius:"12px", padding:"1rem", marginTop:"1rem" }}>
          <strong>🎉 You escaped!</strong> Download the output and upload to MOODLE.
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

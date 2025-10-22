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

  // --- Timer logic ---
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  function start() { setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setSeconds(START_SECONDS); }

  // --- Puzzle logic ---
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

  // --- Generate inline HTML output ---
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

  // --- Save to Database (Prisma API) ---
  async function saveOutputToDB() {
    try {
      const res = await fetch("/api/outputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: outputHtml, kind: "escape-output" }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("✅ Output saved to database!");
    } catch (e: any) {
      alert("Save error: " + e.message);
    }
  }

  return (
    <div
      className="card"
      style={{
        background: `url('/bg-escape.jpg') center/cover no-repeat`,
        minHeight: "100vh",
        padding: "1rem",
        borderRadius: "12px",
      }}
      aria-label="Escape room background image"
    >
      <h1 style={{ marginTop: 0, textShadow: "0 1px 2px rgba(0,0,0,.4)" }}>Escape Room</h1>

      {/* Controls */}
      <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap", alignItems:"center", background:"rgba(0,0,0,.4)", padding:".5rem", borderRadius:"8px" }}>
        <button className="btn" onClick={start} aria-label="Start timer">
          ▶ Start
        </button>
        <button className="btn" onClick={pause} aria-label="Pause timer">
          ⏸ Pause
        </button>
        <button className="btn" onClick={reset} aria-label="Reset timer">
          ⟳ Reset
        </button>
        <button className="btn" onClick={downloadOutput} aria-label="Download output">
          ⬇ Download Output
        </button>
        <button className="btn" onClick={saveOutputToDB} aria-label="Save output to database">
          💾 Save Output (DB)
        </button>
        <span>Time left: <strong>{seconds}s</strong></span>
      </div>

      {/* Add/remove puzzles */}
      <div style={{ display:"flex", gap:".5rem", alignItems:"center", marginTop:".75rem", flexWrap:"wrap", background:"rgba(255,255,255,.8)", padding:".5rem", borderRadius:"8px", color:"#000" }}>
        <input
          type="text"
          placeholder="New puzzle title…"
          value={newTitle}
          onChange={(e)=>setNewTitle(e.target.value)}
          aria-label="New puzzle title"
        />
        <button className="btn" onClick={addPuzzle} aria-label="Add puzzle">＋ Add Puzzle</button>
      </div>

      <h2 style={{ textShadow:"0 1px 2px rgba(0,0,0,.5)" }}>Puzzles</h2>
      <ul style={{ paddingLeft: "1rem", background:"rgba(255,255,255,.8)", color:"#000", borderRadius:"8px", padding:".75rem" }}>
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
              {!p.solved && p.hint && <span style={{ marginLeft: ".5rem", color: "gray" }}>(hint: {p.hint})</span>}
              <button className="btn" onClick={() => removePuzzle(p.id)} aria-label={`Remove ${p.title}`}>Remove</button>
            </label>
          </li>
        ))}
      </ul>

      {allSolved && (
        <div aria-live="polite" style={{ border:"1px solid var(--border)", borderRadius:"12px", padding:"1rem", marginTop:"1rem", background:"rgba(255,255,255,.9)", color:"#000" }}>
          <strong>🎉 You escaped!</strong> Download or save your output.
        </div>
      )}
    </div>
  );
}

// Escape HTML safely
function escapeHtml(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

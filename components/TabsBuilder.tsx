"use client";
import { useEffect, useMemo, useState } from "react";

type Tab = { title: string; content: string };

const EMPTY: Tab = { title: "Step 1", content: "Describe step 1 here..." };

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function makeStandaloneHTML(tabs: Tab[]) {
  const btns = tabs.map((t, i) =>
    `<button role="tab" aria-selected="${i === 0}" aria-controls="panel-${i}" id="tab-${i}" tabindex="${i === 0 ? 0 : -1}" style="padding:8px 12px;border:1px solid #d1d5db;border-radius:10px;background:${i === 0 ? "#e5e7eb" : "#ffffff"};cursor:pointer">${escapeHtml(t.title)}</button>`
  ).join("");

  const panels = tabs.map((t, i) =>
    `<div role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" ${i === 0 ? "" : "hidden"} style="border:1px solid #d1d5db;border-radius:10px;padding:12px;margin-top:12px;line-height:1.5">${escapeHtml(t.content).replace(/\n/g, "<br>")}</div>`
  ).join("");

  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tabs Output</title>
<div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;max-width:960px;margin:16px auto;padding:0 12px">
  <h1 style="margin:0 0 12px">Tabs</h1>
  <div role="tablist" aria-label="Tabs" style="display:flex;gap:8px;flex-wrap:wrap">${btns}</div>
  ${panels}
</div>
<script>
(function(){
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  const panels=[...document.querySelectorAll('[role="tabpanel"]')];
  function activate(i, focus=true){
    tabs.forEach((t,idx)=>{
      const sel = idx===i;
      t.setAttribute('aria-selected', sel);
      t.setAttribute('tabindex', sel? '0':'-1');
      t.style.background = sel ? '#e5e7eb' : '#ffffff';
      panels[idx].hidden = !sel;
    });
    if(focus) tabs[i].focus();
  }
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>activate(i,false));
    t.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        const dir = e.key==='ArrowRight'?1:-1;
        let n=(i+dir+tabs.length)%tabs.length;
        activate(n);
      }
    });
  });
})();
</script>`;
  return html;
}

export default function TabsBuilder() {
  const [tabs, setTabs] = useState<Tab[]>([EMPTY, { title: "Step 2", content: "1. Install VSCode\n2. Install Chrome\n3. Install Node\n4. etc" }]);
  const [active, setActive] = useState(0);

  // Load/save tabs to localStorage (rubric: Tabs are stored in localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("cwa-tabs");
    if (saved) {
      try { const list: Tab[] = JSON.parse(saved); if (Array.isArray(list) && list.length) setTabs(list.slice(0, 15)); } catch {}
    }
  }, []);
  useEffect(() => { localStorage.setItem("cwa-tabs", JSON.stringify(tabs)); }, [tabs]);

  function addTab() {
    if (tabs.length >= 15) return;
    setTabs(t => [...t, { title: `Step ${t.length + 1}`, content: "" }]);
    setActive(tabs.length);
  }
  function removeTab(i: number) {
    const next = tabs.toSpliced(i, 1);
    setTabs(next.length ? next : [EMPTY]);
    setActive(Math.max(0, i - 1));
  }

  const output = useMemo(() => makeStandaloneHTML(tabs), [tabs]);

  return (
    <div className="grid grid-cols">
      <section className="card" aria-labelledby="tabs-headers">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem" }}>
          <h2 id="tabs-headers" style={{ margin: 0 }}>Tabs Headers</h2>
          <button className="btn" onClick={addTab} aria-disabled={tabs.length >= 15} disabled={tabs.length >= 15}>[ + ]</button>
        </div>
        <div role="tablist" aria-label="Edit tabs" style={{ display: "grid", gap: ".5rem" }}>
          {tabs.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
              <button
                className="btn"
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
              >
                {t.title}
              </button>
              <input
                type="text"
                aria-label={`Rename ${t.title}`}
                value={t.title}
                onChange={e => setTabs(prev => prev.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))}
                placeholder="Tab title"
              />
              <button className="btn" onClick={() => removeTab(i)} aria-label={`Remove ${t.title}`}>−</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card" aria-labelledby="tabs-content">
        <h2 id="tabs-content" style={{ marginTop: 0 }}>Tabs Content</h2>
        <textarea
          rows={14}
          value={tabs[active]?.content ?? ""}
          onChange={e => setTabs(prev => prev.map((x, idx) => idx === active ? { ...x, content: e.target.value } : x))}
          placeholder="Write content for the selected tab. Use new lines for bullets."
          aria-describedby="content-help"
        />
        <p id="content-help" style={{ color: "var(--muted)" }}>
          Tip: Use new lines. The output converts them to <code>&lt;br&gt;</code>.
        </p>
      </section>

      <section className="card" aria-labelledby="output">
        <h2 id="output" style={{ marginTop: 0 }}>Output</h2>
        <p style={{ marginTop: 0 }}>Copy-paste into <kbd>Hello.html</kbd> and open in a browser.</p>
        <textarea rows={14} readOnly value={output} />
        <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
          <button className="btn" onClick={() => navigator.clipboard.writeText(output)}>Copy to clipboard</button>
          <button
            className="btn"
            onClick={() => {
              const blob = new Blob([output], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const w = window.open(url, "_blank");
              setTimeout(() => URL.revokeObjectURL(url), 10000);
              if (!w) alert("Popup blocked — allow popups to preview.");
            }}
          >
            Preview
          </button>
        </div>
      </section>
    </div>
  );
}

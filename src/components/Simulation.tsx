"use client";
// ============================================================================
// Simulation — the live runner (FRONTEND, runs in the judge's browser).
// On load it sends a REQUEST to /api/scenario (our backend), receives the
// scripted timeline as JSON, then plays it: the gauge moves, the ledger fills
// signal by signal, the identity graph blooms, and a verdict lands.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TrustGauge, { bandColour } from "./TrustGauge";
import IdentityGraph from "./IdentityGraph";
import type { Scenario, TrustEvent } from "@/lib/scenarios";

export default function Simulation({ mode }: { mode: "genuine" | "threat" }) {
  const [data, setData] = useState<Scenario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<TrustEvent[]>([]);
  const [target, setTarget] = useState(500);   // where the gauge is heading
  const [display, setDisplay] = useState(500);  // the tweened number shown
  const [reveal, setReveal] = useState(1);       // graph nodes revealed
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ---- fetch the scenario from the backend, then play it -------------------
  useEffect(() => {
    let cancelled = false;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setData(null); setError(null); setLedger([]); setDone(false); setReveal(1);

    fetch(`/api/scenario?mode=${mode}`)
      .then((r) => r.json())
      .then((sc: Scenario) => {
        if (cancelled || !sc?.events) { if (!cancelled) setError("Could not load scenario."); return; }
        setData(sc);
        setTarget(sc.startScore);
        setDisplay(sc.startScore);

        const total = sc.events.length;
        sc.events.forEach((ev, i) => {
          const id = setTimeout(() => {
            setLedger((prev) => [...prev, ev]);
            setTarget(ev.scoreAfter);
            setReveal(Math.max(1, Math.ceil((sc.graph.nodes.length * (i + 1)) / total)));
          }, ev.t * 1000);
          timers.current.push(id);
        });

        const endId = setTimeout(() => setDone(true), sc.events[total - 1].t * 1000 + 900);
        timers.current.push(endId);
      })
      .catch(() => { if (!cancelled) setError("Could not reach the scoring service."); });

    return () => { cancelled = true; timers.current.forEach(clearTimeout); };
  }, [mode, runId]);

  // ---- tween the displayed number toward the target -----------------------
  useEffect(() => {
    let raf = 0; const start = performance.now(); const from = display; const dur = 650;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (error) {
    return (
      <div className="wrap" style={{ paddingTop: 60 }}>
        <div className="panel">{error} <Link href="/" className="back-link">Back</Link></div>
      </div>
    );
  }

  const isThreat = mode === "threat";

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">△</div>
          <div>
            <div className="brand-name">TRISHUL</div>
            <div className="brand-sub">Identity Trust Engine</div>
          </div>
        </div>
        <span className="live-chip">
          <span className="dot" style={{ background: isThreat ? "var(--red)" : "var(--teal)", boxShadow: `0 0 10px ${isThreat ? "var(--red)" : "var(--teal)"}` }} />
          {isThreat ? "THREAT FEED" : "GENUINE SESSION"}
        </span>
      </header>

      <div className="sim-head">
        <div>
          <div className="eyebrow">{isThreat ? "Scenario B · Threat simulation" : "Scenario A · Genuine recovery"}</div>
          <div className="sim-title" style={{ marginTop: 8 }}>
            Account recovery · {data?.holder ?? "…"}
          </div>
          <div className="sim-meta">
            {data ? `${data.actor}  ·  ${data.context}` : "establishing session…"}
          </div>
        </div>
        <Link href="/" className="back-link">← Both doors</Link>
      </div>

      <div className="grid">
        {/* LEFT: gauge + verdict */}
        <div>
          <div className="panel">
            <div className="panel-h"><span>Identity Trust Score</span><span className="mono">LIVE</span></div>
            <TrustGauge score={display} />
            <div className="gauge-band" style={{ color: bandColour(display) }}>
              {data ? data.band : "scoring…"}
            </div>
          </div>

          {done && data && (
            <div className={`verdict ${isThreat ? "bad" : "good"}`}>
              <span className="verdict-tag">{isThreat ? "⚠ Policy response" : "✓ Policy response"}</span>
              <h3>{isThreat ? "Recovery halted" : "Recovery approved"}</h3>
              <p>{data.decision}</p>
            </div>
          )}

          <div className="controls">
            <button className="btn" onClick={() => setRunId((n) => n + 1)}>↻ Run again</button>
            <Link href={isThreat ? "/simulate/genuine" : "/simulate/threat"} className="btn btn-ghost">
              {isThreat ? "See genuine path" : "See attack path"}
            </Link>
          </div>
        </div>

        {/* RIGHT: ledger + graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="panel">
            <div className="panel-h"><span>Signal ledger · why the score moved</span><span className="mono">{ledger.length} signals</span></div>
            <div className="ledger">
              {ledger.length === 0 && <div className="l-detail" style={{ color: "var(--faint)" }}>Awaiting first signal…</div>}
              {ledger.map((ev, i) => (
                <div key={i} className={`lrow sev-${ev.severity}`}>
                  <div className="l-label">
                    <span className="pip" />
                    {ev.label}
                    <span className={`badge-sim ${ev.simulated ? "" : "badge-live"}`}>
                      {ev.simulated ? "SIM" : "LIVE"}
                    </span>
                  </div>
                  <div className="l-delta">{ev.delta > 0 ? `+${ev.delta}` : ev.delta}</div>
                  <div className="l-detail">{ev.detail}</div>
                  <div className="l-src">↳ production source: {ev.source}</div>
                </div>
              ))}
            </div>
          </div>

          {data && (
            <div className="panel">
              <div className="panel-h">
                <span>Identity graph</span>
                <span className="mono">{isThreat ? "fraud-ring detection" : "trusted cluster"}</span>
              </div>
              <IdentityGraph nodes={data.graph.nodes} edges={data.graph.edges} revealCount={reveal} />
            </div>
          )}
        </div>
      </div>

      <p className="footnote">
        Signals tagged <span className="mono">SIM</span> are scripted for this proof-of-concept;
        the behavioural signal is <span className="mono" style={{ color: "var(--teal)" }}>LIVE</span>.
        Each row names the real production data source it would consume at the bank.
      </p>
    </div>
  );
}

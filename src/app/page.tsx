// ============================================================================
// page.tsx  —  THE LANDING PAGE (the two doors)
// ----------------------------------------------------------------------------
// A server component (no interactivity needed). It shows the judge two choices.
// Each "door" is just a link to /simulate/genuine or /simulate/threat.
// ============================================================================
import Link from "next/link";

export default function Home() {
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
        <span className="live-chip"><span className="dot" />DEMO · LIVE</span>
      </header>

      <section className="hero">
        <span className="eyebrow">Cybersecurity &amp; Fraud · Account Recovery</span>
        <h1>
          Trust is earned every<br />second, not at <span className="accent">login.</span>
        </h1>
        <p>
          Account recovery is the weakest door in digital banking. TRISHUL scores every
          recovery attempt in real time and spends friction only when risk is elevated —
          a genuine owner glides through, an attacker hits a wall. Pick a door to watch
          the same account handled two very different ways.
        </p>
      </section>

      <section className="doors">
        <Link href="/simulate/genuine" className="door teal">
          <div className="door-icon">✓</div>
          <span className="door-tag">Scenario A</span>
          <h2>Genuine user recovery</h2>
          <p>
            Kabir Rao forgot his password and recovers from his own trusted device.
            Watch trust build and friction melt away — recovery in one tap.
          </p>
          <span className="door-cta">Run genuine recovery →</span>
        </Link>

        <Link href="/simulate/threat" className="door red">
          <div className="door-icon">⚠</div>
          <span className="door-tag">Scenario B</span>
          <h2>Threat simulation</h2>
          <p>
            The same account, now under attack: new device, SIM swapped 6 hours ago,
            datacenter IP. Watch the trust score collapse and the response fire.
          </p>
          <span className="door-cta">Launch attack →</span>
        </Link>
      </section>

      <p className="footnote">
        Proof-of-concept demo · Bank of Baroda Hackathon 2026 · Academic partner IIT Gandhinagar<br />
        Signals marked <span className="mono">SIM</span> are scripted for this demo; the behavioural
        sensor is live. Each signal lists its real production data source.
      </p>
    </div>
  );
}

"use client";
// ============================================================================
// TrustGauge — the signature element.
// A circular arc that fills with the live Identity Trust Score (0–1000).
// Colour shifts teal (high trust) → amber (elevated) → red (high risk).
// The arc length animates via CSS transition whenever `score` changes.
// ============================================================================

export function bandColour(score: number): string {
  if (score >= 700) return "var(--teal)";
  if (score >= 350) return "var(--amber)";
  return "var(--red)";
}

export default function TrustGauge({ score }: { score: number }) {
  const R = 88;                       // radius
  const C = 2 * Math.PI * R;          // full circumference
  const sweep = 0.75;                 // draw 75% of a circle (a 270° dial)
  const track = C * sweep;
  const filled = track * Math.min(score, 1000) / 1000;
  const colour = bandColour(score);

  return (
    <div className="gauge-wrap">
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: "visible" }}>
        {/* rotate so the gap sits at the bottom */}
        <g transform="rotate(135 110 110)">
          <circle
            cx="110" cy="110" r={R} fill="none"
            stroke="var(--line)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${track} ${C}`}
          />
          <circle
            cx="110" cy="110" r={R} fill="none"
            stroke={colour} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${filled} ${C}`}
            style={{
              transition: "stroke-dasharray 0.7s cubic-bezier(.3,.8,.3,1), stroke 0.5s",
              filter: `drop-shadow(0 0 10px ${colour})`,
            }}
          />
        </g>
        <text x="110" y="104" textAnchor="middle" className="gauge-score"
              fill={colour} style={{ transition: "fill .5s" }}>
          {Math.round(score)}
        </text>
        <text x="110" y="130" textAnchor="middle"
              fill="var(--muted)" fontSize="11" className="mono"
              style={{ letterSpacing: "0.18em" }}>
          / 1000 ITS
        </text>
      </svg>
    </div>
  );
}

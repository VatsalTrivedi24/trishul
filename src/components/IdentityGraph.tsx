"use client";
// ============================================================================
// IdentityGraph — the identity relationship view.
// Genuine: a small calm cluster. Threat: nodes "bloom" in to reveal a fraud
// ring — the attacker's device + IP linked to three other flagged identities.
// `revealCount` controls how many nodes have appeared (drives the bloom).
// ============================================================================
import type { GraphNode, GraphEdge } from "@/lib/scenarios";

export default function IdentityGraph({
  nodes, edges, revealCount,
}: { nodes: GraphNode[]; edges: GraphEdge[]; revealCount: number }) {
  const shown = nodes.slice(0, revealCount);
  const shownIds = new Set(shown.map((n) => n.id));
  const pos = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="graph-canvas">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{ position: "absolute", inset: 0 }}>
        {edges
          .filter((e) => shownIds.has(e.from) && shownIds.has(e.to))
          .map((e: GraphEdge, i) => {
            const a = pos(e.from), b = pos(e.to);
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                vectorEffect="non-scaling-stroke"
                stroke={e.danger ? "var(--red)" : "var(--teal)"}
                strokeWidth={1.2} strokeOpacity={0.5}
                strokeDasharray="4 4"
                style={{ filter: `drop-shadow(0 0 3px ${e.danger ? "var(--red-glow)" : "var(--teal-glow)"})` }} />
            );
          })}
      </svg>

      {shown.map((n, i) => (
        <div key={n.id}
             className={`gnode ${n.kind} ${n.danger ? "danger" : ""}`}
             style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 0.08}s` }}>
          <div className="ring" />
          <div className="gl">{n.label}</div>
        </div>
      ))}
    </div>
  );
}

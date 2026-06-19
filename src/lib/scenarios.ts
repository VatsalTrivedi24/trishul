// ============================================================================
// scenarios.ts  —  THE BRAIN'S SCRIPT
// ----------------------------------------------------------------------------
// This file holds the two demo storylines. It is imported by the API route
// (the BACKEND), so when the judge picks a door on the landing page, the
// server reads the matching script here, and sends it back as JSON.
//
// Nothing here is "fake maths dressed up as a model" — it is a DETERMINISTIC
// SCRIPT of trust-score events. Every number is one we can defend out loud.
// Real-world data source for each simulated signal is named in `source`.
// ============================================================================

export type Severity = "good" | "info" | "warn" | "critical";

export interface TrustEvent {
  t: number;          // seconds after recovery began (for the live timeline feel)
  label: string;      // what the operator sees in the ledger
  detail: string;     // the plain-English "why"
  delta: number;      // how many trust points this signal added (+) or removed (-)
  scoreAfter: number; // the running Identity Trust Score after applying delta
  category: "device" | "behavior" | "sim" | "network" | "exposure" | "graph";
  severity: Severity;
  simulated: boolean; // true => signal is scripted for the demo
  source: string;     // the REAL production integration point for this signal
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "account" | "device" | "ip" | "identity";
  danger: boolean;
  x: number; // 0..100 layout coordinates (percent of the canvas)
  y: number;
}

export interface GraphEdge { from: string; to: string; danger: boolean; }

export interface Scenario {
  mode: "genuine" | "threat";
  holder: string;
  actor: string;
  context: string;
  startScore: number;
  events: TrustEvent[];
  finalScore: number;
  band: string;       // human-readable risk band
  decision: string;   // the friction response the policy engine applies
  caseId?: string;
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
}

// ---------------------------------------------------------------------------
// SCENARIO A — GENUINE RECOVERY
// Kabir Rao forgot his password and is recovering from his own trusted device.
// Trust BUILDS from a neutral prior up to a high-trust verdict.
// ---------------------------------------------------------------------------
const genuine: Scenario = {
  mode: "genuine",
  holder: "Kabir Rao",
  actor: "Kabir Rao (account owner)",
  context: "Password recovery · Vadodara, GJ · 21:04 IST",
  startScore: 500,
  events: [
    {
      t: 0.6,
      label: "Device recognised",
      detail: "Fingerprint matches a device trusted for 730 days.",
      delta: +150, scoreAfter: 650, category: "device", severity: "good",
      simulated: true, source: "On-device fingerprint + device trust ledger",
    },
    {
      t: 1.4,
      label: "Behaviour consistent with owner",
      detail: "Typing cadence on DOB & mobile matches enrolled profile (0.94).",
      delta: +112, scoreAfter: 762, category: "behavior", severity: "good",
      simulated: false, source: "LIVE on-device keystroke-dynamics sensor",
    },
    {
      t: 2.2,
      label: "SIM stable",
      detail: "No SIM change in 4 years — no swap indicators.",
      delta: +60, scoreAfter: 822, category: "sim", severity: "good",
      simulated: true, source: "Telecom MNRL / carrier SIM-swap API",
    },
    {
      t: 3.0,
      label: "Network matches home",
      detail: "Connection from registered home broadband (AS24560, Vadodara).",
      delta: +58, scoreAfter: 880, category: "network", severity: "good",
      simulated: true, source: "ASN reputation + geo-velocity check",
    },
  ],
  finalScore: 880,
  band: "HIGH TRUST  ·  score ≥ 700",
  decision:
    "Recovery approved with a single in-app biometric confirmation. No OTP, no branch visit. Friction spent: near zero.",
  graph: {
    nodes: [
      { id: "acct", label: "Kabir's account", kind: "account", danger: false, x: 50, y: 50 },
      { id: "dev", label: "Trusted device · 730d", kind: "device", danger: false, x: 50, y: 18 },
      { id: "net", label: "Home broadband", kind: "ip", danger: false, x: 22, y: 76 },
    ],
    edges: [
      { from: "acct", to: "dev", danger: false },
      { from: "acct", to: "net", danger: false },
    ],
  },
};

// ---------------------------------------------------------------------------
// SCENARIO B — THREAT
// The SAME account, now attacked: attacker on a new device, SIM swapped 6h ago,
// connecting from a datacenter in another city. Trust COLLAPSES from the
// account's standing (880) down into the cooling-off band.
// ---------------------------------------------------------------------------
const threat: Scenario = {
  mode: "threat",
  holder: "Kabir Rao",
  actor: "Unknown actor · device #a91f-NEW",
  context: "Password recovery · Noida, UP · 02:47 IST",
  startScore: 880,
  events: [
    {
      t: 0.6,
      label: "Unrecognised device",
      detail: "No prior history for this fingerprint on Kabir's account.",
      delta: -150, scoreAfter: 730, category: "device", severity: "warn",
      simulated: true, source: "On-device fingerprint + device trust ledger",
    },
    {
      t: 1.5,
      label: "Behavioural anomaly",
      detail: "Paste events on DOB & mobile; hesitant inter-field timing — read, not recalled.",
      delta: -120, scoreAfter: 610, category: "behavior", severity: "warn",
      simulated: false, source: "LIVE on-device keystroke-dynamics sensor",
    },
    {
      t: 2.5,
      label: "SIM SWAP DETECTED",
      detail: "Registered number ported to a new SIM 6 hours ago — classic ATO precursor.",
      delta: -250, scoreAfter: 360, category: "sim", severity: "critical",
      simulated: true, source: "Telecom MNRL / carrier SIM-swap API",
    },
    {
      t: 3.4,
      label: "Impossible travel",
      detail: "Datacenter IP in Noida — 1,000 km from last genuine session in 4 minutes.",
      delta: -95, scoreAfter: 265, category: "network", severity: "critical",
      simulated: true, source: "ASN reputation + geo-velocity check",
    },
    {
      t: 4.3,
      label: "Credential exposed",
      detail: "Login credential seen in a known breach corpus (k-anonymity match).",
      delta: -50, scoreAfter: 215, category: "exposure", severity: "critical",
      simulated: true, source: "Dark-web exposure feed (HIBP-style range query)",
    },
  ],
  finalScore: 215,
  band: "HIGH RISK  ·  score 200–349",
  caseId: "TRX-4471",
  decision:
    "Recovery halted. 24-hour cooling-off engaged and alerts dispatched to every trusted channel + old devices. Attacker cannot outrun the victim's notice. Case TRX-4471 auto-filed for the SOC.",
  graph: {
    nodes: [
      { id: "acct", label: "Kabir's account", kind: "account", danger: true, x: 50, y: 48 },
      { id: "dev", label: "New device #a91f", kind: "device", danger: true, x: 50, y: 14 },
      { id: "ip", label: "Datacenter IP cluster", kind: "ip", danger: true, x: 50, y: 82 },
      { id: "v1", label: "Flagged identity #1", kind: "identity", danger: true, x: 16, y: 70 },
      { id: "v2", label: "Flagged identity #2", kind: "identity", danger: true, x: 84, y: 70 },
      { id: "v3", label: "Flagged identity #3", kind: "identity", danger: true, x: 84, y: 26 },
    ],
    edges: [
      { from: "acct", to: "dev", danger: true },
      { from: "acct", to: "ip", danger: true },
      { from: "ip", to: "v1", danger: true },
      { from: "ip", to: "v2", danger: true },
      { from: "ip", to: "v3", danger: true },
    ],
  },
};

export const scenarios: Record<"genuine" | "threat", Scenario> = { genuine, threat };

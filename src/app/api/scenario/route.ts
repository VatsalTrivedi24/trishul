// ============================================================================
// /api/scenario  —  THE BACKEND ENDPOINT
// ----------------------------------------------------------------------------
// This is one item on our "menu" (an API route). The dashboard FRONTEND sends
// a REQUEST here ("give me the genuine scenario"); this code runs on the SERVER
// and sends back the scripted timeline as a RESPONSE in JSON.
//
// This is the real request/response round-trip — the trust verdict is produced
// server-side and only the result travels to the browser, exactly as it would
// in production (the user's machine never computes its own trust score).
// ============================================================================

import { NextResponse } from "next/server";
import { scenarios } from "@/lib/scenarios";

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode");

  if (mode !== "genuine" && mode !== "threat") {
    return NextResponse.json(
      { error: "Unknown mode. Use ?mode=genuine or ?mode=threat." },
      { status: 400 },
    );
  }

  return NextResponse.json(scenarios[mode]);
}

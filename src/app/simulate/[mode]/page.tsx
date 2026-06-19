// ============================================================================
// /simulate/[mode]  —  the route that hosts a scenario run.
// This is a SERVER component: it reads the URL segment (genuine | threat),
// validates it, and hands it to the client-side <Simulation> runner.
// Using a route segment (not a query string) keeps the build clean and fast.
// ============================================================================
import { notFound } from "next/navigation";
import Simulation from "@/components/Simulation";

export function generateStaticParams() {
  return [{ mode: "genuine" }, { mode: "threat" }];
}

export default async function Page({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== "genuine" && mode !== "threat") notFound();
  return <Simulation mode={mode} />;
}

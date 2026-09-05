"use client";
import { useState } from "react";
type Report = {
  summary: {
    matchRate: string; 
    totalExceptions: number;
    totalMatches: number;
    totalSales: number;
  };
  matches: Array<Record<string, unknown>>;
  sales: Array<Record<string, unknown>>;
  bankRecords: Array<Record<string, unknown>>;
  exceptions: Array<Record<string, unknown>>;
};
export default function PipelineRunner({
  onComplete,
}: {
  onComplete: (report: Report) => void;
}) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  async function runPipeline() {
    setLoading(true);
    setStatus("Cleaning bank data...");
    await fetch("/api/clean-data", { method: "POST" });
    setStatus("Matching records...");
    await fetch("/api/match-data", { method: "POST" });
    setStatus("Finding exceptions...");
    await fetch("/api/exceptions", { method: "POST" });
    setStatus("Generating report...");
    const res = await fetch("/api/reports", { method: "POST" });
    const data = await res.json();
    setStatus("Reconciliation complete.");
    setLoading(false);
    onComplete(data);
  }
  return (
    <div>
      <button
        onClick={runPipeline}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-emerald-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && (
          <span className="mr-2 size-2 animate-pulse rounded-full bg-emerald-200" />
        )}
        {loading ? "Running reconciliation..." : "Run reconciliation"}
      </button>
      {status && (
        <p
          className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
          role="status"
        >
          {status}
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import ExceptionsList from "./components/ExceptionsList";
import MatchChart from "./components/MatchChart";
import MatchedTable from "./components/MatchedTable";
import PipelineRunner from "./components/PipelineRunner";
import ResetButton from "./components/ResetButton";
import SummaryCards from "./components/SummaryCards";
import UploadForm from "./components/UploadForm";

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

export default function Home() {
  const [report, setReport] = useState<Report | null>(null);
  const [checking, setChecking] = useState(true);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  // On first load, check if data already exists in the database —
  // this is what makes results survive a page refresh
  useEffect(() => {
    async function loadExisting() {
      const res = await fetch("/api/reports", { method: "POST" });
      const data = await res.json();
      if (data.summary?.totalSales > 0) {
        setReport(data);
      }
      setChecking(false);
    }
    loadExisting();
  }, []);

  useEffect(() => {
    if (report) resultsHeading.current?.focus();
  }, [report]);

  function handleResetComplete() {
    setReport(null);
  }

  if (checking) {
    return (
      <main className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-sm text-slate-500">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className=" px-4 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-700">
              Reconciliation workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Finance Controller
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Upload source files, run the reconciliation, and review the
              resulting exceptions.
            </p>
          </div>
          {report && <ResetButton onReset={handleResetComplete} />}
        </header>

        {!report && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <section
              aria-labelledby="upload-heading"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5">
                <h2
                  id="upload-heading"
                  className="text-base font-semibold text-slate-900"
                >
                  1. Upload source files
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Add the sales export and bank statement to begin.
                </p>
              </div>
              <UploadForm onUploaded={() => {}} />
            </section>
            <section
              aria-labelledby="run-heading"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5">
                <h2
                  id="run-heading"
                  className="text-base font-semibold text-slate-900"
                >
                  2. Run reconciliation
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Clean records, identify matches, and build a report.
                </p>
              </div>
              <PipelineRunner onComplete={setReport} />
            </section>
          </div>
        )}

        {report && (
          <section
            aria-labelledby="results-heading"
            className="reveal mt-8 border-t border-slate-200 pt-8"
          >
            <div className="mb-6">
              <p className="text-sm font-medium text-emerald-700">
                Reconciliation complete
              </p>
              <h2
                id="results-heading"
                ref={resultsHeading}
                tabIndex={-1}
                className="mt-1 text-2xl font-semibold tracking-tight text-slate-900"
              >
                Results
              </h2>
            </div>
            <SummaryCards summary={report.summary} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
              <MatchedTable
                matches={report.matches}
                sales={report.sales}
                bankRecords={report.bankRecords}
              />
              <MatchChart
                matched={report.summary.totalMatches}
                unmatched={
                  report.summary.totalSales - report.summary.totalMatches
                }
              />
            </div>
            <ExceptionsList exceptions={report.exceptions} />
          </section>
        )}
      </div>
    </main>
  );
}
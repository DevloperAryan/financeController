"use client";

import { useState } from "react";

type UploadResult = {
  success: boolean;
  salesLoaded?: number;
  bankRecordsLoaded?: number;
  error?: string;
};

export default function UploadForm({
  onUploaded,
}: {
  onUploaded: (result: UploadResult) => void;
}) {
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!salesFile || !bankFile) {
      setIsError(true);
      setStatus("Select both source files before uploading.");
      return;
    }
    setLoading(true);
    setIsError(false);
    setStatus("Uploading source files...");
    const formData = new FormData();
    formData.append("salesFile", salesFile);
    formData.append("bankFile", bankFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const result: UploadResult = await res.json();
    setLoading(false);
    if (result.success) {
      setStatus(
        `Upload complete. ${result.salesLoaded} sales and ${result.bankRecordsLoaded} bank records are ready.`,
      );
      onUploaded(result);
    } else {
      setIsError(true);
      setStatus(`Upload failed: ${result.error}`);
    }
  }

  return (
    <div className="space-y-5" aria-busy={loading}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="sales-file" className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Sales file
          </span>
          <input
            id="sales-file"
            aria-describedby="sales-file-help sales-file-name"
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition file:mr-3 file:rounded-md file:border-0 file:bg-emerald-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-800 hover:border-emerald-400 hover:file:bg-emerald-200"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(event) => setSalesFile(event.target.files?.[0] ?? null)}
          />
          <span
            id="sales-file-help"
            className="mt-1.5 block text-xs text-slate-500"
          >
            CSV or Excel
          </span>
          <span
            id="sales-file-name"
            className="mt-1 block text-xs font-medium text-slate-700"
          >
            {salesFile?.name ?? "No file selected"}
          </span>
        </label>
        <label htmlFor="bank-file" className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Bank statement
          </span>
          <input
            id="bank-file"
            aria-describedby="bank-file-help bank-file-name"
            className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition file:mr-3 file:rounded-md file:border-0 file:bg-emerald-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-800 hover:border-emerald-400 hover:file:bg-emerald-200"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(event) => setBankFile(event.target.files?.[0] ?? null)}
          />
          <span
            id="bank-file-help"
            className="mt-1.5 block text-xs text-slate-500"
          >
            CSV or Excel
          </span>
          <span
            id="bank-file-name"
            className="mt-1 block text-xs font-medium text-slate-700"
          >
            {bankFile?.name ?? "No file selected"}
          </span>
        </label>
      </div>
      <button
        onClick={handleUpload}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-slate-800 active:translate-y-px disabled:cursor-wait disabled:opacity-60"
      >
        {loading && (
          <span className="mr-2 size-2 animate-pulse rounded-full bg-white" />
        )}
        {loading ? "Uploading files..." : "Upload files"}
      </button>
      {status && (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${isError ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-100 bg-emerald-50 text-emerald-800"}`}
          role={isError ? "alert" : "status"}
          aria-live="polite"
        >
          {status}
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type Item = Record<string, unknown>;

export default function MatchDetail({
  match,
  onClose,
}: {
  match: Item | null;
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (match) closeButton.current?.focus();
  }, [match]);
  if (!match) return null;
  const sale = match.sale as Item | undefined;
  const bankRecord = match.bankRecord as Item | undefined;
  const amountDiff =
    sale && bankRecord
      ? Math.abs(Number(sale.amount) - Number(bankRecord.cleaned_amount))
      : null;
  const saleDate = sale ? new Date(String(sale.sale_date)).getTime() : null;
  const bankDate = bankRecord
    ? new Date(String(bankRecord.cleaned_date)).getTime()
    : null;
  const daysDiff =
    saleDate && bankDate ? Math.abs(saleDate - bankDate) / 86400000 : null;
  function close() {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, 150);
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") close();
  }
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 transition-opacity duration-150 ${isClosing ? "opacity-0" : "opacity-100"}`}
      onClick={close}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        className={`w-full max-w-lg rounded-xl bg-white p-5 shadow-xl sm:p-6 ${isClosing ? "modal-exit" : "modal-enter"}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-detail-title"
        aria-describedby="match-detail-summary"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Reconciliation record
            </p>
            <h3
              id="match-detail-title"
              className="mt-1 text-lg font-semibold text-slate-900"
            >
              Match detail
            </h3>
          </div>
          <button
            ref={closeButton}
            onClick={close}
            className="rounded-md px-2 py-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:translate-y-px"
          >
            Close<span className="sr-only"> match detail</span>
          </button>
        </div>
        <div id="match-detail-summary" className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-600">
              Sale record
            </p>
            <p className="text-slate-800">ID: {String(sale?.id ?? "-")}</p>
            <p className="text-slate-800">
              Amount: ₹{String(sale?.amount ?? "-")}
            </p>
            <p className="text-slate-800">
              Date: {String(sale?.sale_date ?? "-")}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-600">
              Bank record
            </p>
            <p className="text-slate-800">
              ID: {String(bankRecord?.id ?? "-")}
            </p>
            <p className="text-slate-800">
              Amount: ₹{String(bankRecord?.cleaned_amount ?? "-")}
            </p>
            <p className="text-slate-800">
              Date: {String(bankRecord?.cleaned_date ?? "-")}
            </p>
          </div>
        </div>
        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="mb-2 text-sm font-medium text-slate-600">
            Why this matched
          </p>
          <p className="text-slate-700">
            Amount difference: ₹{amountDiff?.toFixed(2) ?? "-"}
          </p>
          <p className="text-slate-700">
            Date difference: {daysDiff ?? "-"} day(s)
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import MatchDetail from "./MatchDetail";

type Item = Record<string, unknown>;

export default function MatchedTable({
  matches,
  sales,
  bankRecords,
}: {
  matches: Item[];
  sales: Item[];
  bankRecords: Item[];
}) {
  const [selected, setSelected] = useState<Item | null>(null);
  function openDetail(match: Item) {
    const sale = sales.find((item) => item.id === match.sale_id);
    const bankRecord = bankRecords.find(
      (item) => item.id === match.bank_record_id,
    );
    setSelected({ ...match, sale, bankRecord });
  }
  return (
    <section
      aria-labelledby="matched-heading"
      className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 id="matched-heading" className="font-semibold text-slate-900">
            Matched records
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Open a record to review its match details.
          </p>
        </div>
        <span
          aria-label={`${matches.length} matched records`}
          className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700"
        >
          {matches.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <caption className="sr-only">Matched reconciliation records</caption>
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Sale ID</th>
              <th className="px-5 py-3">Bank record ID</th>
              <th className="px-5 py-3">Matched on</th>
              <th className="w-24 px-5 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matches.map((match) => (
              <tr
                key={String(match.id)}
                className="text-slate-700 transition-colors duration-150 hover:bg-emerald-50/50"
              >
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  {String(match.sale_id)}
                </td>
                <td className="px-5 py-3.5">{String(match.bank_record_id)}</td>
                <td className="px-5 py-3.5">
                  {new Date(String(match.created_at)).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => openDetail(match)}
                    className="rounded-md px-2 py-1 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100 active:translate-y-px"
                  >
                    View
                    <span className="sr-only">
                      {" "}
                      match for sale {String(match.sale_id)}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MatchDetail
        key={String(selected?.id ?? "closed")}
        match={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
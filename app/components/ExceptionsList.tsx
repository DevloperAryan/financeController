type Exception = Record<string, unknown>;
export default function ExceptionsList({
  exceptions,
}: {
  exceptions: Exception[];
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Exceptions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Records that need manual review.
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700">
          {exceptions.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Record ID</th>
              <th className="px-5 py-3">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exceptions.map((exception) => (
              <tr
                key={String(exception.id)}
                className="text-slate-700 transition-colors duration-150 hover:bg-amber-50/50"
              >
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  {String(exception.record_type)}
                </td>
                <td className="px-5 py-3.5">{String(exception.record_id)}</td>
                <td className="px-5 py-3.5">{String(exception.reason)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

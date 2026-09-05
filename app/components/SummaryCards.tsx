export default function SummaryCards({
  summary,
}: {
  summary: {
    matchRate: string; // yahan bhi number se string kiya
    totalExceptions: number;
    totalMatches: number;
    totalSales: number;
  };
}) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5 transition-shadow duration-200 hover:shadow-sm">
        <div className="text-3xl font-semibold tracking-tight text-emerald-900">
          {summary.matchRate}%
        </div>
        <div className="mt-1 text-sm font-medium text-emerald-800">
          Match rate
        </div>
      </div>
      <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5 transition-shadow duration-200 hover:shadow-sm">
        <div className="text-3xl font-semibold tracking-tight text-amber-900">
          {summary.totalExceptions}
        </div>
        <div className="mt-1 text-sm font-medium text-amber-800">
          Exceptions requiring review
        </div>
      </div>
    </div>
  );
}

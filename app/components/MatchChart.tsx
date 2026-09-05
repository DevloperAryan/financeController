"use client";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
export default function MatchChart({
  matched,
  unmatched,
}: {
  matched: number;
  unmatched: number;
}) {
  const data = [
    { name: "Matched", value: matched },
    { name: "Unmatched", value: unmatched },
  ];
  const colors = ["#047857", "#d97706"];
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Match overview</h3>
      <p className="mt-1 text-sm text-slate-500">
        Distribution of reconciled records.
      </p>
      <div className="mt-2 h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={54}
              outerRadius={82}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

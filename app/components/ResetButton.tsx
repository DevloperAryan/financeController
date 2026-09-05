"use client";

import { useState } from "react";

export default function ResetButton({ onReset }: { onReset: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    const confirmed = confirm("This will delete all uploaded data. Continue?");
    if (!confirmed) return;

    setLoading(true);
    await fetch("/api/reset", { method: "POST" });
    setLoading(false);
    onReset();
  }

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Clearing..." : "Delete and start new files"}
    </button>
  );
}
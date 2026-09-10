import "dotenv/config";
import { supabase } from "./db";

export async function getReport() {
  const { data: sales } = await supabase.from("sales").select("*");
  const { data: bankRecords } = await supabase.from("bank_records").select("*");
  const { data: matches } = await supabase.from("matches").select("*");
  const { data: exceptions } = await supabase.from("exceptions").select("*");
  const salesList = sales ?? [];
  const bankRecordsList = bankRecords ?? [];
  const matchesList = matches ?? [];
  const exceptionsList = exceptions ?? [];

  const matchRate =
    salesList.length > 0
      ? ((matchesList.length / salesList.length) * 100).toFixed(1)
      : "0";
  const saleExceptions = exceptionsList.filter((e) => e.record_type === "sale");
  const bankExceptions = exceptionsList.filter((e) => e.record_type === "bank_record");

  return {
    sales: salesList,
    bankRecords: bankRecordsList,
    matches: matchesList,
    exceptions: exceptionsList,
    saleExceptions,
    bankExceptions,
    summary: {
      totalSales: salesList.length,
      totalBankRecords: bankRecordsList.length,
      totalMatches: matchesList.length,
      matchRate,
      totalExceptions: exceptionsList.length,
      unmatchedSales: saleExceptions.length,
      unmatchedBankRecords: bankExceptions.length,
    },
  };
}
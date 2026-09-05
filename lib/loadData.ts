import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { supabase } from "./db";

// Sales CSV load karke Supabase mein daalna
async function loadSales() {
  const filePath = path.join(process.cwd(), "data", "sales.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = parsed.data.map((row: any) => ({
    id: row.id,
    amount: parseFloat(row.amount),
    sale_date: row.sale_date,
    customer_name: row.customer_name,
  }));

  const { error } = await supabase.from("sales").insert(rows);
  if (error) console.error("Sales insert error:", error);
  else console.log(`✓ ${rows.length} sales records loaded`);
}

// Bank statement CSV load karke Supabase mein daalna (raw, abhi clean nahi kiya)
async function loadBankRecords() {
  const filePath = path.join(process.cwd(), "data", "bank-statement.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = parsed.data.map((row: any) => ({
    raw_text: row.raw_text,
  }));

  const { error } = await supabase.from("bank_records").insert(rows);
  if (error) console.error("Bank records insert error:", error);
  else console.log(`✓ ${rows.length} bank records loaded`);
}

export async function runLoadData() {
  await loadSales();
  await loadBankRecords();
  console.log("Loding data.....")
  return {success:true};
}


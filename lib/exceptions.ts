import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { supabase } from "./db";

export async function findExceptions() {

  await supabase.from("exceptions").delete().neq("id", 0);
  // Un-matched sales dhoondo
  const { data: sales } = await supabase.from("sales").select("*");
  const { data: matches } = await supabase.from("matches").select("sale_id");
  const matchedSaleIds = new Set((matches ?? []).map((m) => m.sale_id));

  const unmatchedSales = (sales ?? []).filter((s) => !matchedSaleIds.has(s.id));

  for (const sale of unmatchedSales) {
    await supabase.from("exceptions").insert({
      record_type: "sale",
      record_id: sale.id,
      reason: `No matching bank record found for ₹${sale.amount} on ${sale.sale_date}`,
    });
    console.log(`✗ Exception: ${sale.id} — no bank match found`);
  }

  // Un-matched bank records dhoondo (extra/bogus entries)
  const { data: unmatchedBank } = await supabase
    .from("bank_records")
    .select("*")
    .eq("matched", false);

  for (const record of unmatchedBank ?? []) {
    await supabase.from("exceptions").insert({
      record_type: "bank_record",
      record_id: String(record.id),
      reason: `Bank record has no matching sale — possibly a duplicate or unknown transaction (₹${record.cleaned_amount})`,
    });
    console.log(`✗ Exception: bank record ${record.id} — no sale match found`);
  }

  return { success: true, exceptions: unmatchedSales.length + (unmatchedBank?.length ?? 0) };
}

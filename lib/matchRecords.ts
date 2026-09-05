import 'dotenv/config'

import { supabase } from "./db";

export async function matchRecords() {
  const { data: sales, error: salesError } = await supabase.from("sales").select("*");
  const { data: bankRecords, error: bankError } = await supabase
    .from("bank_records")
    .select("*")
    .eq("matched", false);

  if (salesError || bankError || !sales || !bankRecords) {
    console.error("Failed to fetch data:", salesError || bankError);
    return;
  }

  console.log(`Matching ${sales.length} sales against ${bankRecords.length} bank records...`);

  let matchCount = 0;

  for (const sale of sales) {
    // Pehle already matched hue sale ko skip karo
    const { data: existing } = await supabase
      .from("matches")
      .select("id")
      .eq("sale_id", sale.id)
      .maybeSingle();
    if (existing) continue;

    // Best match dhoondo: amount close ho (within ₹5, fee-deduction allow karne ke liye)
    // aur date 2 din ke andar ho
    const match = bankRecords.find((b) => {
      if (b.cleaned_amount == null || b.cleaned_date == null) return false;

      const amountDiff = Math.abs(sale.amount - b.cleaned_amount);
      const amountOk = amountDiff <= 5 || amountDiff <= sale.amount * 0.03; // ₹5 ya 3% tak allow

      const saleDate = new Date(sale.sale_date).getTime();
      const bankDate = new Date(b.cleaned_date).getTime();
      const daysDiff = Math.abs(saleDate - bankDate) / (1000 * 60 * 60 * 24);
      const dateOk = daysDiff <= 2;

      return amountOk && dateOk;
    });

    if (match) {
      await supabase.from("matches").insert({ sale_id: sale.id, bank_record_id: match.id });
      await supabase.from("bank_records").update({ matched: true }).eq("id", match.id);
      matchCount++;
      console.log(`✓ Matched ${sale.id} (₹${sale.amount}) → bank record ${match.id} (₹${match.cleaned_amount})`);
    } else {
      console.log(`✗ No match found for ${sale.id} (₹${sale.amount}, ${sale.sale_date})`);
    }
  }

    return { success: true, matched: matchCount, total: sales.length };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseUploadedFile } from "@/lib/parseFile";
import { supabase } from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();

  const salesFile = formData.get("salesFile") as File;
  const bankFile = formData.get("bankFile") as File;

  if (!salesFile || !bankFile) {
    return Response.json({ success: false, error: "Both files are Required. ie \'Sales\' and \'Bank\' Statements.." }, { status: 400 });
  }

  const salesBuffer = Buffer.from(await salesFile.arrayBuffer());
  const salesRows = parseUploadedFile(salesFile.name, salesBuffer);

  const salesData = salesRows.map((row: any) => ({
    id: row.id,
    amount: parseFloat(row.amount),
    sale_date: row.sale_date,
    customer_name: row.customer_name,
  }));

  const { error: salesError } = await supabase.from("sales").insert(salesData);

  // Bank file parse karo — yahan hum raw text hi store kar rahe hain,
  // cleaning agla step (clean-data) karega
  const bankBuffer = Buffer.from(await bankFile.arrayBuffer());
  const bankRows = parseUploadedFile(bankFile.name, bankBuffer);

  const bankData = bankRows.map((row: any) => ({
    raw_text: row.raw_text ?? JSON.stringify(row), // agar raw_text column nahi hai, poori row hi le lo
  }));

  const { error: bankError } = await supabase.from("bank_records").insert(bankData);

  if (salesError || bankError) {
    return Response.json({ success: false, error: salesError?.message || bankError?.message });
  }

  return Response.json({
    success: true,
    salesLoaded: salesData.length,
    bankRecordsLoaded: bankData.length,
  });
}
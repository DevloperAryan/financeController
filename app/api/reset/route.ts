import { supabase } from "@/lib/db";

export async function POST() {
  const { error } = await supabase.rpc("reset_all_tables");
  if (error) return Response.json({ success: false, error: error.message });
  return Response.json({ success: true });
}
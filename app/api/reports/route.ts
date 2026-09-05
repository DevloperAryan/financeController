import { getReport } from "@/lib/reports";

export async function POST(){
    const result = await getReport();
    return Response.json(result);
}
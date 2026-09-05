import { matchRecords } from "@/lib/matchRecords";

export async function POST(){
    const result = await matchRecords();
    return Response.json(result);
}
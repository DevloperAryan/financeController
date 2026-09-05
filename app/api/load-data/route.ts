import { runLoadData } from "@/lib/loadData";

export async function POST(){
    const result = await runLoadData();
    return Response.json(result);
}
import { cleanStatement } from "@/lib/cleanStatement";

export async function POST(){
    const result = await cleanStatement();
    return Response.json(result);
}
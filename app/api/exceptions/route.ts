
import { findExceptions } from "@/lib/exceptions";

export async function POST(){
    const result = await findExceptions();
    return Response.json(result);
}
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import { supabase } from "./db";

const cleanupAgent = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});


async function cleanOneRecord(id: number, rawText: string) {
    try {
        const response = await cleanupAgent.chat.completions.create({
            model: "openrouter/free",
            messages: [
                {
                    role: "system",
                    content:
                        "You extract structured data from messy bank statement text. " +
                        "IMPORTANT: dates in the input are always DAY-FIRST format (e.g. 03/08/26 means 3rd August 2026, NOT March 8th). " +
                        "Reply with ONLY a JSON object, nothing else. No explanation, no markdown code blocks. " +
                        `Format exactly: {"amount": 495.00, "date": "2026-09-03", "ref": "4521"}`,
                },
                { role: "user", content: rawText },
            ],
            temperature: 0,
        });

        const content = response.choices[0].message.content ?? "{}";

       
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error(`No JSON found in response: ${content}`);
        }
        const cleaned = JSON.parse(jsonMatch[0]);

        const { error } = await supabase
            .from("bank_records")
            .update({
                cleaned_amount: cleaned.amount,
                cleaned_date: cleaned.date,
                cleaned_ref: cleaned.ref,
            })
            .eq("id", id);

        if (error) console.error(`✗ DB error for record ${id}:`, error);
        else console.log(`✓ Cleaned record ${id}: ₹${cleaned.amount} on ${cleaned.date}`);
    } catch (err) {
        // Yeh record skip ho jayega, par baaki records pe script chalta rahega
        console.error(`✗ Failed to clean record ${id}:`, err instanceof Error ? err.message : err);
    }
}

export async function cleanStatement() {
    const { data: records, error } = await supabase
        .from("bank_records")
        .select("*")
        .is("cleaned_amount", null);

    if (error || !records) {
       return { success: false, error: error?.message };
    }

    for (const record of records) {
        await cleanOneRecord(record.id, record.raw_text);
    }

    return {success: true, cleaned: records.length};
}

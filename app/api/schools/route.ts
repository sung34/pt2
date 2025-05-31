import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { data, error, status } = await supabase
        .from("school")
        .select("*");

    if (error && status !== 406) {
        console.error("Supabase error in Route Handler:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(data, { status: 200 });
}
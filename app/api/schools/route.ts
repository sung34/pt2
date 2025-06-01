// get 함수 학생들 정보 가져오기 using supabase server client
import { createServerSupabase } from "@/lib/supabase/supabaseServer";
import { NextResponse } from "next/server";



export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("school").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

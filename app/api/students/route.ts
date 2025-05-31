import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Supabase 클라이언트 경로 확인
import { revalidateTag } from "next/cache";

// 이 Route Handler는 기본적으로 요청 시 실행됩니다 (동적).
// 특정 시간 간격으로 ISR을 적용하고 싶다면 revalidate 값을 설정할 수 있으나,
// 태그 기반 온디맨드 재검증이 주 목적이므로 필수는 아닙니다.
// export const revalidate = 0; // 또는 생략 (기본값, 동적)

export async function GET(req: Request) {
    try {
        const { data, error, status } = await supabase
            .from("student") // 테이블 이름 확인
            .select("*")
            .in("status", ["active", "paused", "inactive"]);

        if (error && status !== 406) { // 406은 PostgREST에서 리소스가 없을 때의 정상적인 응답일 수 있음
            console.error("Supabase error in Route Handler:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            // 데이터가 없는 경우 빈 배열 또는 적절한 응답
            return NextResponse.json([], { status: 200 });
        }

        // Route Handler는 순수하게 데이터를 JSON으로 반환합니다.
        // HTTP 캐시 헤더(Cache-Control)는 여기서 설정할 수 있지만,
        // Next.js의 데이터 캐시 태그와는 별개로 동작합니다.
        return NextResponse.json(data, { status: 200 });

    } catch (e: any) {
        console.error("Unexpected error in Route Handler:", e.message);
        return NextResponse.json({ error: "An unexpected error occurred in Route Handler" }, { status: 500 });
    }
}

// app/api/student/route.ts (또는 별도 PUT handler)
export async function PUT(req: Request) {
    try {
      const body = await req.json();
      const { student_id, ...updateData } = body;
  
      const { data, error } = await supabase
        .from("student")
        .update(updateData)
        .eq("student_id", student_id)
        .select("*");
  
      if (error) throw error;
      revalidateTag("students"); 
      return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
      console.error("Unexpected error in PUT Handler:", e.message);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
  }
  
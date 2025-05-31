import { createClient } from '@supabase/supabase-js';


if (!process.env.SUPABASE_URL || !process.env.UPABASE_ANON_KEY) {
  console.error("FATAL: Supabase URL or Anon Key is missing in server environment variables!");
  // 여기서 에러를 던지거나, null 클라이언트를 반환하는 등의 처리를 할 수 있으나,
  // 일단 로그를 통해 Vercel 환경에서 변수가 제대로 전달되는지 확인하는 것이 중요합니다.
}
export const supabase = createClient(


  process.env.SUPABASE_URL!,
  process.env.UPABASE_ANON_KEY!
);

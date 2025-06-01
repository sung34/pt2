// app/actions/vocabularyActions.ts
'use server';

import { createServerSupabase } from '@/lib/supabase/supabaseServer'; // 서버용 Supabase 클라이언트
import { revalidateTag } from 'next/cache';
import { Student } from '@/type/server/db-types';

export async function saveStudentVocabulary(studentData: Partial<Student> & { student_id: string }) {
  const { student_id, ...dataToUpdate } = studentData;
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from('student')
    .update(dataToUpdate)
    .eq('student_id', student_id);

  if (error) {
    console.error("Error saving student vocab:", error);
    return { success: false, message: error.message };
  }
  revalidateTag('vocabulary'); // 학생 데이터 캐시 무효화
  return { success: true, message: '학생 정보가 저장되었습니다.' };
}

export async function processPrintAndUpdateStatus(studentsToUpdate: Student[]) {
  // ... (로컬에서 계산된 toprint -> printed 로직은 클라이언트에서 이미 반영되었다고 가정)
  // 여기서는 DB에 최종 상태(printed_session_ranges, toprint_session_ranges)를 업데이트
  for (const student of studentsToUpdate) {
    const { error } = await supabase
      .from('student')
      .update({
        printed_session_ranges: student.printed_session_ranges,
        toprint_session_ranges: student.toprint_session_ranges,
      })
      .eq('student_id', student.student_id);
    if (error) { /* 에러 처리 */ }
  }
  revalidateTag('vocabulary');
  return { success: true, message: '출력 처리 및 상태가 업데이트되었습니다.' };
}

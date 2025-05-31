export const dynamic = "auto";


import { Student } from "@/type/server/db-types";
import Vocab from '@/components/vocabulary-page/vocab-editor';
import { Separator } from "@/components/ui/separator";

export default async function StudentVocabPage() {
  // const students: Student[] = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vocabulary`, {
  //   method: "GET",
  //   next: {
  //     revalidate: 604800,
  //     tags: ["student-active"],
  //   }
  // })
  //   .then(res => res.json());
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/vocabulary", {
    next: { tags: ["student-active"], revalidate: 604800 }
  });
  if (!res.ok) {
    const errorText = await res.text(); // 실제 반환된 내용을 확인
    console.error(`API Error for ${process.env.NEXT_PUBLIC_API_URL} (Status: ${res.status}): ${errorText.substring(0, 500)}`); // 처음 500자만 로깅
    throw new Error(`Failed to fetch data from ${process.env.NEXT_PUBLIC_API_URL}. Status: ${res.status}`);
  }
  try {
    const students: Student[] = await res.json();
    return (
      <>
        <div className='mt-5'>
  
          <h1 className="text-2xl font-bold mb-4">
            학생 단어장 관리
          </h1>
          <Separator />
        </div>
        <Vocab studentsData={students} />
      </>
    );
  } catch (e: any) {
    const responseText = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/vocabulary").then(r => r.text()); // 재시도하여 텍스트 가져오기 (디버깅용)
    console.error(`JSON Parse Error for ${process.env.NEXT_PUBLIC_API_URL}. Response was: ${responseText.substring(0, 500)}`, e);
    throw new Error(`Failed to parse JSON from ${process.env.NEXT_PUBLIC_API_URL}. Original error: ${e.message}`);
  }


  
}
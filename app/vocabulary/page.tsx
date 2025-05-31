import { Student } from "@/type/server/db-types";
import Vocab from '@/components/vocabulary-page/vocab-editor';
import { Separator } from "@/components/ui/separator";

export default async function StudentVocabPage() {
  const students: Student[] = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vocabulary`, {
    method: "GET",
    next: {
      revalidate: 604800,
      tags: ["student-active"],
    }
  })
    .then(res => res.json());


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
}
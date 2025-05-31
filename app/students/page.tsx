// export const dynamic = "force-static";

import { columns } from "@/components/student-page/columns";
import DataTable from "@/components/student-page/data-table";
import { Separator } from "@/components/ui/separator";
import { School, Student, VocabularyBook } from "@/type/server/db-types";

export default async function StudentsPage() {
  const [studentsRes, schoolsRes, vocabulariesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
      cache: "force-cache",
      next: { tags: ["student"] }
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`, {
      cache: "force-cache",
      next: { tags: ["school"] }
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vocab-names`, {
      cache: "force-cache",
      next: { tags: ["vocab-names"] }
    })
  ]);

  const students: Student[] = await studentsRes.json();
  const schools: School[] = await schoolsRes.json();
  const vocabularies: VocabularyBook[] = await vocabulariesRes.json();
  
  return (<>
    <div className="mt-5">
      <h1 className="text-2xl font-bold mb-4">
        학생 관리
      </h1>
      <Separator />
    </div>

      <DataTable columns={columns} data={students} meta={{ schools, vocabularies }} />

  </>

  )
} 
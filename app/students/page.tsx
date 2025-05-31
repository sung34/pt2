export const dynamic = "auto";

import { columns } from "@/components/student-page/columns";
import DataTable from "@/components/student-page/data-table";
import { Separator } from "@/components/ui/separator";
import { School, Student, VocabularyBook } from "@/type/server/db-types";

export default async function StudentsPage() {
  const [studentsRes, schoolsRes, vocabulariesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
      next: { tags: ["students"], revalidate: 604800 }
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`, {
      next: { tags: ["schools"], revalidate: 604800 }
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vocab-names`, {
      next: { tags: ["vocab-names"], revalidate: 604800 }
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
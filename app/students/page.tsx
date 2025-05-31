
import { columns } from "@/components/student-page/columns";
import DataTable from "@/components/student-page/data-table";
import { Separator } from "@/components/ui/separator";
import { fetchAllStudents, fetchAllSchools, fetchAllVocabularyBooks } from "@/lib/student-api";

export const revalidate = 604800;

export default async function StudentsPage() {
  const [students, schools, vocabularies] = await Promise.all([
    fetchAllStudents(),
    fetchAllSchools(),
    fetchAllVocabularyBooks()
  ]);


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
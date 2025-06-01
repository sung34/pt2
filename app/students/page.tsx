
import StudentTable from "@/components/student-page/student-table";
import { Separator } from "@/components/ui/separator";

import { fetchAllSchools, fetchAllStudents, fetchAllVocabularyBooks } from "@/lib/student-table-server";

export default async function StudentsPage() {
  const [students, schools, vocabularies] = await Promise.all([
    fetchAllStudents(),
    fetchAllSchools(),
    fetchAllVocabularyBooks()
  ])
  // const [students, schools, vocabularies] = await Promise.all([
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/students`, {
  //     next: { tags: ['students'], revalidate: 86400 }
  //   }).then(res => res.json()),
  
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`, {
  //     next: { tags: ['schools'], revalidate: 604800 * 4  }
  //   }).then(res => res.json()),
  
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vocab-books`, {
  //     next: { tags: ['vocab-books'], revalidate: 604800 * 4 }
  //   }).then(res => res.json()),
  // ]);


  return (
    <>
      <div className="mt-5">
        <h1 className="text-2xl font-bold mb-4">
          학생 관리
        </h1>
        <Separator />
      </div>
      <StudentTable studentData={students} schools={schools} vocabularies={vocabularies} />
    </>

  )
} 
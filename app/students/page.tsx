export const dynamic = "auto";

import { columns } from "@/components/student-page/columns";
import DataTable from "@/components/student-page/data-table";
import { Separator } from "@/components/ui/separator";
import { School, Student, VocabularyBook } from "@/type/server/db-types";

export default async function StudentsPage() {
  // const [studentsRes, schoolsRes, vocabulariesRes] = await Promise.all([
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
  //     next: { tags: ["students"], revalidate: 604800 }
  //   }),
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`, {
  //     next: { tags: ["schools"], revalidate: 604800 }
  //   }),
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vocab-names`, {
  //     next: { tags: ["vocab-names"], revalidate: 604800 }
  //   })
  // ]);

  // const students: Student[] = await studentsRes.json();
  // const schools: School[] = await schoolsRes.json();
  // const vocabularies: VocabularyBook[] = await vocabulariesRes.json();

  // return (<>
  //   <div className="mt-5">
  //     <h1 className="text-2xl font-bold mb-4">
  //       학생 관리
  //     </h1>
  //     <Separator />
  //   </div>

  //   <DataTable columns={columns} data={students} meta={{ schools, vocabularies }} />

  // </>

  // )
  const apiUrlBase = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrlBase) {
    console.error("FATAL: NEXT_PUBLIC_API_URL is not defined. Check Vercel environment variables.");
    // 빌드 실패를 유도하거나, 사용자에게 명확한 에러 페이지를 보여줘야 합니다.
    // 여기서는 간단히 에러를 던져 빌드가 실패하도록 합니다.
    throw new Error("Application API URL is not configured. Build cannot proceed.");
  }

  console.log(`StudentsPage: Using API Base URL: ${apiUrlBase}`);

  let students: Student[] = [];
  let schools: School[] = [];
  let vocabularies: VocabularyBook[] = [];
  let fetchError: string | null = null;

  try {
    const [studentsRes, schoolsRes, vocabulariesRes] = await Promise.all([
      fetch(`${apiUrlBase}/api/students`, {
        next: { tags: ["students"], revalidate: 604800 }
      }),
      fetch(`${apiUrlBase}/api/schools`, {
        next: { tags: ["schools"], revalidate: 604800 }
      }),
      fetch(`${apiUrlBase}/api/vocab-names`, { // 이 API 엔드포인트가 실제로 존재하는지 확인 필요
        next: { tags: ["vocab-names"], revalidate: 604800 }
      })
    ]);

    // 각 응답에 대한 오류 처리
    if (!studentsRes.ok) {
      const errorText = await studentsRes.text();
      console.error(`Error fetching students (Status: ${studentsRes.status}): ${errorText.substring(0, 500)}`);
      throw new Error(`Failed to fetch students. Status: ${studentsRes.status}`);
    }
    if (!schoolsRes.ok) {
      const errorText = await schoolsRes.text();
      console.error(`Error fetching schools (Status: ${schoolsRes.status}): ${errorText.substring(0, 500)}`);
      throw new Error(`Failed to fetch schools. Status: ${schoolsRes.status}`);
    }
    if (!vocabulariesRes.ok) {
      const errorText = await vocabulariesRes.text();
      console.error(`Error fetching vocab-names (Status: ${vocabulariesRes.status}): ${errorText.substring(0, 500)}`);
      throw new Error(`Failed to fetch vocab-names. Status: ${vocabulariesRes.status}`);
    }

    // JSON 파싱 시도
    try {
      students = await studentsRes.json();
    } catch (e) {
      console.error("Failed to parse students JSON. Response was likely not JSON.", e);
      throw new Error("Students API did not return valid JSON.");
    }
    try {
      schools = await schoolsRes.json();
    } catch (e) {
      console.error("Failed to parse schools JSON. Response was likely not JSON.", e);
      throw new Error("Schools API did not return valid JSON.");
    }
    try {
      vocabularies = await vocabulariesRes.json();
    } catch (e) {
      console.error("Failed to parse vocab-names JSON. Response was likely not JSON.", e);
      throw new Error("Vocab-names API did not return valid JSON.");
    }

  } catch (error: any) {
    console.error("Error during data fetching in StudentsPage:", error.message);
    fetchError = error.message;
  }

  if (fetchError) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">데이터 로딩 실패 (학생 관리)</h1>
        <p>정보를 가져오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-muted-foreground mt-2">오류: {fetchError}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 px-4 md:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          학생 관리
        </h1>
        <Separator />
      </div>
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <DataTable columns={columns} data={students} meta={{ schools, vocabularies }} />
      </div>
    </>
  );
} 
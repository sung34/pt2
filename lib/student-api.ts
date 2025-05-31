// lib/student-api.ts
import { supabase } from "@/lib/supabase/supabaseClient";
import { School, Student, VocabularyBook } from "@/type/server/db-types";

export async function fetchActiveStudents(): Promise<Student[]> {
  const { data, error, status } = await supabase
    .from("student")
    .select("*")
    .in("status", ["active"]);

  if (error && status !== 406) {
    console.error("Supabase error in lib/student-api:", error.message);
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  } else if (!data) {
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return data ?? [];
}

export async function fetchAllStudents(): Promise<Student[]> {
  const { data, error, status } = await supabase
    .from("student")
    .select("*");

  if (error && status !== 406) {
    console.error("Supabase error in lib/student-api:", error.message);
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  } else if (!data) {
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return data ?? [];
}


// vocabulary_book get api
export async function fetchAllVocabularyBooks(): Promise<VocabularyBook[]> {
  const { data, error, status } = await supabase
    .from("vocabulary_book")
    .select("*");

  if (error && status !== 406) {
    console.error("Supabase error in lib/student-api:", error.message);
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  } else if (!data) {
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return data ?? [];
}


// schools  get api
export async function fetchAllSchools(): Promise<School[]> {
  const { data, error, status } = await supabase
    .from("school")
    .select("*");

  if (error && status !== 406) {
    console.error("Supabase error in lib/student-api:", error.message);
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  } else if (!data) {
    throw new Error("학생 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return data ?? [];
}


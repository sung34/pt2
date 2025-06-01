import { School, Student, VocabularyBook } from "@/type/server/db-types";
import { createSBClient } from "./supabase/supabaseCreateClient";

export async function fetchActiveStudents(): Promise<Student[]> {
  'use cache'
  const supabase = await createSBClient();
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
  'use cache'

  const supabase = await createSBClient();
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
  'use cache'

  const supabase = await createSBClient();
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
  'use cache'

  const supabase = await createSBClient();
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


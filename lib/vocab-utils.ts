// lib/vocabularyUtils.ts

import { DayOfWeek, Student } from "@/type/server/db-types";
import { TrackingLocalCardsStateType, TrackingLocalCardsStatus, WeekDateInfo } from "@/type/client/client-types";


/**
 * 현재 주의 월요일부터 일요일까지의 날짜 정보를 반환합니다.
 */
export function getCurrentWeekDateRange(): WeekDateInfo[] {
  const today = new Date();
  const currentDayOfWeekInJS = today.getDay();
  const mondayOffset = currentDayOfWeekInJS === 0 ? -6 : 1 - currentDayOfWeekInJS;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const weekDates: WeekDateInfo[] = [];
  const dayEnumsArray: DayOfWeek[] = [
    DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
  ];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    weekDates.push({
      dayEnum: dayEnumsArray[i],
      dateObj: currentDate,
      dateStr: dateStr
    });
  }
  return weekDates;
}


// 단어장 book_id → name 매핑 상수
export const VOCABULARY_BOOKS = [
  { book_id: "4b908a99-e1b3-4d45-b2b5-1d3f166ca532", name: "VOCA" },
  { book_id: "6313be03-f441-46c3-8bd2-21a6be55b0d7", name: "불규칙 동사표" },
  { book_id: "a032075f-c3f9-4e8d-b425-8d2effec104d", name: "중학기본1800" },
  { book_id: "aaf478ff-55ce-48b1-864c-bdd424e445af", name: "모의고사" },
  { book_id: "e95ff4e2-be8e-4912-a103-a9933e20fc89", name: "중학기초1200" },
  { book_id: "fc801ff5-046a-445a-b3a0-623e8709ae8a", name: "없음" },
];

// book_id로 단어장 이름 반환
export function getVocabBookName(book_id?: string) {
  if (!book_id) return "";
  const found = VOCABULARY_BOOKS.find(b => b.book_id === book_id);
  return found ? found.name : "";
}

export function filterVocabStudents(students: Student[]) {
  return students.filter(student => student.vocab_current_target_day !== 0 && !student.is_exam_period && student.status === "active");
}


// export function calculateDaysToPrint(student: Student) {

//   console.log('calculateDaysToPrint', student.student_id);
//   if (!student.toprint_session_ranges) student.toprint_session_ranges = [0];
//   if (!student.printed_session_ranges) student.printed_session_ranges = [0];

//   const attendanceDays = student.attendance_schedule?.length || 0;
//   const daysToPrint = attendanceDays - (student.printed_session_ranges?.length || 0);

//   // 단어 오름차순일 경우
//   if (student.vocab_is_descending) {
//     for (let i = 0; i < daysToPrint; i++) {
//       const newTargetDate = student.vocab_current_target_day - student.vocab_days_per_session * (i);
//       student.toprint_session_ranges?.push(newTargetDate);
//     }
//   }
//   // 단어 내림차순일 경우
//   else {
//     for (let i = 0; i < daysToPrint; i++) {
//       const newTargetDate = student.vocab_current_target_day + student.vocab_days_per_session * (i);
//       student.toprint_session_ranges?.push(newTargetDate);
//     }
//   }

//   return student;
// }

export function calculateDaysToPrint(student: Student): Student {
  const currAttendanceDays = student.attendance_schedule?.length || 0;
  if (currAttendanceDays <= (student.printed_session_ranges?.length || 0) || 
      currAttendanceDays <= (student.toprint_session_ranges?.length || 0)) return student;

  const cloned: Student = {
    ...student,
    toprint_session_ranges: [...(student.toprint_session_ranges ?? [])],
    printed_session_ranges: [...(student.printed_session_ranges ?? [])]
  };

  const attendanceDays = cloned.attendance_schedule?.length || 0;
  const daysToPrint = attendanceDays - (cloned.printed_session_ranges?.length || 0);

  for (let i = 0; i < daysToPrint; i++) {
    const offset = cloned.vocab_days_per_session * (i);
    const newTargetDate = cloned.vocab_is_descending
      ? cloned.vocab_current_target_day - offset
      : cloned.vocab_current_target_day + offset;

    cloned.toprint_session_ranges?.push(newTargetDate);
  }

  return cloned;
}

// 서버 데이터 → 로컬 데이터 변환
export function convertToLocalData(students: Student[]): TrackingLocalCardsStateType[] {
  console.log('convertToLocalData', students.map(s => s.student_id));
  return students.map((student) => {
    const result: TrackingLocalCardsStateType = {
      student_id: student.student_id,
      vocab_current_target_day: student.vocab_current_target_day,
      cards_data: []
    };
    for (const sessionNum of student.toprint_session_ranges ?? []) {
      result.cards_data.push({ date: sessionNum, status: TrackingLocalCardsStatus.TO_PRINT });
    }

    for (const sessionNum of student.printed_session_ranges ?? []) {
      result.cards_data.push({ date: sessionNum, status: TrackingLocalCardsStatus.PRINTED });
    }

    return result;
  });
}

// 로컬 데이터 → 서버 데이터 변환
export function convertToServerData(
  localState: TrackingLocalCardsStateType
): Partial<Student> & { student_id: string } {
  console.log('convertToServerData', localState.student_id);
  const printed: number[] = [];
  const toprint: number[] = [];
  // TrackingLocalCardsStateType 를 Student 타입에서 printed_session_ranges, toprint_session_ranges 로 덮어 쓸 수 있게 변환
  for (const card of localState.cards_data) {
    if (card.status === TrackingLocalCardsStatus.PRINTED) printed.push(card.date);
    if (card.status === TrackingLocalCardsStatus.TO_PRINT) toprint.push(card.date);
  }

  return {
    student_id: localState.student_id,
    vocab_current_target_day: localState.vocab_current_target_day,
    printed_session_ranges: printed,
    toprint_session_ranges: toprint,
  };
}


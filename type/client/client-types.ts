// type/ui-types.ts (또는 기존 types.ts에 추가)

import { DayOfWeek, StudentStatus, VocabularyBookType, SchoolLevel, Student as DbStudent } from '@/type/server/db-types'; // DB 타입 import

// --- Enums (UI에서도 동일하게 사용 가능, db-types에서 import하여 재사용) ---
export { DayOfWeek, StudentStatus, VocabularyBookType, SchoolLevel };


// `lib/vocabularyUtils.ts`의 `getCurrentWeekDateRange` 반환 타입 (재정의 또는 import)
export type WeekDateInfo = { 
  dayEnum: DayOfWeek, 
  dateObj: Date, 
  dateStr: string 
};

export enum TrackingLocalCardsStatus {
  TO_PRINT = 'TO_PRINT',
  PRINTED = 'PRINTED',
  DONE = 'DONE',
}

// 에디터에서 사용할 로컬 데이터 컨버터 타입
export type TrackingLocalCardsStateType = {
  student_id: string;
  vocab_current_target_day: number;
  cards_data : {date: number, status: TrackingLocalCardsStatus}[]
}
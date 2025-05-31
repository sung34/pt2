// type/db-types.ts

// --- Enums (DB에서도 ENUM 타입으로 사용될 수 있음) ---
export enum StudentStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  INACTIVE = 'inactive',
}

export enum SchoolLevel {
  ELEMENTARY = 'elementary',
  MIDDLE = 'middle',
  HIGH = 'high',
}

export enum VocabularyBookType {
  IRREGULAR_VERB_TABLE = '불규칙 동사표',
  MIDDLE_BASIC_1200 = '중학기초1200',
  MIDDLE_INTERMEDIATE_1800 = '중학기본1800',
  HIGH_INTERMEDIATE_1800 = '수능기본1800',
  HIGH_MOCK_TEST = '모의고사',
  HIGH_VOCA = "VOCA",
  NONE = '없음',
}

export enum DayOfWeek { // DB에 요일 저장 시 사용 가능 (Student.attendance_schedule 내부)
  MONDAY = '월',
  TUESDAY = '화',
  WEDNESDAY = '수',
  THURSDAY = '목',
  FRIDAY = '금',
  SATURDAY = '토',
  SUNDAY = '일',
}

export enum AbsenceType {
  SINGLE_DAY = 'single_day',
  RANGE = 'range',
}

// --- Table Interfaces (DB 스키마와 유사) ---

export interface School {
  school_id: string; // UUID
  name: string;
  level: SchoolLevel;
}

export interface Textbook {
  textbook_id: string; // UUID
  title: string;
  publisher?: string;
  level_target: SchoolLevel;
  grade_target: number; // 예: 1, 2, 3
}

// 교과서와 학교 간의 다대다 관계를 위한 연결 테이블
export interface TextbookSchoolMap {
  textbook_school_map_id: string; // UUID
  textbook_id: string; // FK to Textbook
  school_id: string; // FK to School
  // specific_grade_year?: number; // 특정 학년에서만 이 교과서를 쓴다면
}

export interface SchoolExamSchedule {
  exam_schedule_id: string; // UUID
  school_id: string; // FK to School
  grade_year?: number; // 특정 학년 대상 (예: 1, 2, 3)
  exam_name: string; // 예: "1학기 중간고사"
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  exam_scope_memo?: string;
}

export interface VocabularyBook {
  book_id: string; // UUID
  name: VocabularyBookType;
  total_days_or_units: number; // 해당 단어장의 총 Day 또는 Unit 수
}

export interface AttendanceTimeSlot {
  day_of_week: DayOfWeek; // MONDAY, TUESDAY 등
  start_time: string; // HH:MM 형식
}

export interface StudentAbsence {
  absence_id: string; // UUID
  student_id: string; // FK to Student
  type: AbsenceType;
  date?: string; // YYYY-MM-DD (type 'single_day' 시)
  start_date?: string; // YYYY-MM-DD (type 'range' 시)
  end_date?: string; // YYYY-MM-DD (type 'range' 시)
  reason: string;
  created_at: string; // TIMESTAMPTZ (ISO 8601 형식 문자열)
}

export interface Student {
  student_id: string; // UUID
  name: string;
  grade_level_display: string; // 예: "초6", "중3" (화면 표시용)
  school_id?: string; // FK to School
  status: StudentStatus;
  memo?: string;
  is_exam_period: boolean;
  is_writing_english: boolean; // 영어 쓰기 여부

  current_vocab_book_id?: string; // FK to VocabularyBook
  vocab_current_target_day: number; // 다음에 시작/끝내야 할 Day
  vocab_is_descending: boolean; // true면 내림차순 학습
  vocab_days_per_session: number; // 한 번에 학습하는 Day의 "개수"
  
  // DB에 저장될 핵심 세션 정보 (단순 문자열 배열)
  printed_session_ranges: number[] | null; // 예: ["Day 20-21", "Day 22-23"]
  toprint_session_ranges: number[] | null;  // 예: ["Day 24-25"]
  
  // 출석 스케줄 (PostgreSQL의 JSONB 타입으로 저장될 수 있음)
  attendance_schedule?: AttendanceTimeSlot[]; 
}

export interface Holiday {
  holiday_id: string; // UUID
  date: string; // YYYY-MM-DD
  name: string;
  is_recurring: boolean; // 매년 반복 여부
}
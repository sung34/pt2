'use client'

import { ColumnDef } from '@tanstack/react-table'

import { ArrowUpDown, WifiOff, WifiPen } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {  School, Student, StudentStatus, VocabularyBook } from '@/type/server/db-types';
import { v4 as uuid } from 'uuid';

interface ColumnMeta {
    schools?: School[];
    vocabularies?: VocabularyBook[];
}
const DayOfWeekMap: Record<string, string> = {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일',
  };

// student_id: string; // UUID
//   name: string;
//   grade_level_display: string; // 예: "초6", "중3" (화면 표시용)
//   school_id?: string; // FK to School
//   status: StudentStatus;
//   memo?: string;
//   is_exam_period: boolean;
//   is_writing_english: boolean; // 영어 쓰기 여부

//   current_vocab_book_id?: string; // FK to VocabularyBook
//   vocab_current_target_day: number; // 다음에 시작/끝내야 할 Day
//   vocab_is_descending: boolean; // true면 내림차순 학습
//   vocab_days_per_session: number; // 한 번에 학습하는 Day의 "개수"

//   // DB에 저장될 핵심 세션 정보 (단순 문자열 배열)
//   printed_session_ranges: number[] | null; // 예: ["Day 20-21", "Day 22-23"]
//   toprint_session_ranges: number[] | null;  // 예: ["Day 24-25"]

//   // 출석 스케줄 (PostgreSQL의 JSONB 타입으로 저장될 수 있음)
//   attendance_schedule?: AttendanceTimeSlot[]; 
export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    학생 이름
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    상태
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className='flex items-center justify-center'>
                    {status === StudentStatus.ACTIVE ? <WifiPen className='w-4 h-4' /> : <WifiOff className='w-4 h-4' />}
                </div>
            )
        }
    },
    {
        accessorKey: 'school_id',
        header: '학교',
        cell: ({ row, table }) => {
            const student = row.original // 현재 행의 학생 데이터
            // table.options.meta에서 schools 배열을 가져옵니다.
            const meta = table.options.meta as ColumnMeta; // 타입 단언
            const schools = meta?.schools;

            if (!schools) {
                return "정보 없음"; // schools 데이터가 없을 경우
            }

            const school = schools.find(school => school.school_id === student.school_id) // school_id로 학교 찾기
            return school ? school.name : "미지정" // 학교 이름 또는 폴백 텍스트
        }
    },
    {
        accessorKey: 'grade_level_display',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    학년
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'current_vocab_book_id',
        header: '단어장',
        cell: ({ row, table }) => {
            const student = row.original; // 현재 행의 학생 데이터
            const meta = table.options.meta as ColumnMeta; // 타입 단언
            const vocabularies = meta?.vocabularies; // meta에서 단어장 목록 가져오기
      
            if (!vocabularies) {
              return "정보 없음"; // 단어장 목록 데이터가 없을 경우
            }
      
            // 학생 데이터(student)에 단어장 ID를 가리키는 필드가 있다고 가정합니다.
            // 예: student.vocabulary_id 또는 student.wordbook_id 등
            // 실제 학생 데이터의 필드명으로 변경해야 합니다.
            const vocabularyId = student.current_vocab_book_id; // <<-- 이 필드명을 실제 사용하는 것으로 변경!
      
            const vocabulary = vocabularies.find(v => v.book_id === vocabularyId);
            return vocabulary ? vocabulary.name : "미지정"; // 단어장 이름 또는 폴백 텍스트
        }
    },
    {
        accessorKey: 'attendance_schedule',
        header: '스케쥴',
        cell: ({ row }) => {
            const schedule = row.original.attendance_schedule;
            return schedule ? schedule?.map((day) => {
                const dayKey = day.day_of_week
                return (
                    <span className='mr-3' key={uuid()}>
                        {DayOfWeekMap[dayKey]}
                    </span>
                )
            }) : "정보 없음";
        }
    },

]
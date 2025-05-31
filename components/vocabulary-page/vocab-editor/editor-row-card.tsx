'use client'

import { Student } from "@/type/server/db-types";
import { useEffect, useState } from "react";
import { TableCell } from "../../ui/table";
import { Card, CardContent } from "../../ui/card";
import { useVocabContext } from "../context";
import { v4 as uuid } from 'uuid';
import { TrackingLocalCardsStateType, TrackingLocalCardsStatus } from "@/type/client/client-types";
import { toast } from "sonner";
import { clsx } from 'clsx';

type StudentDataForCardType = Pick<Student,
    'student_id'                 // 학생 아이디
    | 'vocab_is_descending'      // 단어장 내림차순 여부
    | 'is_writing_english'       // 영어 쓰기 여부
    | 'vocab_current_target_day' // 현재 학습 목표 Day
    | 'vocab_days_per_session'   // 한 번에 학습하는 Day의 "개수" 1개 당 1일, 2개면 31-32   
    | 'toprint_session_ranges'   // 인쇄 예정 세션 범위
    | 'printed_session_ranges'   // 인쇄 완료 세션 범위
    | 'attendance_schedule'      // 출석 스케줄
>;

interface VocabRowCardProps {
    studentDataForCard: StudentDataForCardType,
    isEditing: boolean,
}

export default function VocabRowCard({ studentDataForCard, isEditing }: VocabRowCardProps) {
    const [displayCardsData, setDisplayCardsData] = useState<TrackingLocalCardsStateType['cards_data']>([]);
    const mutableContextData = useVocabContext();



    // 렌더링 될 카드 데이터 생성
    useEffect(() => {
        if (!mutableContextData) return;
        const targetStudent = mutableContextData.find(student => student.student_id === studentDataForCard.student_id);
        if (!targetStudent) return;
        if (studentDataForCard.vocab_is_descending) {
            setDisplayCardsData(targetStudent.cards_data.sort((a, b) => b.date - a.date));
        } else {
            setDisplayCardsData(targetStudent.cards_data.sort((a, b) => a.date - b.date));
        }
    }, [studentDataForCard.student_id, mutableContextData, studentDataForCard.vocab_is_descending]);


    // 데이터 로드중 
    if (!mutableContextData) {
        return (
            <TableCell colSpan={3}>Loading context data...</TableCell>
        );
    }

    // 카드 클릭 핸들러
    const handleCardClick = (target_student_id: string, target_date: number, target_status: TrackingLocalCardsStatus) => {
        if (!mutableContextData || target_status === 'TO_PRINT' || !isEditing) return;

        const targetStudent = mutableContextData.find(student => student.student_id === target_student_id);
        if (!targetStudent) {
            toast.error('학생 데이터를 찾을 수 없습니다.');
            return;
        }

        targetStudent.vocab_current_target_day =
            studentDataForCard.vocab_is_descending ?
                targetStudent.vocab_current_target_day - studentDataForCard.vocab_days_per_session :
                targetStudent.vocab_current_target_day + studentDataForCard.vocab_days_per_session;

        targetStudent.cards_data = targetStudent.cards_data.map(card =>
            card.date === target_date ? { ...card, status: target_status } : card
        );

        setDisplayCardsData(targetStudent.cards_data.sort((a, b) =>
            studentDataForCard.vocab_is_descending ? b.date - a.date : a.date - b.date
        ));
    };

    return (
        <>
            {
                (studentDataForCard.toprint_session_ranges?.length ?? 0) +
                    (studentDataForCard.printed_session_ranges?.length ?? 0) > 0 ?
                    // 카드 데이터가 있으면 카드 데이터 표시
                    displayCardsData?.map(DPCData => (
                        <Card
                            onClick={() => handleCardClick(studentDataForCard.student_id, DPCData.date, DPCData.status)}
                            className={clsx(
                                "h-full w-fit  p-4",
                                !isEditing ? "cursor-pointer" : ""
                            )}
                            key={uuid()}>
                            <CardContent className="p-0">
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-sm">
                                        {`${DPCData?.date - 1} - ${DPCData?.date}`}
                                    </span>
                                    <span className="text-sm">
                                        {DPCData?.status === 'TO_PRINT' ? '인쇄 예정' :
                                            DPCData?.status === 'PRINTED' ? '인쇄 완료' :
                                             '학습 완료'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))

                    :
                    // 데이터 없음
                    <div className="w-full h-full flex items-center justify-center">No data</div>
            }
        </>
    )
}

'use client'
// React 라이브러리
import { useRef, useEffect, useState } from "react";
import { VocabContextProvider } from "../context";
import VocabRow from "./editor-row";

// 유틸 라이브러리 및 함수 
import { filterVocabStudents, calculateDaysToPrint, convertToLocalData, convertToServerData } from "@/lib/vocab-utils";
import cloneDeep from "lodash/cloneDeep";
import { v4 as uuid } from 'uuid';
import { toast } from "sonner";

// 서버 라이브러리 및 타입
import { Student } from "@/type/server/db-types";
import { TrackingLocalCardsStateType } from "@/type/client/client-types";
import { saveStudentVocabulary } from "@/app/actions/vocabulary/vocabulary-actions";

// UI 컴포넌트
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Pencil, Plus, Printer, Save, X } from "lucide-react";



export default function Vocab({ studentsData }: { studentsData: Student[] }) {
    // 변경 사항 시 리렌더링 할 학생 데이터
    const [students, setStudents] = useState<Student[]>([]);

    // 변경 사항 저장 -> 리렌더링 없음
    const trackingLocalCardStates = useRef<TrackingLocalCardsStateType[]>([]);

    // 취소 및 되돌리기 시 초기 사항 저장용
    const initialDataForCancel = useRef<Student[]>([]);
    const initialTrackingLocalCardStatesForCancel = useRef<TrackingLocalCardsStateType[]>([]);

    // 편집 모드 여부 : 편집 모드, 읽기 모드 전환
    // 저장 시 편집 모드 해제
    const [isEditing, setIsEditing] = useState(false);

    // 초기 데이터 설정 및 로컬 데이터 초기화
    useEffect(() => {
        // 단어장 없거나, 시험기간 학생 제외
        const vocabStudents = filterVocabStudents(studentsData);
        // 로컬 ref 데이터 초기화
        trackingLocalCardStates.current = convertToLocalData(vocabStudents);
        initialDataForCancel.current = vocabStudents;
        initialTrackingLocalCardStatesForCancel.current = trackingLocalCardStates.current;
        setStudents(vocabStudents);
    }, [studentsData]);

    /* === 클라이언트 액션 핸들러 === */
    // 일괄 카드 추가 핸들러
    const handleFillToPrintCards = () => {
        // 새로운 학생 데이터 객체
        const newStudents = students.map((student: Student) => {
            // 출석 일수 만큼 범위에 해당하는 단어날짜 추가 함수
            return calculateDaysToPrint(student);
        })
        // 학생 데이터로 리렌더링
        setStudents(newStudents);
        const filteredStudents = filterVocabStudents(newStudents);
        trackingLocalCardStates.current = convertToLocalData(filteredStudents);
        // initialDataForCancel.current = filteredStudents;
        // initialTrackingLocalCardStatesForCancel.current = trackingLocalCardStates.current;

    }

    // 취소 버튼 핸들러
    const handleCancel = () => {
        // 취소 시 리렌더링 할 학생 데이터
        const studentsToUpdate = cloneDeep(initialDataForCancel.current);
        const trackingToUpdate = cloneDeep(initialTrackingLocalCardStatesForCancel.current);
        
        // 편집 해제
        setIsEditing(false);

        // 초기 데이터 복구
        trackingLocalCardStates.current = trackingToUpdate;
        setStudents(studentsToUpdate);
    }


    /* === 서버 액션 핸들러 === */
    // 저장 버튼 핸들러
    const handleSave = async () => {
        // 로컬 상태 → 서버용 데이터로 변환
        const updatedStudentData = trackingLocalCardStates.current.map(convertToServerData);

        toast.loading("저장 중...");

        try {
            await Promise.all(
                updatedStudentData.map(student => saveStudentVocabulary(student))
            );

            // 낙관적 업데이트용 병합된 전체 students 배열 생성
            const mergedStudents = students.map(oldStudent => {
                const updated = updatedStudentData.find(u => u.student_id === oldStudent.student_id);
                return updated
                    ? { ...oldStudent, ...updated } // 기존 + 최신 세션 범위만 덮어쓰기
                    : oldStudent;
            });

            setStudents(mergedStudents);
            toast.success("저장 완료");
            setIsEditing(false);
        } catch (error: any) {
            toast.error("저장 실패", { description: `${error.message} 저장 실패`, duration: 1000, position: "top-center" });
        }
    };


    // TODO: 출력 버튼 핸들러
    const handlePrint = async () => {
        // 출력 시 보낼 데이터 
        const studentsToUpdate = cloneDeep(trackingLocalCardStates.current);

        // // 낙관적 업데이트
        // setStudents(studentsToUpdate);
        toast.info(studentsToUpdate.map(student => student.student_id).join(", "));
    }


    return (
        <>
            <VocabContextProvider value={trackingLocalCardStates.current}>
                <div className="flex items-center justify-between my-6">
                    {isEditing ? (
                        // 편집 모드
                        <>
                            <Button variant={"default"} onClick={handleSave}>
                                <Save className="size-3" /> 저장
                            </Button>
                            <div className="flex gap-3">
                                <Button variant={"default"} onClick={handleFillToPrintCards}>
                                    <Plus /> 새 단어 일괄 추가
                                </Button>
                                <Button variant={"destructive"} onClick={handleCancel}>
                                    <X /> 취소
                                </Button>
                            </div>
                        </>
                    ) : (
                        // 읽기 모드
                        <>
                            <Button variant={"default"} onClick={() => setIsEditing(true)}>
                                <Pencil className="size-3" /> 편집
                            </Button>
                            <Button variant={"outline"} onClick={handlePrint}>
                                <Printer /> 출력
                            </Button>
                        </>
                    )}
                </div>
                <div className="sticky">
                    <Table>
                        {/* 테이블 헤더 */}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-2/12 border-r border-foreground/20 text-center text-[16px] font-semibold">
                                    <span>학생</span>
                                </TableHead>
                                <TableHead className="w-1/12 border-r border-foreground/20 text-center text-[16px] font-semibold">
                                    <span>단어 날짜</span>
                                </TableHead>
                                <TableHead className="w-9/12 text-center text-[16px] font-semibold">
                                    <span>단어장</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
                <ScrollArea className="h-[calc(100vh-17rem)]">
                    <Table>
                        {/* 테이블 바디 */}
                        <TableBody>
                            {students.map((student) => (
                                <VocabRow key={uuid()} student={student} />
                            ))}
                        </TableBody>
                    </Table >
                </ScrollArea>
            </VocabContextProvider>
        </>
    )
}


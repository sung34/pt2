import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Student } from "@/type/server/db-types"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface StudentSheetProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export function StudentSheet({ student, open, onOpenChange }: StudentSheetProps) {
  const [studentInfo, setStudentInfo] = useState<Student | null>(student);
  const studentInfoTrackerRef = useRef<Student | null>(student);

  useEffect(() => {
    if (student) {
      setStudentInfo(student);
      studentInfoTrackerRef.current = student;
      
      toast.success(studentInfoTrackerRef.current?.name, {
        description: `학생 정보를 불러왔습니다.`,
        duration: 1000,
        position: "top-center",
      });
    }
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!studentInfoTrackerRef.current) return;

    const updated = { ...studentInfoTrackerRef.current, [name]: value };
    studentInfoTrackerRef.current = updated;
  };

  const handleSubmit = async () => {
    if (!studentInfo) return;
  
    try {
      const response = await fetch("/api/students", {
        next: { tags: ["student"] },
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentInfoTrackerRef.current),
      });
  
      if (!response.ok) throw new Error("업데이트 실패");
  
      const updated = await response.json();
      toast.success("저장 완료", { description: `${updated[0].name} 학생 정보가 저장되었습니다.` });
  
      onOpenChange(false); // 시트 닫기
    } catch (error: any) {
      toast.error("저장 실패", { description: `${error.message} 학생 정보 저장 실패`, duration: 1000, position: "top-center" });
    }
  };
  

  return (
    <Sheet open={open}>
      <SheetContent onInteractOutside={() => {
        onOpenChange(false); // 시트 닫기
      }}>

        <SheetHeader>
          <SheetTitle>학생 정보 편집</SheetTitle>
          <SheetDescription>
            학생 정보를 편집합니다. 수정 후 저장 버튼을 눌러 저장합니다.
          </SheetDescription>
        </SheetHeader>
        {/* 내용물 */}
        <div className="h-full overflow-y-auto">
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="flex items-center gap-2 justify-between">
              <div className="grid gap-3">
                <Label htmlFor="student-name">학생 이름</Label>
                <Input name="name" id="student-name" onChange={handleInputChange} defaultValue={studentInfo?.name} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="student-status">상태</Label>
                <Input name="status" id="student-status" onChange={handleInputChange} defaultValue={studentInfo?.status} />
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-grade-level-display">학년</Label>
              <Input name="grade_level_display" id="student-grade-level-display" onChange={handleInputChange} defaultValue={studentInfo?.grade_level_display} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-memo">메모</Label>
              <Input name="memo" id="student-memo" onChange={handleInputChange} defaultValue={studentInfo?.memo ?? ""} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-is-exam-period">시험 기간</Label>
              <Input name="is_exam_period" id="student-is-exam-period" onChange={handleInputChange} defaultValue={studentInfo?.is_exam_period ? "시험 기간" : "시험 기간 아님"} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-is-writing-english">영어 쓰기</Label>
              <Input name="is_writing_english" id="student-is-writing-english" onChange={handleInputChange} defaultValue={studentInfo?.is_writing_english ? "영어" : "한글"} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-vocab-current-target-day">현재 목표 Day</Label>
              <Input name="vocab_current_target_day" id="student-vocab-current-target-day" onChange={handleInputChange} defaultValue={studentInfo?.vocab_current_target_day} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-vocab-is-descending">내림차순</Label>
              <Input name="vocab_is_descending" id="student-vocab-is-descending" onChange={handleInputChange} defaultValue={studentInfo?.vocab_is_descending ? "내림" : "올림"} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-vocab-days-per-session">한 번에 학습하는 Day의 개수</Label>
              <Input name="vocab_days_per_session" id="student-vocab-days-per-session" onChange={handleInputChange} defaultValue={studentInfo?.vocab_days_per_session} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-printed-session-ranges">출력된 세션 범위</Label>
              <Input name="printed_session_ranges" id="student-printed-session-ranges" onChange={handleInputChange} defaultValue={studentInfo?.printed_session_ranges?.join(",")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-toprint-session-ranges">출력 예정 세션 범위</Label>
              <Input name="toprint_session_ranges" id="student-toprint-session-ranges" onChange={handleInputChange} defaultValue={studentInfo?.toprint_session_ranges?.join(",")} />
            </div>
            <div className="grid gap-3">
              {/* <Label htmlFor="student-attendance-schedule">출석 스케줄</Label>
              <Input name="attendance_schedule" id="student-attendance-schedule" onChange={handleInputChange} defaultValue={} /> */}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="student-current-vocab-book-id">현재 단어장</Label>
              <Input name="current_vocab_book_id" id="student-current-vocab-book-id" onChange={handleInputChange} defaultValue={studentInfo?.current_vocab_book_id} />
            </div>
          </div>
        </div>

        <SheetFooter className="z-10">
          <div className="flex flex-col gap-2">
            <Button variant="default" onClick={() => handleSubmit()}>저장</Button>
            <SheetClose asChild>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>닫기</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

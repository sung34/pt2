import { getVocabBookName } from "@/lib/vocab-utils";

import { TableCell, TableRow } from "../../ui/table";
import { Student } from "@/type/server/db-types";
import VocabRowCard from "./editor-row-card";
import NotificationBadge from "../../shadcn-studio/badge/badge-07";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Separator } from "../../ui/separator";

export default function VocabRow({ student }: { student: Student }) {


    return (
        <TableRow className="md:h-24 grid grid-cols-12 border-t border-b border-foreground/20 ">
            <TableCell className="col-span-2 border-r border-foreground/20 flex flex-col items-center justify-center gap-3">
                {/* 학생 이름 */}
                <div className="relative font-semibold w-full text-center">
                    {student.name}
                    {getToPrintCount(student) > 0 && (
                        <div className="absolute top-0 right-0">
                            <NotificationBadge value={getToPrintCount(student)} />
                        </div>
                    )}
                </div>
                <Separator orientation="horizontal" />
                {/* 단어장 이름 */}
                <span className="text-xs">
                    {getVocabBookName(student.current_vocab_book_id)}
                </span>
            </TableCell>
            <TableCell className="col-span-1 border-r border-foreground/20 flex items-center justify-center gap-2">
                {/* 단어 날짜 */}
                <span className="w-4 text-lg text-center">
                    {student.vocab_current_target_day}
                </span>
                
                {/* 단어 내림차순 여부 */}
                <span className="text-sm ">
                    {!student.vocab_is_descending ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </span>

                {/* 영어 쓰기 여부 */}
                <span className="text-sm ">
                    {student.is_writing_english ? <span className="text-md font-semibold">EN</span> : <span className="text-md font-semibold">KR</span>}
                </span>
            </TableCell>
            <TableCell className="col-span-9 flex items-center justify-start gap-2">
                <VocabRowCard
                    studentDataForCard={student}
                    isEditing={false}
                />
            </TableCell>
        </TableRow>
    )
}

function getToPrintCount(student: Student) {
    if (!student.toprint_session_ranges) return 0
    return student.toprint_session_ranges.length;
}

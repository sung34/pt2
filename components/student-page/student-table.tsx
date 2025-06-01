'use client'

import { useStudentStore } from "@/lib/zustand/store/students";
import { School, Student, VocabularyBook } from "@/type/server/db-types";
import { useEffect } from "react";
import DataTable from "./data-table";
import { columns } from "./columns";

interface props {
    studentData: Student[], schools: School[], vocabularies: VocabularyBook[]
}

export default function StudentTable({studentData, schools, vocabularies}: props) {
    const setStudents = useStudentStore(state => state.setStudents)
    const students = useStudentStore(state => state.students)

    useEffect(() => {
        setStudents(studentData)
    }, [studentData, setStudents])

    return (
        <>
            {students &&
                <DataTable columns={columns} data={students} meta={{ schools, vocabularies }} />
            }
        </>
    )
}
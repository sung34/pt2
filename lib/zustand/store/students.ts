// zustand/store/student.ts
import { create } from 'zustand';
import { Student } from '@/type/server/db-types'; // 너가 올린 인터페이스가 이 위치에 있다고 가정
interface StudentStore {
    students: Student[];
    setStudents: (list: Student[]) => void;
    updateStudent: (id: string, partial: Partial<Student>) => void;
    removeStudent: (id: string) => void;
  }
  
  export const useStudentStore = create<StudentStore>((set) => ({
    students: [],
  
    setStudents: (list) => set(() => ({ students: list })),
  
    updateStudent: (id, partial) =>
      set((state) => ({
        students: state.students.map((student) =>
          student.student_id === id ? { ...student, ...partial } : student
        ),
      })),
  
    removeStudent: (id) =>
      set((state) => ({
        students: state.students.filter((student) => student.student_id !== id),
      })),
  }));
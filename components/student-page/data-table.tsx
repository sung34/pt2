'use client'

import { useEffect, useState } from 'react'

import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  TableMeta,
  Row
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { ScrollBar } from '../ui/scroll-area'
import { School, Student, VocabularyBook } from '@/type/server/db-types'
import { StudentSheet } from './student-sheet'
import { useStudentStore } from '@/lib/zustand/store/students'

interface CustomTableMeta extends TableMeta<Student> {
  schools?: School[];
  vocabularies?: VocabularyBook[]; // vocabularies 필드 추가
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta: CustomTableMeta
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  meta
}: DataTableProps<TData, TValue>) {
  // 정렬 상태 관리
  const [sorting, setSorting] = useState<SortingState>([])
  // 필터 상태 관리
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // 컬럼 보여줄지 여부 상태 관리
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // 학생 시트 상태 관리
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const setStudents = useStudentStore(state => state.setStudents);
  const students = useStudentStore(state => state.students);

  // 테이블 생성
  const table = useReactTable({
    data,
    columns,
    meta,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleRowClick = (row: Row<TData>) => {
    setSelectedStudent(row.original as Student);
    setIsSheetOpen(true);
  };

  const onOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    setSelectedStudent(null);
  }



  return (
    <>
      <ScrollArea className="h-[calc(100vh-10rem)] max-w-[calc(100vw-30rem)]">
        {/* Filters */}

        <div className='flex items-center justify-between'>
          <div className='flex items-center py-4'>
            <Input
              placeholder='Search by name...'
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={event =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className='max-w-sm'
            />
          </div>

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className='rounded-md border'>
          <Table>
            {/* Header start */}
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {/* Table body */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  // 행 클릭 시 핸들러 호출
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => handleRowClick(row)} // 행 클릭 시 핸들러 호출
                    className="cursor-pointer hover:bg-muted/50" // 클릭 가능함을 시각적으로 표시
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell className='text-center' key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />

      </ScrollArea>
      <StudentSheet
        student={selectedStudent}
        open={isSheetOpen}
        onOpenChange={onOpenChange}
      />
    </>
  )
}
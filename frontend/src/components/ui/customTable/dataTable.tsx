import React from 'react'
import {TableHead} from '@mui/material'
import * as S from './dataTable.styles'

export type Column<T> = {
  id: keyof T | string
  header: React.ReactNode
  align?: 'left' | 'right' | 'center'
  width?: number | string
  render?: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowsPerPage?: number
  loading?: boolean
  error?: boolean
  emptyContent?: React.ReactNode
  errorContent?: React.ReactNode
  loadingContent?: React.ReactNode
  getRowId?: (row: T) => number
  minHeight?: string | number
}

function DataTableHead<T>({columns}: {columns: Column<T>[]}) {
  const autoWidth = `${100 / Math.max(1, columns.length)}%`
  return (
    <TableHead>
      <S.StyledTableRow>
        {columns.map((col, i) => (
          <S.StyledHeaderCell
            key={`${String(col.id)}-${i}`}
            align={col.align}
            sx={{width: col.width ?? autoWidth, textAlign: col.align ?? 'left'}}
          >
            {col.header}
          </S.StyledHeaderCell>
        ))}
      </S.StyledTableRow>
    </TableHead>
  )
}

function DataTableRow<T>({
  row,
  index,
  columns,
  getRowId,
}: {
  row: T
  index: number
  columns: Column<T>[]
  getRowId?: (row: T) => number
}) {
  const key = getRowId?.(row) ?? (row as any).id ?? String(index)

  return (
    <S.StyledTableRow key={key}>
      {columns.map((col, i) => (
        <S.StyledTableCell
          key={`${String(col.id)}-${index}-${i}`}
          align={col.align}
          sx={{textAlign: col.align ?? 'left'}}
        >
          {col.render ? col.render(row) : (row as any)[col.id]}
        </S.StyledTableCell>
      ))}
    </S.StyledTableRow>
  )
}

function SingleContentRow({
  content,
  colSpan,
}: {
  content: React.ReactNode
  colSpan: number
}) {
  return (
    <S.StyledTableRow>
      <S.StyledSingleContentCell colSpan={colSpan}>
        {content}
      </S.StyledSingleContentCell>
    </S.StyledTableRow>
  )
}

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  loading = false,
  error = false,
  emptyContent = null,
  errorContent = null,
  loadingContent = null,
  getRowId,
}: DataTableProps<T>) {
  const colSpan = columns.length
  const rowsToRender = rows ?? []

  const renderBody = () => {
    if (loading)
      return <SingleContentRow content={loadingContent} colSpan={colSpan} />
    if (error)
      return <SingleContentRow content={errorContent} colSpan={colSpan} />
    if (!rowsToRender.length)
      return <SingleContentRow content={emptyContent} colSpan={colSpan} />

    return (
      <>
        {rowsToRender.map((row, i) => (
          <DataTableRow
            key={getRowId?.(row) ?? (row as any).id ?? String(i)}
            row={row}
            index={i}
            columns={columns}
            getRowId={getRowId}
          />
        ))}
      </>
    )
  }

  const showHeader = !loading && !error && rowsToRender.length > 0
  const shouldHideOverflow = loading || error || !rowsToRender.length

  return (
    <S.StyledPaper>
      <S.StyledTableContainer shouldHideOverflow={shouldHideOverflow}>
        <S.StyledTable size="small">
          {showHeader && <DataTableHead columns={columns} />}
          <S.StyledTableBody>{renderBody()}</S.StyledTableBody>
        </S.StyledTable>
      </S.StyledTableContainer>
    </S.StyledPaper>
  )
}

import {
  TableCell,
  Table,
  Paper,
  TableContainer,
  TableBody,
  TableRow,
} from '@mui/material'
import {styled} from 'styled-components'

export const StyledTableCell = styled(TableCell)`
  height: 52px;
  padding: 16px;
  vertical-align: middle;
  color: var(--color-neutral-xdark);
  border: none;
  background-color: #ffffff;
  transition: background-color 0.2s ease;
  padding: 12px 16px;

  && {
    font-size: 13px;
    font-weight: 400;
  }
`

export const StyledHeaderCell = styled(TableCell)`
  color: #ffffff;
  background-color: var(--color-brand-primary-pure);
  border: none;
  font-weight: 700;

  && {
    font-size: 14px;
    font-weight: 700;
    height: 48px;
    vertical-align: center;
    padding: 12px 16px;
  }
`

export const StyledTable = styled(Table)`
  min-width: auto;
  table-layout: fixed;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out;
  border-collapse: collapse;
  background-color: #ffffff;

  && {
    border-collapse: collapse;
  }

  th,
  td,
  thead th {
    border-bottom: 1px solid #e0e0e0;
  }

  tbody tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #f5f5f5;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`

export const StyledPaper = styled(Paper)`
  padding: 24px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0;

  && {
    border: 1px solid #e0e0e0;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  }
`

export const StyledTableContainer = styled(TableContainer).withConfig({
  shouldForwardProp: prop => !['shouldHideOverflow'].includes(prop),
})<{
  shouldHideOverflow: boolean
}>`
  overflow: ${props => (props.shouldHideOverflow ? 'hidden' : 'auto')};
  transition: all 0.3s ease-in-out;
  border-radius: 8px;

  && {
    border: none;
    box-shadow: none;
  }
`

export const StyledTableBody = styled(TableBody)`
  transition: all 0.3s ease-in-out;
  background-color: #ffffff;

  && {
    border: none;
  }
`

export const StyledTableRow = styled(TableRow)`
  && {
    border: none;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f9f9f9;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`

export const StyledSingleContentCell = styled(StyledTableCell)`
  padding: 0;
  height: calc(100vh - 360px);
  min-height: calc(100vh - 360px);
  position: relative;
  overflow: hidden;

  && {
    border: none;
  }
`

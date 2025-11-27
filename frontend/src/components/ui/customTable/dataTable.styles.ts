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
  color: red;
  border: none;

  && {
    font-size: 12px;
    font-family: ;
    font-weight: 400;
  }
`

export const StyledHeaderCell = styled(TableCell)`
  color: red;
  border: none;

  && {
    font-size: 14px;
    font-family: ;
    font-weight: 600;
    height: 32px;
    vertical-align: top;
    padding: 0px 16px;
  }
`

export const StyledTable = styled(Table)`
  min-width: auto;
  table-layout: fixed;
  width: 100%;
  height: 100%;
  transition: all 3s ease-in-out;
  border: none;
  box-shadow: none;

  && {
    border: none;
    box-shadow: none;
  }

  th,
  td,
  thead th {
    border-bottom: 2px solid var(--color-background-opaque-01);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`

export const StyledPaper = styled(Paper)`
  padding: 0;
  overflow: hidden;
  box-shadow: none;

  && {
    border: none;
    box-shadow: none;
  }
`

export const StyledTableContainer = styled(TableContainer).withConfig({
  shouldForwardProp: prop => !['shouldHideOverflow'].includes(prop),
})<{
  shouldHideOverflow: boolean
}>`
  overflow: ${props => (props.shouldHideOverflow ? 'hidden' : 'auto')};
  transition: all 3s ease-in-out;

  && {
    border: none;
    box-shadow: none;
  }
`

export const StyledTableBody = styled(TableBody)`
  transition: all 3s ease-in-out;

  && {
    border: none;
  }
`

export const StyledTableRow = styled(TableRow)`
  && {
    border: none;
  }

  &:last-child td {
    border-bottom: none;
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

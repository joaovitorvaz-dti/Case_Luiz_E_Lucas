import styled from 'styled-components'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export const ContentStack = styled(Stack)`
  width: 100%;
  margin-top: var(--spacing-small);
`

export const LoadingWrapper = styled(Stack)`
  width: 100%;
  padding: var(--spacing-medium) 0;
  align-items: center;
  justify-content: center;
`

export const HelperBox = styled(Box)`
  margin-bottom: var(--spacing-small);
  width: 100%;
  padding: 0 var(--spacing-small);
`

export const DividerStyled = styled(Divider)`
  margin: var(--spacing-small) 0;
`

export const RowStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
  align-items: stretch;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    gap: calc(var(--spacing-medium));
  }
`

export const FlexItem = styled.div`
  flex: 1;
  min-width: 0; /* allow children to truncate correctly */
`

export const FlexItemInner = styled.div`
  width: 100%;

  .MuiFormControl-root {
    width: 100%;
    box-sizing: border-box;
    margin-top: var(--spacing-xxsmall);
  }

  /* Keep the InputLabel readable and prevent it from overlapping select text */
  .MuiInputLabel-root {
    background: transparent;
    padding: 0 6px;
    transform-origin: left top;
  }

  /* Ensure the select content truncates and doesn't overflow */
  .MuiSelect-select {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  /* Menu items should wrap text nicely */
  .MuiMenuItem-root {
    white-space: normal;
    word-break: break-word;
  }
`

import styled from 'styled-components'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'

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

export const FormFieldsStack = styled(Stack)`
  width: 100%;
  gap: var(--spacing-medium);
`

export const FormField = styled(Box)`
  width: 100%;

  .MuiTextField-root {
    width: 100%;
  }

  .MuiFormControl-root {
    width: 100%;
  }
`

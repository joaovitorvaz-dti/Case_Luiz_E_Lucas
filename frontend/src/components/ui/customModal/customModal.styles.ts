import styled from 'styled-components'
import {Dialog, DialogContent} from '@mui/material'

export const StyledDialog = styled(Dialog)`
  && .MuiPaper-root {
    width: 366px;
    border-radius: var(--border-radius-xxlarge);
    box-shadow: 0px 8px 24px 0px #20262429;
  }
  && .MuiDialogContent-root {
    padding: var(--spacing-medium);
    height: 100%;
  }
`

export const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-medium);
  gap: var(--spacing-small);
  position: relative;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export const ActionsWrapper = styled.div.withConfig({
  shouldForwardProp: prop => prop !== 'actionsAlign',
})<{
  actionsAlign: 'left' | 'center' | 'right'
}>`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: ${({actionsAlign}) =>
    ({
      left: 'start',
      center: 'center',
      right: 'end',
    })[actionsAlign]};
  flex-direction: row;
  margin-top: var(--spacing-xsmall);

  &:has(> :nth-child(2)) {
    gap: var(--spacing-medium);
  }

  &:has(> :nth-child(3)) {
    flex-direction: column;
  }
`

export const StyledTitle = styled.h2.withConfig({
  shouldForwardProp: prop => prop !== 'textAlign',
})<{textAlign: string}>`
  margin: 0;
  font-size: 18px;
  width: 100%;
  font-weight: 600;
  color: var(--color-neutral-xdark);
  text-align: ${({textAlign}) => textAlign};
`

export const StyledSubtitle = styled.p.withConfig({
  shouldForwardProp: prop => prop !== 'textAlign',
})<{textAlign: string}>`
  margin: 0;
  font-size: 12px;
  color: var(--color-neutral-xdark);
  text-align: ${({textAlign}) => textAlign};
`

export const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-small);
  right: var(--spacing-small);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xsmall);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:focus {
    outline: 2px solid var(--color-brand-primary-pure);
    outline-offset: 2px;
  }
`

export const CloseIcon = styled.span`
  width: 20px;
  height: 20px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 2px;
    background-color: var(--color-neutral-xdark);
    border-radius: 1px;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`

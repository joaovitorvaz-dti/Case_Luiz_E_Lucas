import React from 'react'
import * as S from './customModal.styles'

export type TextAlignment = 'left' | 'center' | 'right'

export interface CustomModalProps {
  open: boolean
  onClose: () => void
  showCloseIcon?: boolean
  showCloseButton?: boolean
  icon?: React.ReactNode
  title?: string | React.ReactNode
  subtitle?: string | React.ReactNode
  actions?:
    | React.ReactElement<HTMLButtonElement>
    | React.ReactElement<HTMLButtonElement>[]
  children?: React.ReactNode
  textTitleAlign?: TextAlignment
  textSubtitleAlign?: TextAlignment
  actionsAlign?: TextAlignment
  isLoading?: boolean
}

function renderTextWithAlignment(
  content: string | React.ReactNode | undefined,
  alignment: TextAlignment,
  Component: React.ComponentType<{
    textAlign: string
    children: React.ReactNode
  }>,
) {
  if (!content) return null
  return typeof content === 'string' ? (
    <Component textAlign={alignment}>{content}</Component>
  ) : (
    content
  )
}
export function CustomModal({
  open,
  onClose,
  icon,
  title,
  subtitle,
  actions,
  showCloseButton = false,
  children,
  textTitleAlign = 'center',
  textSubtitleAlign = 'center',
  actionsAlign = 'center',
  ...props
}: CustomModalProps & Record<string, any>) {
  const normalizedActions = actions
    ? Array.isArray(actions)
      ? actions
      : [actions]
    : []

  return (
    <S.StyledDialog open={open} onClose={onClose} {...props}>
      <S.StyledDialogContent>
        {showCloseButton && (
          <S.CloseButton onClick={onClose} aria-label="Fechar modal">
            <S.CloseIcon />
          </S.CloseButton>
        )}

        {icon && <S.IconWrapper>{icon}</S.IconWrapper>}

        {renderTextWithAlignment(title, textTitleAlign, S.StyledTitle)}

        {renderTextWithAlignment(subtitle, textSubtitleAlign, S.StyledSubtitle)}

        {normalizedActions.length && (
          <S.ActionsWrapper actionsAlign={actionsAlign}>
            {normalizedActions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
          </S.ActionsWrapper>
        )}
        {children}
      </S.StyledDialogContent>
    </S.StyledDialog>
  )
}

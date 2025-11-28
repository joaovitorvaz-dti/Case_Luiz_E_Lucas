import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import {CustomModal, CustomModalProps} from './customModal'

describe('CustomModal', () => {
  const defaultProps: CustomModalProps = {
    open: true,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Renderização', () => {
    it('DEVE renderizar o modal quando open=true', () => {
      render(<CustomModal {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('NÃO DEVE renderizar o modal quando open=false', () => {
      render(<CustomModal {...defaultProps} open={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('DEVE renderizar título, subtítulo e ícone quando fornecidos', () => {
      render(
        <CustomModal
          {...defaultProps}
          title="Título"
          subtitle="Subtítulo"
          icon={<span>Ícone</span>}
        />,
      )
      expect(screen.getByText('Título')).toBeInTheDocument()
      expect(screen.getByText('Subtítulo')).toBeInTheDocument()
      expect(screen.getByText('Ícone')).toBeInTheDocument()
    })

    it('DEVE renderizar children quando fornecidos', () => {
      render(
        <CustomModal {...defaultProps}>
          <p>Conteúdo interno</p>
        </CustomModal>,
      )
      expect(screen.getByText('Conteúdo interno')).toBeInTheDocument()
    })
  })

  describe('Interações', () => {
    it('DEVE chamar onClose ao clicar no botão de fechar', () => {
      const onClose = jest.fn()
      render(
        <CustomModal {...defaultProps} onClose={onClose} showCloseButton />,
      )
      fireEvent.click(screen.getByRole('button', {name: /fechar modal/i}))
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Props condicionais', () => {
    it('DEVE renderizar múltiplas ações', () => {
      const actions = [
        <button key="1">Ação 1</button>,
        <button key="2">Ação 2</button>,
      ]
      render(<CustomModal {...defaultProps} actions={actions} />)
      expect(screen.getByText('Ação 1')).toBeInTheDocument()
      expect(screen.getByText('Ação 2')).toBeInTheDocument()
    })

    it('DEVE aceitar título e subtítulo como ReactNode', () => {
      render(
        <CustomModal
          {...defaultProps}
          title={<span>TítuloNode</span>}
          subtitle={<span>SubNode</span>}
        />,
      )
      expect(screen.getByText('TítuloNode')).toBeInTheDocument()
      expect(screen.getByText('SubNode')).toBeInTheDocument()
    })

    it('NÃO DEVE renderizar título/subtítulo/linkContent quando undefined', () => {
      render(<CustomModal {...defaultProps} />)
      expect(screen.queryByText('Título')).not.toBeInTheDocument()
      expect(screen.queryByText('Subtítulo')).not.toBeInTheDocument()
      expect(screen.queryByText('Link aqui')).not.toBeInTheDocument()
    })
  })

  describe('Cenários de erro', () => {
    it('NÃO DEVE quebrar quando onClose for undefined', () => {
      expect(() =>
        render(<CustomModal open={true} onClose={undefined as any} />),
      ).not.toThrow()
    })

    it('NÃO DEVE quebrar quando actions for undefined', () => {
      expect(() =>
        render(<CustomModal {...defaultProps} actions={undefined} />),
      ).not.toThrow()
    })
  })
})

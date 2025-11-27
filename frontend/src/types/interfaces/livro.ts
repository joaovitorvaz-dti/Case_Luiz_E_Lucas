export type StatusLivroApi = 0 | 1 | 2

export type StatusLivro = 'Disponível' | 'Emprestado' | 'Reservado'

export interface LivroApi {
  id: number
  isbn: string
  titulo: string
  autor: string
  ano: number
  status: StatusLivroApi
}

export interface Livro {
  id: number
  isbn: string
  titulo: string
  autor: string
  ano: number
  status: StatusLivro
}

export const statusLivroPorCodigo: Record<StatusLivroApi, StatusLivro> = {
  0: 'Disponível',
  1: 'Emprestado',
  2: 'Reservado',
}
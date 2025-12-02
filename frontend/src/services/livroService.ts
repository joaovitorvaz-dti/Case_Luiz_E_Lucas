import { api } from './api';
import {
  statusLivroPorCodigo,
  type Livro,
  type LivroApi,
  type StatusLivroApi,
} from '../types/interfaces/livro';
import type { AxiosError } from 'axios';

// Type guard para verificar se é um erro do Axios
function isAxiosError(error: unknown): error is AxiosError<unknown> {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'response' in error && 'config' in error && 'isAxiosError' in error;
}

// Mapear dados da API para o modelo de domínio
export const mapLivroFromApi = (livroApi: LivroApi): Livro => ({
  ...livroApi,
  status: statusLivroPorCodigo[livroApi.status],
});

// Buscar todos os livros
export const getLivros = async (): Promise<Livro[]> => {
  const response = await api.get<LivroApi[]>('/livros');
  return response.data.map(mapLivroFromApi);
};

// Buscar livro por ID
export const getLivroById = async (id: number): Promise<LivroApi> => {
  const response = await api.get<LivroApi>(`/livros/${id}`);
  return response.data;
};

// Criar novo livro
export const createLivro = async (data: Omit<LivroApi, 'id'>): Promise<LivroApi> => {
  const response = await api.post<LivroApi>('/livros', data);
  return response.data;
};

// Atualizar livro existente
export const updateLivro = async (
  id: number,
  data: Omit<LivroApi, 'id'>
): Promise<LivroApi> => {
  const payload = {
    id: Number(id),
    isbn: String(data.isbn).trim(),
    titulo: String(data.titulo).trim(),
    autor: String(data.autor).trim(),
    ano: Number(data.ano),
    status: Number(data.status) as StatusLivroApi,
  };

  console.log('Payload do PUT (com ID):', payload);
  console.log('URL:', `/livros/${id}`);

  try {
    const response = await api.put<LivroApi>(`/livros/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    // Se der erro 400, tenta sem o ID no body
    if (isAxiosError(error) && error.response?.status === 400) {
      console.log('Tentando PUT sem ID no body porque deu 400 Bad Request');
      const payloadSemId = {
        isbn: String(data.isbn).trim(),
        titulo: String(data.titulo).trim(),
        autor: String(data.autor).trim(),
        ano: Number(data.ano),
        status: Number(data.status) as StatusLivroApi,
      };
      console.log('Payload do PUT:', payloadSemId);
      const response = await api.put<LivroApi>(`/livros/${id}`, payloadSemId);
      return response.data;
    }
    throw error;
  }
};

// Deletar livro
export const deleteLivro = async (id: number): Promise<number> => {
  const response = await api.delete(`/livros/${id}`);
  return response.status;
};

// Validar dados do livro
export interface ValidacaoLivro {
  valido: boolean;
  erros: string[];
}

export const validarDadosLivro = (
  isbn: string,
  titulo: string,
  autor: string,
  ano: number,
  status: StatusLivroApi
): ValidacaoLivro => {
  const erros: string[] = [];

  if (!isbn.trim()) {
    erros.push('ISBN é obrigatório.');
  }
  if (!titulo.trim()) {
    erros.push('Título é obrigatório.');
  }
  if (!autor.trim()) {
    erros.push('Autor é obrigatório.');
  }
  if (isNaN(ano) || ano < 1000 || ano > new Date().getFullYear()) {
    erros.push('Por favor, insira um ano válido.');
  }
  if (typeof status !== 'number' || ![0, 1, 2].includes(status)) {
    erros.push('Status inválido. Por favor, selecione um status válido.');
  }

  return {
    valido: erros.length === 0,
    erros,
  };
};

// Tratamento de erro estruturado
export const extrairMensagemErro = (error: unknown): string => {
  let errorMessage = 'Erro na operação.';

  if (isAxiosError(error)) {
    const responseData = error.response?.data;
    if (responseData) {
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (typeof responseData === 'object' && responseData !== null) {
        const backendError = responseData as { message?: string; error?: string };
        if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.error) {
          errorMessage = backendError.error;
        }
      }
    }

    console.error('Detalhes do erro:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};
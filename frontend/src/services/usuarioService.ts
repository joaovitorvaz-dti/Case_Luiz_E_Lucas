import { api } from './api';
import type { AxiosError } from 'axios';

export interface UsuarioApi {
  id: number;
  name: string;
  email: string;
  perfil: number;
}

export interface CreateUsuarioRequest {
  name: string;
  email: string;
  perfil: number;
  password: string;
}

export const getUsuarios = async (): Promise<UsuarioApi[]> => {
  const res = await api.get<UsuarioApi[]>('/usuarios');
  return res.data;
};

export const getUsuarioById = async (id: number): Promise<UsuarioApi> => {
  const res = await api.get<UsuarioApi>(`/usuarios/${id}`);
  return res.data;
};

export const createUsuario = async (data: CreateUsuarioRequest): Promise<UsuarioApi> => {
  // Backend expects payload properties: Name, Email, Senha, Perfil
  const payload = {
    Name: data.name,
    Email: data.email,
    Senha: data.password,
    Perfil: data.perfil,
  };

  const res = await api.post<UsuarioApi>('/usuarios', payload);
  return res.data;
};

export const updateUsuario = async (id: number, data: Omit<UsuarioApi, 'id'>): Promise<UsuarioApi> => {
  const res = await api.put<UsuarioApi>(`/usuarios/${id}`, data);
  return res.data;
};

export const deleteUsuario = async (id: number): Promise<number> => {
  const res = await api.delete(`/usuarios/${id}`);
  return res.status;
};

// Type guard para verificar se é um erro do Axios
function isAxiosError(error: unknown): error is AxiosError<unknown> {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'response' in error && 'config' in error && 'isAxiosError' in error;
}

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

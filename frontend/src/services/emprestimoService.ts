import { api } from './api';

export interface EmprestimoApi {
  id: number;
  livroId: number;
  usuarioId: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string | null;
  status: number;
}

export const getEmprestimos = async (params?: { usuarioId?: number; livroId?: number; status?: number; }) => {
  const res = await api.get<EmprestimoApi[]>('/emprestimos', { params });
  return res.data;
};

export const createEmprestimo = async (livroId: number, usuarioId: number) => {
  const res = await api.post<EmprestimoApi>('/emprestimos', { LivroId: livroId, UsuarioId: usuarioId });
  return res.data;
};

export const registrarDevolucao = async (id: number) => {
  const res = await api.post<EmprestimoApi>(`/emprestimos/${id}/devolucao`);
  return res.data;
};
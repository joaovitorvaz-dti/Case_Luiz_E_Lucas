import { useMemo, useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getUsuarios,
  deleteUsuario,
  extrairMensagemErro,
  type UsuarioApi,
} from '../services/usuarioService';

import {
  DataTable,
  type Column,
} from '../components/ui/customTable';
import UsuarioModal from '../components/usuario/UsuarioModal';

const PERFIS: Record<number, string> = {
  1: 'Administrador',
  2: 'Bibliotecário',
  3: 'Usuário',
};

export function UsuariosPage() {
  const queryClient = useQueryClient();

  const {
    data: usuarios,
    isLoading,
    isError,
  } = useQuery<UsuarioApi[]>({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });

  // Mutation para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error: unknown) => {
      const errorMessage = extrairMensagemErro(error);
      alert(`Erro ao deletar usuário: ${errorMessage}`);
    },
  });

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const [isUsuarioOpen, setIsUsuarioOpen] = useState(false);

  const ActionsCell = useCallback((row: UsuarioApi) => (
    <Stack direction="row" spacing={1} justifyContent="center">
      <IconButton
        size="small"
        color="error"
        aria-label="Excluir usuário"
        onClick={() => handleDelete(row.id)}
        disabled={deleteMutation.isPending}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  ), [handleDelete, deleteMutation.isPending]);

  const columns = useMemo<Column<UsuarioApi>[]>(() => [
    { id: 'name', header: 'Nome' },
    { id: 'email', header: 'Email' },
    {
      id: 'perfil',
      header: 'Perfil',
      render: (row) => PERFIS[row.perfil] || 'Desconhecido',
    },
    {
      id: 'acoes',
      header: 'Ações',
      align: 'center',
      render: (row) => ActionsCell(row),
    },
  ], [ActionsCell]);

  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Typography variant="h4" component="h1">
        Gerenciamento de Usuários
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setIsUsuarioOpen(true)}
        >
          Novo Usuário
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={usuarios ?? []}
        loading={isLoading}
        error={isError}
        loadingContent="Carregando usuários..."
        errorContent="Ocorreu um erro ao buscar os usuários."
        emptyContent="Nenhum usuário encontrado."
      />
      <UsuarioModal
        open={isUsuarioOpen}
        onClose={() => {
          setIsUsuarioOpen(false);
        }}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['usuarios'] })}
      />
    </Stack>
  );
}

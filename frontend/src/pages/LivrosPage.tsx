import { useMemo, useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getLivros,
  deleteLivro,
  extrairMensagemErro,
} from '../services/livroService';
import type { Livro } from '../types/interfaces/livro';
import {
  DataTable,
  type Column,
} from '../components/ui/customTable';
import EmprestimoModal from '../components/emprestimo/EmprestimoModal';

export function LivrosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: livros,
    isLoading,
    isError,
  } = useQuery<Livro[]>({
    queryKey: ['livros'],
    queryFn: getLivros,
  });

  // Mutation para deletar livro
  const deleteMutation = useMutation({
    mutationFn: deleteLivro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
    },
    onError: (error: unknown) => {
      const errorMessage = extrairMensagemErro(error);
      alert(`Erro ao deletar livro: ${errorMessage}`);
    },
  });

  const handleEdit = useCallback((livro: Livro) => {
    navigate(`/form/${livro.id}`);
  }, [navigate]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este livro?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const [isEmprestimoOpen, setIsEmprestimoOpen] = useState(false);
  const [selectedLivroId, setSelectedLivroId] = useState<number | null>(null);

  const ActionsCell = useCallback((row: Livro) => (
    <Stack direction="row" spacing={1} justifyContent="center">
      <IconButton
        size="small"
        aria-label="Editar livro"
        onClick={() => handleEdit(row)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        aria-label="Excluir livro"
        onClick={() => handleDelete(row.id)}
        disabled={deleteMutation.isPending}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  ), [handleEdit, handleDelete, deleteMutation.isPending]);

  const columns = useMemo<Column<Livro>[]>(() => [
    { id: 'titulo', header: 'Título' },
    { id: 'autor', header: 'Autor' },
    { id: 'ano', header: 'Ano', align: 'center' },
    { id: 'isbn', header: 'ISBN' },
    {
      id: 'status',
      header: 'Status',
      render: (row) => row.status,
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
        Biblioteca da dti
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => navigate('/form')}
        >
          Postar
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => setIsEmprestimoOpen(true)}
        >
          Novo Empréstimo
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={livros ?? []}
        loading={isLoading}
        error={isError}
        loadingContent="Carregando livros..."
        errorContent="Ocorreu um erro ao buscar os livros."
        emptyContent="Nenhum livro encontrado."
      />
      <EmprestimoModal
        open={isEmprestimoOpen}
        onClose={() => {
          setIsEmprestimoOpen(false);
          setSelectedLivroId(null);
        }}
        initialLivroId={selectedLivroId}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['livros'] })}
      />
    </Stack>
  );
}
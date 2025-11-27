import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/api';
import {
  statusLivroPorCodigo,
  type Livro,
  type LivroApi,
} from '../types/interfaces/livro';
import {
  DataTable,
  type Column,
} from '../components/ui/customTable';

const getLivros = async () => {
  const response = await api.get<LivroApi[]>('/livros');
  return response.data.map<Livro>((livroApi) => ({
    ...livroApi,
    status: statusLivroPorCodigo[livroApi.status],
  }));
};

const deleteLivro = async (id: number) => {
  const response = await api.delete(`/livros/${id}`);
  return response.status;
};

const handleEdit = (livro: Livro, navigate: ReturnType<typeof useNavigate>) => {
  navigate(`/form/${livro.id}`);
};

const handleDelete = async (id: number) => {
  await deleteLivro(id);
};

const ActionsCell = (row: Livro, navigate: ReturnType<typeof useNavigate>) => (
  <Stack direction="row" spacing={1} justifyContent="center">
    <IconButton
      size="small"
      aria-label="Editar livro"
      onClick={() => handleEdit(row, navigate)}
    >
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      color="error"
      aria-label="Excluir livro"
      onClick={() => handleDelete(row.id)}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Stack>
);

export function LivrosPage() {
  const navigate = useNavigate();
  const {
    data: livros,
    isLoading,
    isError,
  } = useQuery<Livro[]>({
    queryKey: ['livros'],
    queryFn: getLivros,
  });


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
      render: (row) => ActionsCell(row, navigate),
    },
  ], [navigate]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Catálogo de Livros
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/form')}
        sx={{alignSelf: 'flex-start'}}
      >
        Postar
      </Button>

      <DataTable
        columns={columns}
        rows={livros ?? []}
        loading={isLoading}
        error={isError}
        loadingContent="Carregando livros..."
        errorContent="Ocorreu um erro ao buscar os livros."
        emptyContent="Nenhum livro encontrado."
      />
    </Stack>
  );
}
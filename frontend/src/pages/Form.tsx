import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  getLivroById,
  createLivro,
  updateLivro,
  validarDadosLivro,
  extrairMensagemErro,
} from '../services/livroService';
import type { StatusLivroApi } from '../types/interfaces/livro';

interface LivroFormData {
  isbn: string;
  titulo: string;
  autor: string;
  ano: number;
  status: StatusLivroApi;
}

const Form: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const livroId = id ? Number(id) : undefined;

  const [formData, setFormData] = useState<LivroFormData>({
    isbn: '',
    titulo: '',
    autor: '',
    ano: new Date().getFullYear(),
    status: 0,
  });

  // Carregar dados do livro que esta editando
  const { data: livroData, isLoading: isLoadingLivro } = useQuery({
    queryKey: ['livro', livroId],
    queryFn: () => getLivroById(livroId!),
    enabled: isEditMode && Boolean(livroId),
  });

  // Preencher formulário quando os dados do livro forem carregados
  useEffect(() => {
    if (livroData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        isbn: livroData.isbn,
        titulo: livroData.titulo,
        autor: livroData.autor,
        ano: livroData.ano,
        status: livroData.status,
      });
    }
  }, [livroData]);

  const mutation = useMutation({
    mutationFn: (data: LivroFormData) => 
      isEditMode && livroId 
        ? updateLivro(livroId, data)
        : createLivro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livros'] });
      navigate('/');
    },
    onError: (error: unknown) => {
      const errorMessage = extrairMensagemErro(error);
      alert(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} livro: ${errorMessage}`);
    },
  });

  const handleChange = useCallback(
    (field: keyof LivroFormData) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData((prev) => ({
          ...prev,
          [field]: field === 'ano' ? Number(value) : value,
        }));
      },
    []
  );

  const handleSelectChange = useCallback((event: { target: { value: unknown } }) => {
    const value = Number(event.target.value) as StatusLivroApi;
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      // Validar dados usando o serviço
      const validacao = validarDadosLivro(
        formData.isbn,
        formData.titulo,
        formData.autor,
        formData.ano,
        formData.status
      );

      if (!validacao.valido) {
        alert(validacao.erros.join('\n'));
        return;
      }

      // Garantir que todos os valores são do tipo correto
      const validatedData: LivroFormData = {
        isbn: String(formData.isbn).trim(),
        titulo: String(formData.titulo).trim(),
        autor: String(formData.autor).trim(),
        ano: Number(formData.ano),
        status: Number(formData.status) as StatusLivroApi,
      };

      console.log('Enviando dados validados:', {
        isEditMode,
        livroId,
        validatedData,
      });

      mutation.mutate(validatedData);
    },
    [formData, isEditMode, livroId, mutation]
  );

  if (isEditMode && isLoadingLivro) {
    return (
      <Stack spacing={3} sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
        <Typography variant="h4" component="h1">
          Carregando...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" component="h1">
        {isEditMode ? 'Editar Livro' : 'Cadastrar Novo Livro'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="ISBN"
            value={formData.isbn}
            onChange={handleChange('isbn')}
            required
            fullWidth
          />

          <TextField
            label="Título"
            value={formData.titulo}
            onChange={handleChange('titulo')}
            required
            fullWidth
          />

          <TextField
            label="Autor"
            value={formData.autor}
            onChange={handleChange('autor')}
            required
            fullWidth
          />

          <TextField
            label="Ano"
            type="number"
            value={formData.ano}
            onChange={handleChange('ano')}
            required
            fullWidth
            inputProps={{ min: 1000, max: new Date().getFullYear() }}
          />

          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleSelectChange}
              label="Status"
            >
              <MenuItem value={0}>Disponível</MenuItem>
              <MenuItem value={1}>Emprestado</MenuItem>
              <MenuItem value={2}>Reservado</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/')}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              fullWidth
            >
              {mutation.isPending ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Salvar'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default Form;

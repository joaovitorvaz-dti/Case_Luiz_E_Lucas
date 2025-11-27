import { useState, useEffect } from 'react';
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
import { api } from '../services/api';
import type { LivroApi, StatusLivroApi } from '../types/interfaces/livro';
import type { AxiosError } from 'axios';

interface LivroFormData {
  isbn: string;
  titulo: string;
  autor: string;
  ano: number;
  status: StatusLivroApi;
}

// Type guard para verificar se é um erro do Axios
function isAxiosError(error: unknown): error is AxiosError<unknown> {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return 'response' in error && 'config' in error && 'isAxiosError' in error;
}

const createLivro = async (data: LivroFormData): Promise<LivroApi> => {
  const response = await api.post<LivroApi>('/livros', data);
  return response.data;
};

const updateLivro = async (id: number, data: LivroFormData): Promise<LivroApi> => {
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

const getLivroById = async (id: number): Promise<LivroApi> => {
  const response = await api.get<LivroApi>(`/livros/${id}`);
  return response.data;
};

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
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} livro:`, error);
      
      // Mostrar mensagem de erro mais detalhada
      let errorMessage = `Erro ao ${isEditMode ? 'atualizar' : 'criar'} livro.`;
      
      if (isAxiosError(error)) {
        // Se o backend retornou uma mensagem de erro
        const responseData = error.response?.data;
        if (responseData) {
          if (typeof responseData === 'string') {
            errorMessage += `\n${responseData}`;
          } else if (typeof responseData === 'object' && responseData !== null) {
            const backendError = responseData as { message?: string; error?: string };
            if (backendError.message) {
              errorMessage += `\n${backendError.message}`;
            } else if (backendError.error) {
              errorMessage += `\n${backendError.error}`;
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
        errorMessage += `\n${error.message}`;
      }
      
      alert(errorMessage);
    },
  });

  const handleChange = (field: keyof LivroFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'ano' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (event: { target: { value: unknown } }) => {
    // Garantir que o valor é um número
    const value = Number(event.target.value) as StatusLivroApi;
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validação básica
    if (!formData.isbn.trim() || !formData.titulo.trim() || !formData.autor.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Garantir que o ano é um número válido
    if (isNaN(formData.ano) || formData.ano < 1000 || formData.ano > new Date().getFullYear()) {
      alert('Por favor, insira um ano válido.');
      return;
    }
    
    // Garantir que o status é um número válido (0, 1 ou 2)
    if (typeof formData.status !== 'number' || ![0, 1, 2].includes(formData.status)) {
      alert('Status inválido. Por favor, selecione um status válido.');
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
      formDataOriginal: formData,
    });
    
    mutation.mutate(validatedData);
  };

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

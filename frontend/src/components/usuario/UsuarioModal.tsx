import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import * as S from './UsuarioModal.styles';
import { CustomModal } from '../ui/customModal/customModal';
import { createUsuario, extrairMensagemErro, type CreateUsuarioRequest } from '../../services/usuarioService';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const PERFIS = [
  { value: 1, label: 'Administrador' },
  { value: 2, label: 'Bibliotecário' },
  { value: 3, label: 'Usuário' },
];

export default function UsuarioModal({ open, onClose, onCreated }: Props) {
  const [formData, setFormData] = useState<CreateUsuarioRequest>({
    name: '',
    email: '',
    perfil: 3,
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleChange = (field: keyof CreateUsuarioRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      // Ensure correct types at runtime: perfil -> number, others -> string
      [field]: field === 'perfil' ? Number(value) : String(value),
    } as CreateUsuarioRequest));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Nome é obrigatório.', severity: 'error' });
      return;
    }
    if (!formData.email.trim()) {
      setSnackbar({ open: true, message: 'Email é obrigatório.', severity: 'error' });
      return;
    }
    if (!formData.email.includes('@')) {
      setSnackbar({ open: true, message: 'Email inválido.', severity: 'error' });
      return;
    }

    const senha = String(formData.password ?? '').trim();
    if (!senha || senha.length < 6) {
      setSnackbar({ open: true, message: 'Senha é obrigatória (mínimo 6 caracteres).', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createUsuario(formData);
      setIsSubmitting(false);
      setSnackbar({ open: true, message: 'Usuário criado com sucesso.', severity: 'success' });

      setTimeout(() => {
        if (onCreated) onCreated();
        handleClose();
      }, 600);
    } catch (err) {
      setIsSubmitting(false);
      console.error('Erro ao criar usuário', err);
      setSnackbar({ open: true, message: extrairMensagemErro(err), severity: 'error' });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      perfil: 3,
      password: '',
    });
    setIsSubmitting(false);
    setSnackbar({ open: false, message: '', severity: 'success' });
    onClose();
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Novo Usuário"
        showCloseButton
        actions={[
          <Button key="cancel" variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button
            key="save"
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>,
        ]}
      >
        <S.ContentStack spacing={2}>
          <S.FormFieldsStack spacing={2}>
            <S.FormField>
              <TextField
                label="Nome"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: João Silva"
              />
            </S.FormField>

            <S.FormField>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Ex: joao@example.com"
              />
            </S.FormField>

            <S.FormField>
              <TextField
                label="Senha"
                fullWidth
                variant="outlined"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </S.FormField>

            <S.FormField>
              <FormControl fullWidth>
                <InputLabel id="perfil-select-label" shrink>Perfil</InputLabel>
                <Select
                  labelId="perfil-select-label"
                  value={formData.perfil}
                  label="Perfil"
                  onChange={(e) => handleChange('perfil', Number(e.target.value))}
                >
                  {PERFIS.map((perfil) => (
                    <MenuItem key={perfil.value} value={perfil.value}>
                      {perfil.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </S.FormField>
          </S.FormFieldsStack>
        </S.ContentStack>
      </CustomModal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

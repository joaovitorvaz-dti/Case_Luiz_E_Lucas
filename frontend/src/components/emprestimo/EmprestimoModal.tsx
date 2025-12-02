import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormHelperText from '@mui/material/FormHelperText';
import * as S from './EmprestimoModal.styles';
import { CustomModal } from '../ui/customModal/customModal';
import { getLivros, extrairMensagemErro } from '../../services/livroService';
import { getUsuarios } from '../../services/usuarioService';
import type { UsuarioApi } from '../../services/usuarioService';
import { createEmprestimo } from '../../services/emprestimoService';
import type { Livro } from '../../types/interfaces/livro';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialLivroId?: number | null;
}

export default function EmprestimoModal({ open, onClose, onCreated, initialLivroId }: Props) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
  const [livroId, setLivroId] = useState<number | ''>('');
  const [usuarioId, setUsuarioId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!open) return;
    setIsLoadingData(true);
    (async () => {
      try {
        const [l, u] = await Promise.all([getLivros(), getUsuarios()]);
        // getLivros returns mapped Livro (with status string)
        // filter out already-emprestado books (status !== 'Disponível')
        const somenteDisponiveis = (l as Livro[]).filter((item) => item.status === 'Disponível');
        setLivros(somenteDisponiveis);
        setUsuarios(u as UsuarioApi[]);
      } catch (err) {
        console.error('Erro ao buscar dados para empréstimo', err);
        setSnackbar({ open: true, message: extrairMensagemErro(err), severity: 'error' });
      } finally {
        setIsLoadingData(false);
      }
    })();
  }, [open]);

  // Se um livro inicial foi fornecido, pré-seleciona
  useEffect(() => {
    if (open && initialLivroId != null) {
      setLivroId(initialLivroId);
    }
  }, [open, initialLivroId]);

  const handleSubmit = async () => {
    if (!livroId || !usuarioId) {
      setSnackbar({ open: true, message: 'Selecione livro e usuário.', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createEmprestimo(Number(livroId), Number(usuarioId));
      setIsSubmitting(false);
      setSnackbar({ open: true, message: 'Empréstimo criado com sucesso.', severity: 'success' });

      setTimeout(() => {
        if (onCreated) onCreated();
        handleClose();
      }, 600);
    } catch (err) {
      setIsSubmitting(false);
      console.error('Erro ao criar empréstimo', err);
      setSnackbar({ open: true, message: extrairMensagemErro(err), severity: 'error' });
    }
  };

  const handleClose = () => {
    // reset local state
    setLivroId('');
    setUsuarioId('');
    setLivros([]);
    setUsuarios([]);
    setIsSubmitting(false);
    setIsLoadingData(false);
    setSnackbar({ open: false, message: '', severity: 'success' });
    onClose();
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Painel de empréstimo"
        showCloseButton
        actions={[
          <Button key="cancel" variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button
            key="save"
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoadingData || livros.length === 0 || usuarios.length === 0}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>,
        ]}
      >
        <S.ContentStack spacing={2}>
          {isLoadingData ? (
            <S.LoadingWrapper>
              <CircularProgress />
            </S.LoadingWrapper>
          ) : (
            <>
              <S.HelperBox>
                <Typography variant="body2" color="text.secondary">
                  Selecione o livro e o usuário para registrar o empréstimo.
                </Typography>
              </S.HelperBox>

              <S.DividerStyled />

              <S.RowStack>
                <S.FlexItem>
                  <S.FlexItemInner>
                      <FormControl fullWidth>
                        <InputLabel id="livro-select-label" shrink>Livro</InputLabel>
                    <Select
                      labelId="livro-select-label"
                      value={livroId}
                      label="Livro"
                      onChange={(e) => setLivroId(Number(e.target.value))}
                      displayEmpty
                      renderValue={(val) => {
                        const found = livros.find((l) => l.id === Number(val));
                        return found ? `${found.titulo} — ${found.autor}` : 'Selecione um livro';
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      {livros.map((l) => (
                        <MenuItem key={l.id} value={l.id} sx={{ whiteSpace: 'normal' }}>
                          <div>
                            <Typography variant="body2">{l.titulo}</Typography>
                            <Typography variant="caption" color="text.secondary">{l.autor} — {l.ano}</Typography>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                    {livros.length === 0 && <FormHelperText>Nenhum livro disponível para empréstimo.</FormHelperText>}
                    </FormControl>
                  </S.FlexItemInner>
                </S.FlexItem>

                <S.FlexItem>
                  <S.FlexItemInner>
                      <FormControl fullWidth>
                        <InputLabel id="usuario-select-label" shrink>Usuário</InputLabel>
                    <Select
                      labelId="usuario-select-label"
                      value={usuarioId}
                      label="Usuário"
                      onChange={(e) => setUsuarioId(Number(e.target.value))}
                      displayEmpty
                      renderValue={(val) => {
                        const found = usuarios.find((u) => u.id === Number(val));
                        return found ? `${found.name} — ${found.email}` : 'Selecione um usuário';
                      }}
                    >
                      {usuarios.map((u) => (
                        <MenuItem key={u.id} value={u.id} sx={{ whiteSpace: 'normal' }}>
                          <div>
                            <Typography variant="body2">{u.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                    {usuarios.length === 0 && <FormHelperText>Nenhum usuário cadastrado.</FormHelperText>}
                    </FormControl>
                  </S.FlexItemInner>
                </S.FlexItem>
              </S.RowStack>
            </>
          )}
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
import { AppBar, Toolbar, Button, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ marginBottom: 3 }}>
      <Toolbar>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
            }}
          >
            Livros
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/usuarios')}
            sx={{
              fontWeight: location.pathname === '/usuarios' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/usuarios' ? '2px solid white' : 'none',
            }}
          >
            Usuários
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

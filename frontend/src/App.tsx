// Em: src/App.tsx
import { Routes, Route } from 'react-router-dom';

import { Navbar } from './components/ui/navbar/navbar';
import { LivrosPage } from './pages/LivrosPage';
import { UsuariosPage } from './pages/UsuariosPage';
import Form from './pages/Form';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<LivrosPage />} />
      <Route path="/form" element={<Form />} />
      <Route path="/form/:id" element={<Form />} />
      <Route path="/usuarios" element={<UsuariosPage />} />
    </Routes>
    </>
  );
}

export default App;
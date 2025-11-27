// Em: src/App.tsx
import { Routes, Route } from 'react-router-dom';

import { LivrosPage } from './pages/LivrosPage';
import Form from './pages/Form';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LivrosPage />} />
      <Route path="/form" element={<Form />} />
      <Route path="/form/:id" element={<Form />} />
    </Routes>
  );
}

export default App;
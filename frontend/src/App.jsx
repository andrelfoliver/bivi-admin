import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import LoginPage from './LoginPage';
import ConfigEmpresa from './ConfigEmpresa';

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log("useEffect: verificando /api/current-user...", location);
    fetch('/api/current-user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log("Retorno /api/current-user:", data);
        if (data.loggedIn) {
          console.log("Definindo user:", data.user);
          setUser(data.user);
        } else {
          console.log("Nenhum usuário autenticado");
          setUser(null);
        }
      })
      .catch(err => console.error("Erro ao buscar /api/current-user:", err));
  }, [location]);

  console.log("Render App, user =", user);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={user ? <ConfigEmpresa /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

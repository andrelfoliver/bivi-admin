import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './LoginPage';
import ConfigEmpresa from './ConfigEmpresa';
import RegisterPage from './RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Não faz verificação automática de sessão ao montar o App.
  useEffect(() => {
    setLoading(false);
  }, []);

  // Função de logout: chama o endpoint, limpa o estado e força o redirecionamento para /login.
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Erro durante o logout:", error);
    } finally {
      setUser(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Se o usuário estiver logado, redireciona para /config; caso contrário, mostra LoginPage */}
        <Route 
          path="/login"
          element={user ? <Navigate to="/config" replace /> : <LoginPage setUser={setUser} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        {/* Área protegida: só acessível se o usuário estiver logado */}
        <Route 
          path="/config"
          element={user ? <ConfigEmpresa user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        {/* Qualquer acesso à raiz redireciona para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

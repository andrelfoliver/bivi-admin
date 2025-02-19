import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import LoginPage from './LoginPage';
import ConfigEmpresa from './ConfigEmpresa';
import RegisterPage from './RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Força sempre iniciar com user nulo (ignora qualquer sessão anterior)
    setUser(null);
    setLoading(false);
  }, []);

  // Função de logout que chama o endpoint, limpa o estado e não persiste a sessão
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Erro durante o logout:", error);
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rota de login: sempre exibe o LoginPage, mesmo que haja um token armazenado */}
        <Route 
          path="/login" 
          element={<LoginPage setUser={setUser} />} 
        />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rota protegida: só exibe o ConfigEmpresa se houver um usuário (definido após o login) */}
        <Route 
          path="/config" 
          element={user ? <ConfigEmpresa user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        {/* Qualquer acesso à raiz redireciona para /login */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

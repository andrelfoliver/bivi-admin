import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard'; // Novo componente de dashboard unificado

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica a sessão (pode ser adaptado conforme sua API real)
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/current-user', { credentials: 'include' });
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  // Função de logout que chama o endpoint e atualiza o estado
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Erro durante o logout:", error);
    } finally {
      setUser(null);
      // Força redirecionamento para a tela de login
      window.location.href = '/login';
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route
          path="/login"
          element={
            user ? (
              // Se já estiver logado, redireciona para /dashboard
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        {/* Rota de Registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Rota do Dashboard unificado (admin e cliente) */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              // Se não estiver logado, redireciona para /login
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redireciona a raiz para /dashboard se estiver logado, senão para /login */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rota curinga: se chegar em algo que não existe, redireciona para / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

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
import AdminDashboard from './AdminDashboard';

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

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              user.role === 'admin' ?
                <Navigate to="/admin" replace />
                : <Navigate to="/config" replace />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/config"
          element={
            user ? (
              user.role !== 'admin' ?
                <ConfigEmpresa user={user} onLogout={handleLogout} />
                : <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user ? (
              user.role === 'admin' ?
                <AdminDashboard user={user} onLogout={handleLogout} />
                : <Navigate to="/config" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Sempre redireciona a raiz para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

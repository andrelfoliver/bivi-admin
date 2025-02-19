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

  // Ao montar o App, tenta recuperar a sessão do usuário
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/current-user', { credentials: 'include' });
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário atual:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Função de logout: chama o endpoint e limpa o estado do usuário
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
        <Route 
          path="/login"
          element={user ? <Navigate to="/config" replace /> : <LoginPage setUser={setUser} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/config"
          element={user ? <ConfigEmpresa user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

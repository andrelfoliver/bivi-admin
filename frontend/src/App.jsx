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
    async function checkUser() {
      try {
        console.log("Fetching /api/current-user...");
        const response = await fetch('/api/current-user', { credentials: 'include' });
        const data = await response.json();
        console.log("Response from /api/current-user:", data);
        // Mesmo que o servidor informe que há uma sessão ativa,
        // forçamos o estado do usuário para null para não carregar a última sessão.
        setUser(null);
      } catch (error) {
        console.error("Error fetching /api/current-user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  // Função de logout: chama o endpoint, limpa o estado e permite o redirecionamento para /login
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
        {/* Rota de login: se já houver um usuário (após login bem-sucedido), redireciona para /config */}
        <Route path="/login" element={user ? <Navigate to="/config" replace /> : <LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rota protegida: somente acessível se o usuário estiver autenticado */}
        <Route path="/config" element={user ? <ConfigEmpresa user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        {/* Qualquer acesso à raiz redireciona para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

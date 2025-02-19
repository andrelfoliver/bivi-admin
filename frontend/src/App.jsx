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
        if (data.loggedIn) {
          console.log("Setting user:", data.user);
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching /api/current-user:", error);
      } finally {
        setLoading(false);
      }
    }
    // Sempre checa o usuário, mas não redireciona automaticamente para a área protegida
    checkUser();
  }, []);

  // Função de logout que atualiza o estado do usuário
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
        {/* Rota de login SEM redirecionamento automático mesmo se houver sessão ativa */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Área protegida: só acessível se o usuário estiver autenticado */}
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

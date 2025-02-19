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
    checkUser();
  }, []);

  // Função de logout que atualiza o estado e limpa a sessão
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
        {/* Se o usuário já estiver autenticado, não exibe a tela de login */}
        <Route path="/login" element={user ? <Navigate to="/config" replace /> : <LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rota para a configuração da empresa (apenas se autenticado) */}
        <Route 
          path="/config" 
          element={user ? <ConfigEmpresa user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        {/* Rota raiz redireciona de acordo com a autenticação */}
        <Route path="/" element={user ? <Navigate to="/config" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

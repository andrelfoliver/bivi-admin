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
    // Executa a verificação somente uma vez no mount
    checkUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Se o usuário já estiver autenticado, não mostra a tela de login */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/config" replace /> : <LoginPage />} 
        />
        <Route path="/register" element={<RegisterPage />} />
        {/* Acesso à configuração somente se o usuário estiver autenticado */}
        <Route 
          path="/config" 
          element={user ? <ConfigEmpresa user={user} /> : <Navigate to="/login" replace />} 
        />
        {/* Se o usuário acessar a raiz:
              - se autenticado, vai para /config;
              - se não, vai para /login */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/config" replace /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

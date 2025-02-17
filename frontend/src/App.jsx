import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import LoginPage from './LoginPage';
import ConfigEmpresa from './ConfigEmpresa';

function App() {
  const [user, setUser] = useState(null);

  // Verifica a sessão no backend e envia os cookies com a requisição
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/current-user', {
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Retorno de /api/current-user:', data); // <-- Adicione este log
        if (data.loggedIn) {
          console.log('Setando user no state');
          setUser(data.user);
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    }
    checkUser();
  }, []);
  

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage onLogin={(userData) => setUser(userData)} />} 
        />
        <Route 
          path="/" 
          element={user ? <ConfigEmpresa /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

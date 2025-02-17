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

  // Verifica a sessão no backend ao montar o componente
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch('/api/current-user');
        const data = await response.json();
        if (data.loggedIn) {
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

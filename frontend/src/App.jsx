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


  console.log("Iniciando checkUser...");

  // Verifica a sessão no backend e envia os cookies com a requisição
  useEffect(() => {
    console.log("useEffect disparado");
    async function checkUser() {
      console.log("Tentando buscar /api/current-user...");
      const response = await fetch('/api/current-user', { credentials: 'include' });
      const data = await response.json();
      console.log("Retorno /api/current-user:", data);
      if (data.loggedIn) {
        setUser(data.user);
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

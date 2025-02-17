import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';       // Página de login
import ConfigEmpresa from './ConfigEmpresa'; // Página protegida (admin)

function App() {
  const [user, setUser] = useState(null);

  // Simule uma verificação de autenticação, por exemplo:
  useEffect(() => {
    // Aqui você pode buscar informações de autenticação (ex: via API, ou verificar um token no localStorage)
    // Por exemplo, se um token estiver presente, defina o user:
    const token = localStorage.getItem('authToken');
    if (token) {
      setUser({ token });
    }
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
          element={user ? <ConfigEmpresa /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
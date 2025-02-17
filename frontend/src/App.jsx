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

  useEffect(() => {
    console.log("useEffect: verificando /api/current-user...");
    fetch('/api/current-user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log("Retorno /api/current-user:", data);
        if (data.loggedIn) {
          console.log("Definindo user:", data.user);
          setUser(data.user);
        }
      })
      .catch(err => console.error("Erro ao buscar /api/current-user:", err));
  }, []);

  console.log("Render App, user =", user);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={user ? <ConfigEmpresa /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}


export default App;

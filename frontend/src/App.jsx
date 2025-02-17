import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import LoginPage from './LoginPage';
import ConfigEmpresa from './ConfigEmpresa';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={user ? <ConfigEmpresa /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

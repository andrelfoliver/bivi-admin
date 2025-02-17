import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Faça a autenticação, por exemplo, enviando uma requisição para sua API:
    // Aqui, simulamos o sucesso da autenticação:
    const userData = { email, token: 'exemplo-token' };
    onLogin(userData);
    localStorage.setItem('authToken', 'exemplo-token');
    navigate('/'); // redireciona para a página principal
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;

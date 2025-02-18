import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [message, setMessage] = useState('');

  // Função que verifica se a senha atende aos requisitos (mínimo 8 caracteres, 
  // pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial)
  const validatePasswordStrength = (pass) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(pass);
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    if (validatePasswordStrength(pass)) {
      setPasswordStrength('Senha forte');
    } else {
      setPasswordStrength('Senha fraca');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    if (!validatePasswordStrength(password)) {
      setMessage('A senha não atende aos requisitos de segurança.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Usuário cadastrado com sucesso!');
        // Limpa os inputs
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setPasswordStrength('');
      } else {
        setMessage(data.error || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMessage('Erro de conexão.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center" style={{ color: '#5de5d9' }}>Crie sua Conta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuário</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Digite sua senha"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <div className="form-text">{passwordStrength}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirme a Senha</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-entrar w-100">Cadastrar</button>
      </form>
      {message && <div className="mt-3 text-center">{message}</div>}
      <div className="mt-3 text-center">
        <p className="small text-muted">
          Já tem uma conta? <a href="/login" className="text-primary">Faça login</a>
        </p>
      </div>
      {/* Estilos customizados para o botão, seguindo a identidade visual */}
      <style jsx="true">{`
        .btn-entrar {
          background-color: #5de5d9;
          color: #fff;
          border: none;
          font-weight: bold;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          transition: background-color 0.3s;
        }
        .btn-entrar:hover {
          background-color: #4cc9c0;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;

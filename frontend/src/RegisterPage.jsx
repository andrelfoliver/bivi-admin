import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Validação de força da senha: mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
  const validatePasswordStrength = (pwd) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(pwd);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (validatePasswordStrength(pwd)) {
      setPasswordFeedback('Senha forte');
    } else {
      setPasswordFeedback('Senha fraca');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem!');
      return;
    }
    if (!validatePasswordStrength(password)) {
      setErrorMessage('A senha não atende aos requisitos de segurança.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setSuccessMessage('Usuário cadastrado com sucesso!');
        // Limpar os campos após o cadastro
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setPasswordFeedback('');
        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage('Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErrorMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Cabeçalho */}
      <header className="bg-dark text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img src="/logo.png" alt="BiVisualizer Logo" style={{ height: '60px' }} />
            <h1 className="ms-3">BiVisualizer</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center text-info mb-4">Crie sua Conta</h2>
              <p className="text-center text-muted mb-4">Preencha os dados abaixo para se cadastrar</p>
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuário</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
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
                    name="password"
                    className="form-control"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <small className="form-text text-muted">
                    A senha deve ter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.
                  </small>
                  {passwordFeedback && <div className="mt-1">{passwordFeedback}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirme a Senha</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-info w-100 fw-bold">
                  Cadastrar
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => window.location.href = '/login'}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c9302c'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d9534f'}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-info text-white text-center py-3">
        &copy; 2025 BiVisualizer. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default RegisterPage;

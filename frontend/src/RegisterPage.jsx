import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Função para validar a força da senha
  const validatePasswordStrength = (pwd) => {
    // A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.
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

    if (!username || !password || !confirmPassword) {
      setErrorMessage('Campos obrigatórios não preenchidos.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
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
        // Para este exemplo, estamos utilizando o mesmo valor para username e email;
        // ajuste conforme sua necessidade.
        body: JSON.stringify({ username, email: username, password, name: username }),
      });

      if (response.ok) {
        setSuccessMessage('Usuário cadastrado com sucesso!');
        // Limpa os campos após o sucesso
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setPasswordFeedback('');
        // Opcional: redirecione para a página de login após alguns segundos
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Erro ao cadastrar.');
      }
    } catch (error) {
      setErrorMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <>
      <style>
        {`
          .btn-cadastrar {
            background-color: #5de5d9;
            color: #fff;
            border: none;
            font-weight: bold;
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            transition: background-color 0.3s;
          }
          .btn-cadastrar:hover {
            background-color: #4cc9c0;
          }
        `}
      </style>
      <div className="d-flex flex-column min-vh-100">
        {/* Cabeçalho */}
        <header className="bg-dark text-white py-3">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="logo.png" alt="BiVisualizer Logo" style={{ height: '60px' }} />
              <h1 className="ms-3 h4 mb-0">BiVisualizer</h1>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="container" style={{ maxWidth: '400px' }}>
            <div className="card shadow">
              <div className="card-body">
                <p className="text-center text-muted mb-4">
                  Preencha os dados abaixo para se cadastrar
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Usuário
                    </label>
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
                    <label htmlFor="password" className="form-label">
                      Senha
                    </label>
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
                    <p className="small text-muted mt-1">
                      A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.
                    </p>
                    <p className="small mt-1" style={{ color: validatePasswordStrength(password) ? '#5de5d9' : '#dc3545' }}>
                      {passwordFeedback}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirme a Senha
                    </label>
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
                  <button type="submit" className="btn-cadastrar">
                    Cadastrar
                  </button>
                  {successMessage && (
                    <p className="text-success text-center mt-3">{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className="text-danger text-center mt-3">{errorMessage}</p>
                  )}
                </form>
                <div className="mt-3 text-center">
                  <p className="small text-muted">
                    Já tem uma conta?{' '}
                    <a href="/login" className="text-primary">
                      Faça login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Rodapé */}
        <footer className="text-white text-center py-3" style={{ backgroundColor: "#4cc9c0" }}>
          &copy; 2025 BiVisualizer. Todos os direitos reservados.
        </footer>
      </div>
    </>
  );
}

export default RegisterPage;

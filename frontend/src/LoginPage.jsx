import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: username, password }),
      });
      if (response.ok) {
        // Força o recarregamento da página para atualizar a sessão
        window.location.href = '/';
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Usuário ou senha inválidos!');
      }
    } catch (error) {
      setErrorMsg('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <>
      <style>
        {`
          /* Estilos para o layout two-panels */
          .login-container {
            min-height: 100vh;
            display: flex;
          }

          /* Painel esquerdo (bem-vindo) */
          .welcome-panel {
            flex: 1;
            background-color: #76c6a7; /* Ajuste a cor de fundo como desejar */
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .welcome-panel h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .welcome-panel p {
            font-size: 1rem;
            max-width: 300px;
            text-align: center;
            line-height: 1.5;
          }

          /* Painel direito (formulário) */
          .form-panel {
            flex: 1;
            background-color: #f8f9fa; /* Cor neutra do Bootstrap */
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem;
          }

          /* Ajustes do card */
          .card {
            max-width: 400px;
            margin: 0 auto;
          }

          /* Botão Entrar */
          .btn-entrar {
            background-color: #5de5d9;
            color: #fff;
            border: none;
            font-weight: bold;
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            transition: background-color 0.3s;
          }
          .btn-entrar:hover {
            background-color: #4cc9c0;
          }
          .btn-google {
            margin-top: 1rem;
          }

          /* Rodapé com cor personalizada */
          .custom-footer {
            background-color: #4cc9c0;
            color: white;
            text-align: center;
            padding: 1rem;
          }

          @media (max-width: 768px) {
            .login-container {
              flex-direction: column;
            }
            .welcome-panel, .form-panel {
              flex: unset;
              width: 100%;
            }
            .welcome-panel {
              order: 2;
            }
            .form-panel {
              order: 1;
            }
          }
        `}
      </style>

      {/* Cabeçalho */}
      <header className="bg-dark text-white py-3">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img src="logo.png" alt="BiVisualizer Logo" style={{ height: '60px' }} />
            <h1 className="ms-3 h4 mb-0">BiVisualizer</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal em dois painéis */}
      <div className="login-container">
        {/* Painel esquerdo */}
        <div className="welcome-panel">
          <h2>Bem-vindo de volta!</h2>
          <p>Para se manter conectado, faça login com suas informações pessoais</p>
        </div>

        {/* Painel direito - Formulário */}
        <div className="form-panel">
          <div className="card shadow">
            <div className="card-body">
              <p className="text-center text-muted mb-4">
                Faça login para continuar
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Usuário (E-mail)
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-entrar">
                  Entrar
                </button>
                {errorMsg && (
                  <p className="text-danger text-center mt-3">{errorMsg}</p>
                )}
              </form>
              <div className="mt-3 text-center">
                <p className="small text-muted">
                  Ainda não tem uma conta?{' '}
                  <a href="/register" className="text-primary">
                    Cadastre-se
                  </a>
                </p>
              </div>
              <hr />
              <div className="text-center">
                <a href="/auth/google" className="btn btn-outline-danger w-100 btn-google">
                  <i className="bi bi-google me-2"></i> Entrar com Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="custom-footer">
        &copy; 2025 BiVisualizer. Todos os direitos reservados.
      </footer>
    </>
  );
}

export default LoginPage;

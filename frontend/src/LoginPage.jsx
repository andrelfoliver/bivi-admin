import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementa sua lógica de autenticação, e após o sucesso, redireciona:
    // navigate('/');
  };

  return (
    <>
      <style>
        {`
          /* Estilo do botão "Entrar" */
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
                <p className="text-center text-muted mb-4">Faça login para continuar</p>
                <form id="loginForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuário</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Digite seu usuário"
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
                      required
                    />
                  </div>
                  <button type="submit" className="btn-entrar">Entrar</button>
                  <p id="errorMessage" className="text-danger text-center mt-3 d-none">
                    Usuário ou senha inválidos!
                  </p>
                </form>
                <div className="mt-3 text-center">
                  <p className="small text-muted">
                    Ainda não tem uma conta?{' '}
                    <Link to="/register" className="text-primary">Cadastre-se</Link>
                  </p>
                </div>
                <hr />
                <div className="text-center">
                  <a href="/auth/google" className="btn btn-outline-danger w-100">
                    <i className="bi bi-google me-2"></i> Entrar com Google
                  </a>
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

export default LoginPage;

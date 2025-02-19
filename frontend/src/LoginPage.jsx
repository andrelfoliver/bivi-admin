import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Lógica de submit do login manual
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // Envia "username" e "password" no corpo da requisição
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        // Força um reload para atualizar a sessão
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
          /* Área que centraliza tudo vertical/horizontal */
          .login-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f2f5; /* cor de fundo suave */
          }
          /* Container principal (box-shadow e bordas arredondadas) */
          .login-container {
            width: 900px;
            height: 500px;
            display: flex;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            background-color: #fff;
          }
          /* Painel esquerdo (40%) */
          .left-panel {
            flex: 0 0 40%;
            background-color: #000;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .left-panel img {
            height: 60px;
            margin-bottom: 1rem;
          }
          .left-panel h2 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }
          .left-panel p {
            font-size: 1rem;
            max-width: 250px;
            text-align: center;
            line-height: 1.5;
          }
          /* Painel direito (60%) */
          .right-panel {
            flex: 0 0 60%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem;
            background-color: #fff;
          }
          .right-panel h2 {
            text-align: center;
            margin-bottom: 1rem;
            color: #666;
          }
          .form-container {
            max-width: 350px;
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
          /* Botão Google */
          .btn-google {
            margin-top: 1rem;
          }
          /* Rodapé customizado */
          .custom-footer {
            background-color: #4cc9c0;
            color: #fff;
            text-align: center;
            padding: 1rem;
          }
          /* Responsivo */
          @media (max-width: 768px) {
            .login-container {
              width: 95%;
              height: auto;
              flex-direction: column;
            }
            .left-panel, .right-panel {
              flex: unset;
              width: 100%;
              height: auto;
            }
          }
        `}
      </style>

      <div className="login-wrapper">
        <div className="login-container">
          <div className="left-panel">
            <img src="logo.png" alt="BiVisualizer Logo" />
            <h2>BiVisualizer</h2>
            <p>Para se manter conectado, faça login com suas informações pessoais.</p>
          </div>
          <div className="right-panel">
            <div className="form-container">
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-entrar">Entrar</button>
                {errorMsg && (
                  <p className="text-danger text-center mt-3">{errorMsg}</p>
                )}
              </form>
              <div className="mt-3 text-center">
                <p className="small text-muted">
                  Ainda não tem uma conta?{' '}
                  <a href="/register" className="text-primary">Cadastre-se</a>
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

      <footer className="custom-footer">
        &copy; 2025 BiVisualizer. Todos os direitos reservados.
      </footer>
    </>
  );
}

export default LoginPage;

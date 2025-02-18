import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        }),
      });

      if (response.ok) {
        setSuccessMessage('Usuário cadastrado com sucesso!');
        setErrorMessage('');
        setFormData({ username: '', password: '', confirmPassword: '' });
        // Redireciona para a página de login após 2 segundos
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage('Erro ao cadastrar usuário!');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Erro ao cadastrar usuário!');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <style>
        {`
          /* Override dos estilos do Bootstrap para manter a identidade visual */
          .btn-register {
            background-color: #5de5d9;
            color: #fff;
            border: none;
            font-weight: bold;
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            transition: background-color 0.3s;
          }
          .btn-register:hover {
            background-color: #4cc9c0;
          }
          header {
            background-color: #272631;
          }
          footer {
            background-color: #4cc9c0;
          }
        `}
      </style>
      <div className="d-flex flex-column min-vh-100">
        {/* Cabeçalho */}
        <header className="py-3 text-white">
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
                <h2 className="text-center mb-4" style={{ color: '#5de5d9', fontSize: '2rem', fontWeight: 'bold' }}>
                  Crie sua Conta
                </h2>
                <p className="text-center text-muted mb-4">
                  Preencha os dados abaixo para se cadastrar
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuário</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      placeholder="Digite seu usuário"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      placeholder="Digite sua senha"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirme a Senha</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      placeholder="Confirme sua senha"
                      className="form-control"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn-register">Cadastrar</button>
                  {errorMessage && (
                    <p className="text-danger text-center mt-3">{errorMessage}</p>
                  )}
                  {successMessage && (
                    <p className="text-success text-center mt-3">{successMessage}</p>
                  )}
                </form>
                <div className="mt-4 text-center">
                  <p className="small text-muted">
                    Já tem uma conta? <Link to="/login" className="text-primary">Faça login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Rodapé */}
        <footer className="py-3 text-white text-center">
          &copy; 2025 BiVisualizer. Todos os direitos reservados.
        </footer>
      </div>
    </>
  );
}

export default RegisterPage;

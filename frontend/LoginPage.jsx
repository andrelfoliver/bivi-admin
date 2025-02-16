import React from 'react';

function LoginPage() {
  const handleLogin = () => {
    // Redireciona para a rota que inicia a autenticação com o Google
    window.location.href = '/auth/google';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1>Login</h1>
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Entrar com Gmail
      </button>
    </div>
  );
}

export default LoginPage;

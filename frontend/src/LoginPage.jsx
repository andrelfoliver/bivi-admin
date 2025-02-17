import React from 'react';

function LoginPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Login</h1>
      <p>Para acessar, faça login com sua conta do Google.</p>
      <a
        href="/auth/google"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4285F4',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Entrar com Google
      </a>
    </div>
  );
}

export default LoginPage;

import React from 'react';

function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-[#272631] text-white py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <img src="logo.png" alt="BiVisualizer Logo" className="h-16" />
            <h1 className="text-2xl font-bold ml-3">BiVisualizer</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <p className="text-gray-700 text-center mb-6">Faça login para continuar</p>
          <form id="loginForm" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Digite seu usuário"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5de5d9]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Digite sua senha"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5de5d9]"
              />
            </div>
            <button
              type="submit"
              className="block w-full text-center py-4 bg-[#5de5d9] text-white rounded-lg font-bold hover:bg-[#4cc9c0] transition-colors"
            >
              Entrar
            </button>
            <p id="errorMessage" className="text-red-500 text-center mt-4 hidden">
              Usuário ou senha inválidos!
            </p>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Ainda não tem uma conta?{' '}
              <a href="register.html" className="text-[#5de5d9] hover:underline">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-[#4cc9c0] text-white text-center py-4">
        &copy; 2025 BiVisualizer. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default LoginPage;

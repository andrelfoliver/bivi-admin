import React, { useState } from "react";

const ConfigEmpresa = () => {
  const [empresa, setEmpresa] = useState({
    nome: "",
    apiKey: "",
    telefone: "",
    email: "",
    saudacao: ""
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🔧 Configuração da Empresa
        </h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            ✅ Configuração salva com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              name="nome"
              placeholder="Nome da empresa"
              value={empresa.nome}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              API Key OpenAI
            </label>
            <input
              type="text"
              name="apiKey"
              placeholder="Chave de API OpenAI"
              value={empresa.apiKey}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Telefone WhatsApp
            </label>
            <input
              type="text"
              name="telefone"
              placeholder="Número de WhatsApp"
              value={empresa.telefone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              E-mail para Contato
            </label>
            <input
              type="email"
              name="email"
              placeholder="E-mail da empresa"
              value={empresa.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Mensagem de Saudação
            </label>
            <input
              type="text"
              name="saudacao"
              placeholder="Mensagem inicial da IA"
              value={empresa.saudacao}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Salvar Configuração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigEmpresa;

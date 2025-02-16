import React, { useState } from "react";

const ConfigEmpresa = () => {
  const [empresa, setEmpresa] = useState({
    // Dados Básicos
    nome: "",
    apiKey: "",
    telefone: "",
    email: "",
    saudacao: "",
    // Identidade Visual
    logo: null,
    primaryColor: "#5de5d9",
    secondaryColor: "#272631",
    backgroundColor: "#f5fafd",
    // Fluxo de Atendimento
    saudacaoInicial: "",
    respostaPadrao: "",
    solicitacaoEmail: "",
    mensagemEncerramento: "",
    listaProdutos: ""
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setEmpresa({ ...empresa, [name]: files[0] });
    } else {
      setEmpresa({ ...empresa, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode realizar a lógica para enviar os dados para o backend
    console.log("Dados da empresa:", empresa);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🔧 Configuração da Empresa
        </h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            ✅ Configuração salva com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1 – Dados Básicos */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Dados Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  E‑mail para Contato
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="E‑mail da empresa"
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
            </div>
          </div>

          {/* Seção 2 – Identidade Visual */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Identidade Visual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Logotipo
                </label>
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Cor Primária
                </label>
                <input
                  type="color"
                  name="primaryColor"
                  value={empresa.primaryColor}
                  onChange={handleChange}
                  className="w-full h-12 p-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Cor Secundária
                </label>
                <input
                  type="color"
                  name="secondaryColor"
                  value={empresa.secondaryColor}
                  onChange={handleChange}
                  className="w-full h-12 p-1 border rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Cor de Fundo
                </label>
                <input
                  type="color"
                  name="backgroundColor"
                  value={empresa.backgroundColor}
                  onChange={handleChange}
                  className="w-full h-12 p-1 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Seção 3 – Fluxo de Atendimento */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Configuração do Atendimento
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Saudação Inicial
                </label>
                <textarea
                  name="saudacaoInicial"
                  rows="2"
                  placeholder="Ex.: Olá, seja bem-vindo à [nome da empresa]!"
                  value={empresa.saudacaoInicial}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Resposta Padrão
                </label>
                <textarea
                  name="respostaPadrao"
                  rows="2"
                  placeholder="Ex.: Oferecemos soluções inovadoras em análise de dados."
                  value={empresa.respostaPadrao}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mensagem para Solicitar E‑mail
                </label>
                <textarea
                  name="solicitacaoEmail"
                  rows="2"
                  placeholder="Ex.: Antes de nos despedirmos, posso enviar mais detalhes por e‑mail. Qual é o seu e‑mail?"
                  value={empresa.solicitacaoEmail}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mensagem de Encerramento
                </label>
                <textarea
                  name="mensagemEncerramento"
                  rows="2"
                  placeholder="Ex.: Obrigado pelo contato! Estamos à disposição."
                  value={empresa.mensagemEncerramento}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Lista de Produtos/Serviços
                </label>
                <textarea
                  name="listaProdutos"
                  rows="3"
                  placeholder="Ex.: - Dashboards Interativos\n- Atendimento Virtual com IA\n- Soluções Integradas"
                  value={empresa.listaProdutos}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition whitespace-pre-wrap"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
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

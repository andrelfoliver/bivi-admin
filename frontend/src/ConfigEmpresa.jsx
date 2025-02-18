// ConfigEmpresa.jsx
import React, { useState, useRef } from 'react';

// Função para calcular a distância de Levenshtein entre duas strings
function levenshteinDistance(a, b) {
  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

// Sugere um domínio próximo se a distância for pequena
function getClosestDomain(typedDomain) {
  const popularDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];
  let closest = null;
  let minDistance = Infinity;
  popularDomains.forEach((domain) => {
    const distance = levenshteinDistance(typedDomain.toLowerCase(), domain);
    if (distance < minDistance) {
      minDistance = distance;
      closest = domain;
    }
  });
  return minDistance <= 2 ? closest : null;
}

const translations = {
  pt: {
    pageTitle: "Configuração da Empresa",
    dadosBasicos: "Dados Básicos",
    nomeEmpresa: "Nome da Empresa",
    nomePlaceholder: "Digite o nome da empresa",
    apiKey: "API Key OpenAI",
    apiPlaceholder: "Digite a API Key",
    apiKeyError:
      "API Key inválida. Deve começar com 'sk-' e ter no mínimo 50 caracteres.",
    telefone: "Telefone",
    telefonePlaceholder: "Digite o telefone",
    email: "E‑mail para Contato",
    emailPlaceholder: "Digite o e‑mail",
    saudacao: "Saudação",
    saudacaoPlaceholder: "Mensagem de saudação",
    identidadeVisual: "Identidade Visual",
    logotipo: "Logotipo",
    logoDropZone:
      "Arraste e solte o logo aqui ou clique para selecionar (somente PNG ou JPEG).",
    corPrimaria: "Cor Primária",
    corSecundaria: "Cor Secundária",
    corFundo: "Cor de Fundo",
    configuracaoAtendimento: "Configuração do Atendimento",
    saudacaoInicial: "Saudação Inicial",
    saudacaoInicialPlaceholder:
      "Ex.: Olá, seja bem-vindo à [nome da empresa]!",
    respostaPadrao: "Resposta Padrão",
    respostaPadraoPlaceholder:
      "Ex.: Oferecemos soluções inovadoras em análise de dados.",
    solicitacaoEmail: "Mensagem para Solicitar E‑mail",
    solicitacaoEmailPlaceholder:
      "Ex.: Antes de nos despedirmos, posso enviar mais detalhes por e‑mail. Qual é o seu e‑mail?",
    mensagemEncerramento: "Mensagem de Encerramento",
    mensagemEncerramentoPlaceholder:
      "Ex.: Obrigado pelo contato! Estamos à disposição.",
    listaProdutos: "Lista de Produtos/Serviços",
    listaProdutosPlaceholder:
      "Ex.: - Dashboards Interativos\n- Atendimento Virtual com IA\n- Soluções Integradas",
    salvar: "Salvar Configuração",
    logout: "Sair",
    languageLabel: "Idioma",
    successMessage: "Configuração salva com sucesso!",
    logoFormatError: "Apenas arquivos PNG ou JPEG são aceitos.",
    envSectionTitle: "Configuração do Arquivo .env",
    instrucoesPersonalizadas: "Instruções Personalizadas",
    regrasResposta: "Regras de Resposta",
    regrasRespostaPlaceholder:
      "Digite as regras de resposta para a assistente virtual",
    linkCalendly: "Link de Calendly",
    linkCalendlyPlaceholder: "Cole o link do Calendly aqui",
    linkSite: "Link do Site",
    linkSitePlaceholder: "Cole o link do site aqui",
    exemplosAtendimento: "Exemplos de Perguntas e Respostas",
    exemplosAtendimentoPlaceholder:
      "Digite exemplos de perguntas e respostas para o atendimento",
  },
  en: {
    pageTitle: "Company Setup",
    dadosBasicos: "Basic Information",
    nomeEmpresa: "Company Name",
    nomePlaceholder: "Enter company name",
    apiKey: "OpenAI API Key",
    apiPlaceholder: "Enter API Key",
    apiKeyError:
      "Invalid API Key. It must start with 'sk-' and be at least 50 characters long.",
    telefone: "Phone",
    telefonePlaceholder: "Enter phone number",
    email: "Contact E‑mail",
    emailPlaceholder: "Enter e‑mail",
    saudacao: "Greeting",
    saudacaoPlaceholder: "Greeting message",
    identidadeVisual: "Visual Identity",
    logotipo: "Logo",
    logoDropZone: "Drag and drop the logo here or click to select (only PNG or JPEG).",
    corPrimaria: "Primary Color",
    corSecundaria: "Secondary Color",
    corFundo: "Background Color",
    configuracaoAtendimento: "Service Configuration",
    saudacaoInicial: "Initial Greeting",
    saudacaoInicialPlaceholder:
      "E.g., Hello, welcome to [company name]!",
    respostaPadrao: "Standard Response",
    respostaPadraoPlaceholder:
      "E.g., We offer innovative data analysis solutions.",
    solicitacaoEmail: "E‑mail Request Message",
    solicitacaoEmailPlaceholder:
      "E.g., Before we say goodbye, may I send more details via e‑mail? What is your e‑mail?",
    mensagemEncerramento: "Closing Message",
    mensagemEncerramentoPlaceholder:
      "E.g., Thank you for contacting us! We're at your service.",
    listaProdutos: "Products/Services List",
    listaProdutosPlaceholder:
      "E.g., - Interactive Dashboards\n- Virtual Assistance with AI\n- Integrated Solutions",
    salvar: "Save Configuration",
    logout: "Logout",
    languageLabel: "Language",
    successMessage: "Configuration saved successfully!",
    logoFormatError: "Only PNG or JPEG files are allowed.",
    envSectionTitle: ".env File Configuration",
    instrucoesPersonalizadas: "Personalized Instructions",
    regrasResposta: "Response Rules",
    regrasRespostaPlaceholder: "Enter response rules for the virtual assistant",
    linkCalendly: "Calendly Link",
    linkCalendlyPlaceholder: "Paste your Calendly link here",
    linkSite: "Site Link",
    linkSitePlaceholder: "Paste your site link here",
    exemplosAtendimento: "Examples of Q&A",
    exemplosAtendimentoPlaceholder: "Enter examples of common Q&A for customer service",
  },
};

function ConfigEmpresa({ user, handleLogout }) {
  console.log("ConfigEmpresa renderizado!");
  const [language, setLanguage] = useState('pt');
  const t = translations[language];

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogoutLocal = () => {
    if (handleLogout) {
      handleLogout();
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  };

  const [empresa, setEmpresa] = useState({
    nome: '',
    apiKey: '',
    telefone: '',
    email: '',
    saudacao: '',
    logo: null,
    primaryColor: '#5de5d9',
    secondaryColor: '#272631',
    backgroundColor: '#f5fafd',
    saudacaoInicial: '',
    respostaPadrao: '',
    solicitacaoEmail: '',
    mensagemEncerramento: '',
    listaProdutos: '',
    verifyToken: '',
    whatsappApiToken: '',
    openaiApiKey: '',
    mongoUri: '',
    phoneNumberId: '',
    emailUser: '',
    emailPass: '',
    emailGestor: '',
    regrasResposta: '',
    linkCalendly: '',
    linkSite: '',
    exemplosAtendimento: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const logoInputRef = useRef(null);

  const [envExplanations, setEnvExplanations] = useState({
    verifyToken: false,
    whatsappApiToken: false,
    openaiApiKey: false,
    mongoUri: false,
    phoneNumberId: false,
    emailUser: false,
    emailPass: false,
    emailGestor: false,
  });
  const [instExplanations, setInstExplanations] = useState({
    regrasResposta: false,
    linkCalendly: false,
    linkSite: false,
    exemplosAtendimento: false,
  });

  const envExplanationsTexts = {
    verifyToken:
      "Token utilizado para verificar a autenticidade das requisições, garantindo a segurança da integração.",
    whatsappApiToken:
      "Token da API do WhatsApp, necessário para autenticar as requisições à API do WhatsApp Business.",
    openaiApiKey:
      "Chave de API da OpenAI que permite acessar os serviços de inteligência artificial.",
    mongoUri:
      "URI de conexão do banco de dados MongoDB, utilizada para conectar a aplicação ao banco de dados.",
    phoneNumberId:
      "Identificador do número de telefone configurado para o WhatsApp Business.",
    emailUser:
      "Endereço de e‑mail usado para envio de notificações automáticas.",
    emailPass:
      "Senha associada ao e‑mail definido em EMAIL_USER, para autenticação no serviço de e‑mail.",
    emailGestor:
      "E‑mail do gestor da aplicação, que receberá notificações e relatórios.",
  };

  const instExplanationsTexts = {
    regrasResposta:
      "Defina as diretrizes de como a assistente deve responder, incluindo regras de finalização e comportamento assertivo.",
    linkCalendly:
      "URL utilizada para agendamentos e reuniões quando o cliente solicitar valores ou atendimento humano.",
    linkSite:
      "URL do site da empresa, utilizada para direcionar clientes a depoimentos ou trabalhos anteriores.",
    exemplosAtendimento:
      "Forneça exemplos de perguntas e respostas comuns, para personalizar o atendimento e agilizar o fluxo de conversação.",
  };

  const clearForm = () => {
    setEmpresa({
      nome: '',
      apiKey: '',
      telefone: '',
      email: '',
      saudacao: '',
      logo: null,
      primaryColor: '#5de5d9',
      secondaryColor: '#272631',
      backgroundColor: '#f5fafd',
      saudacaoInicial: '',
      respostaPadrao: '',
      solicitacaoEmail: '',
      mensagemEncerramento: '',
      listaProdutos: '',
      verifyToken: '',
      whatsappApiToken: '',
      openaiApiKey: '',
      mongoUri: '',
      phoneNumberId: '',
      emailUser: '',
      emailPass: '',
      emailGestor: '',
      regrasResposta: '',
      linkCalendly: '',
      linkSite: '',
      exemplosAtendimento: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit acionado");
    console.log("Dados da empresa a serem enviados:", empresa);
    try {
      const response = await fetch('/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa),
      });
      console.log("Status da resposta:", response.status);
      const data = await response.json();
      console.log("Resposta do servidor:", data);
      if (!response.ok) {
        setSubmitError(data.error || "Erro ao salvar configuração.");
      } else {
        setSuccess(true);
        setSubmitError(null);
        clearForm();
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setSubmitError("Erro ao enviar dados: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        setEmpresa({ ...empresa, [name]: file });
        setErrors((prev) => ({ ...prev, logo: '' }));
      } else {
        setErrors((prev) => ({ ...prev, logo: t.logoFormatError }));
        setEmpresa({ ...empresa, [name]: null });
      }
    } else {
      setEmpresa({ ...empresa, [name]: value });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        setEmpresa({ ...empresa, logo: file });
        setErrors((prev) => ({ ...prev, logo: '' }));
      } else {
        setErrors((prev) => ({ ...prev, logo: t.logoFormatError }));
      }
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    switch (name) {
      case 'nome':
        if (!value.trim())
          error = language === 'pt' ? 'Nome é obrigatório.' : 'Name is required.';
        break;
      case 'apiKey':
        if (!value.trim() || !/^sk-(proj-)?[A-Za-z0-9_-]+$/.test(value) || value.length < 50) {
          error = t.apiKeyError;
        }
        break;
      case 'telefone': {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15)
          error = language === 'pt'
            ? 'Telefone inválido. Insira entre 10 e 15 dígitos.'
            : 'Invalid phone. Enter between 10 and 15 digits.';
        break;
      }
      case 'email': {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value.trim() || !emailRegex.test(value)) {
          error = language === 'pt' ? 'E‑mail inválido.' : 'Invalid e‑mail.';
        } else {
          const domain = value.split('@')[1];
          const suggestion = getClosestDomain(domain);
          if (suggestion && suggestion !== domain.toLowerCase()) {
            error = language === 'pt'
              ? `Você quis dizer ${value.split('@')[0]}@${suggestion}?`
              : `Did you mean ${value.split('@')[0]}@${suggestion}?`;
          }
        }
        break;
      }
      case 'saudacao':
        if (!value.trim())
          error = language === 'pt' ? 'Saudação é obrigatória.' : 'Greeting is required.';
        break;
      case 'saudacaoInicial':
        if (!value.trim())
          error = language === 'pt'
            ? 'Saudação Inicial é obrigatória.'
            : 'Initial Greeting is required.';
        break;
      case 'respostaPadrao':
        if (!value.trim())
          error = language === 'pt'
            ? 'Resposta Padrão é obrigatória.'
            : 'Standard Response is required.';
        break;
      case 'mensagemEncerramento':
        if (!value.trim())
          error = language === 'pt'
            ? 'Mensagem de Encerramento é obrigatória.'
            : 'Closing Message is required.';
        break;
      case 'listaProdutos':
        if (!value.trim())
          error = language === 'pt'
            ? 'Lista de Produtos/Serviços é obrigatória.'
            : 'Products/Services List is required.';
        break;
      case 'verifyToken':
      case 'whatsappApiToken':
      case 'openaiApiKey':
      case 'mongoUri':
      case 'phoneNumberId':
      case 'emailUser':
      case 'emailPass':
      case 'emailGestor':
        if (!value.trim())
          error = language === 'pt'
            ? `${name.toUpperCase()} é obrigatório.`
            : `${name.toUpperCase()} is required.`;
        break;
      case 'regrasResposta':
        if (!value.trim())
          error = language === 'pt'
            ? 'Regras de Resposta são obrigatórias.'
            : 'Response rules are required.';
        break;
      case 'linkCalendly':
        if (!value.trim())
          error = language === 'pt'
            ? 'Link de Calendly é obrigatório.'
            : 'Calendly link is required.';
        break;
      case 'linkSite':
        if (!value.trim())
          error = language === 'pt'
            ? 'Link do Site é obrigatório.'
            : 'Site link is required.';
        break;
      case 'exemplosAtendimento':
        if (!value.trim())
          error = language === 'pt'
            ? 'Exemplos de Perguntas e Respostas são obrigatórios.'
            : 'Examples of Q&A are required.';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!empresa.nome.trim())
      newErrors.nome = language === 'pt' ? 'Nome é obrigatório.' : 'Name is required.';
    if (!empresa.apiKey.trim() || !/^sk-(proj-)?[A-Za-z0-9_-]+$/.test(empresa.apiKey) || empresa.apiKey.length < 50)
      newErrors.apiKey = t.apiKeyError;
    const phoneDigits = empresa.telefone.replace(/\D/g, '');
    if (!empresa.telefone.trim() || phoneDigits.length < 10 || phoneDigits.length > 15)
      newErrors.telefone = language === 'pt'
        ? 'Telefone inválido. Insira entre 10 e 15 dígitos.'
        : 'Invalid phone. Enter between 10 and 15 digits.';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!empresa.email.trim() || !emailRegex.test(empresa.email))
      newErrors.email = language === 'pt' ? 'E‑mail inválido.' : 'Invalid e‑mail.';
    if (!empresa.saudacao.trim())
      newErrors.saudacao = language === 'pt'
        ? 'Saudação é obrigatória.'
        : 'Greeting is required.';
    if (!empresa.saudacaoInicial.trim())
      newErrors.saudacaoInicial = language === 'pt'
        ? 'Saudação Inicial é obrigatória.'
        : 'Initial Greeting is required.';
    if (!empresa.respostaPadrao.trim())
      newErrors.respostaPadrao = language === 'pt'
        ? 'Resposta Padrão é obrigatória.'
        : 'Standard Response is required.';
    if (!empresa.mensagemEncerramento.trim())
      newErrors.mensagemEncerramento = language === 'pt'
        ? 'Mensagem de Encerramento é obrigatória.'
        : 'Closing Message is required.';
    if (!empresa.listaProdutos.trim())
      newErrors.listaProdutos = language === 'pt'
        ? 'Lista de Produtos/Serviços é obrigatória.'
        : 'Products/Services List is required.';
    [
      'verifyToken',
      'whatsappApiToken',
      'openaiApiKey',
      'mongoUri',
      'phoneNumberId',
      'emailUser',
      'emailPass',
      'emailGestor',
    ].forEach((field) => {
      if (!empresa[field].trim()) {
        newErrors[field] = language === 'pt'
          ? `${field.toUpperCase()} é obrigatório.`
          : `${field.toUpperCase()} is required.`;
      }
    });
    if (!empresa.regrasResposta.trim()) {
      newErrors.regrasResposta = language === 'pt'
        ? 'Regras de Resposta são obrigatórias.'
        : 'Response rules are required.';
    }
    if (!empresa.linkCalendly.trim()) {
      newErrors.linkCalendly = language === 'pt'
        ? 'Link de Calendly é obrigatório.'
        : 'Calendly link is required.';
    }
    if (!empresa.linkSite.trim()) {
      newErrors.linkSite = language === 'pt'
        ? 'Link do Site é obrigatório.'
        : 'Site link is required.';
    }
    if (!empresa.exemplosAtendimento.trim()) {
      newErrors.exemplosAtendimento = language === 'pt'
        ? 'Exemplos de Perguntas e Respostas são obrigatórios.'
        : 'Examples of Q&A are required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img src="logo.png" alt="BiVisualizer Logo" />
          <h1 className="ms-3">BiVisualizer</h1>
        </div>
        <div className="d-flex align-items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="form-select me-3"
            style={{ width: '120px' }}
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
          {user && (
            <div className="user-info me-3">
              <img
                src={user.picture ? user.picture : '/default-avatar.png'}
                alt={user.name}
              />
              <span>{user.name}</span>
            </div>
          )}
          <button className="btn btn-danger btn-logout" onClick={handleLogoutLocal}>
            {t.logout}
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow-1 bg-light p-4">
        <div className="container bg-white p-4 rounded shadow">
          <h2 className="text-center text-primary mb-4">{t.pageTitle}</h2>
          {success && (
            <div className="alert alert-success text-center">
              {t.successMessage}
            </div>
          )}
          {submitError && (
            <div className="alert alert-danger text-center">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Seção 1 – Dados Básicos */}
            <section className="mb-4">
              <h3 className="h4 text-dark mb-3">{t.dadosBasicos}</h3>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.nomeEmpresa}</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder={t.nomePlaceholder}
                    value={empresa.nome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  />
                  {errors.nome && <div className="text-danger mt-1">{errors.nome}</div>}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.apiKey}</label>
                  <input
                    type="text"
                    name="apiKey"
                    placeholder={t.apiPlaceholder}
                    value={empresa.apiKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  />
                  {errors.apiKey && <div className="text-danger mt-1">{errors.apiKey}</div>}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.telefone}</label>
                  <input
                    type="text"
                    name="telefone"
                    placeholder={t.telefonePlaceholder}
                    value={empresa.telefone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  />
                  {errors.telefone && <div className="text-danger mt-1">{errors.telefone}</div>}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.email}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.emailPlaceholder}
                    value={empresa.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  />
                  {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.saudacao}</label>
                  <input
                    type="text"
                    name="saudacao"
                    placeholder={t.saudacaoPlaceholder}
                    value={empresa.saudacao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  />
                  {errors.saudacao && <div className="text-danger mt-1">{errors.saudacao}</div>}
                </div>
              </div>
            </section>

            {/* Seção 2 – Identidade Visual */}
            <section className="mb-4">
              <h3 className="h4 text-dark mb-3">{t.identidadeVisual}</h3>
              <div className="mb-3">
                <label className="form-label">{t.logotipo}</label>
                <div
                  className="border border-secondary rounded p-3 text-center"
                  style={{ cursor: 'pointer' }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => logoInputRef.current && logoInputRef.current.click()}
                >
                  <p>{t.logoDropZone}</p>
                  <input
                    type="file"
                    name="logo"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                    ref={logoInputRef}
                    style={{ display: 'none' }}
                  />
                </div>
                {errors.logo && <div className="text-danger mt-1">{errors.logo}</div>}
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.corPrimaria}</label>
                  <input
                    type="color"
                    name="primaryColor"
                    value={empresa.primaryColor}
                    onChange={handleChange}
                    className="form-control form-control-color"
                    title="Choose your color"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.corSecundaria}</label>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={empresa.secondaryColor}
                    onChange={handleChange}
                    className="form-control form-control-color"
                    title="Choose your color"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t.corFundo}</label>
                  <input
                    type="color"
                    name="backgroundColor"
                    value={empresa.backgroundColor}
                    onChange={handleChange}
                    className="form-control form-control-color"
                    title="Choose your color"
                  />
                </div>
              </div>
            </section>

            {/* Seção 3 – Fluxo de Atendimento */}
            <section className="mb-4">
              <h3 className="h4 text-dark mb-3">{t.configuracaoAtendimento}</h3>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">{t.saudacaoInicial}</label>
                  <textarea
                    name="saudacaoInicial"
                    rows="2"
                    placeholder={t.saudacaoInicialPlaceholder}
                    value={empresa.saudacaoInicial}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  ></textarea>
                  {errors.saudacaoInicial && <div className="text-danger mt-1">{errors.saudacaoInicial}</div>}
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">{t.respostaPadrao}</label>
                  <textarea
                    name="respostaPadrao"
                    rows="2"
                    placeholder={t.respostaPadraoPlaceholder}
                    value={empresa.respostaPadrao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  ></textarea>
                  {errors.respostaPadrao && <div className="text-danger mt-1">{errors.respostaPadrao}</div>}
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">{t.solicitacaoEmail}</label>
                  <textarea
                    name="solicitacaoEmail"
                    rows="2"
                    placeholder={t.solicitacaoEmailPlaceholder}
                    value={empresa.solicitacaoEmail}
                    onChange={handleChange}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">{t.mensagemEncerramento}</label>
                  <textarea
                    name="mensagemEncerramento"
                    rows="2"
                    placeholder={t.mensagemEncerramentoPlaceholder}
                    value={empresa.mensagemEncerramento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    required
                  ></textarea>
                  {errors.mensagemEncerramento && <div className="text-danger mt-1">{errors.mensagemEncerramento}</div>}
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">{t.listaProdutos}</label>
                  <textarea
                    name="listaProdutos"
                    rows="3"
                    placeholder={t.listaProdutosPlaceholder}
                    value={empresa.listaProdutos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    style={{ whiteSpace: 'pre-wrap' }}
                    required
                  ></textarea>
                  {errors.listaProdutos && <div className="text-danger mt-1">{errors.listaProdutos}</div>}
                </div>
              </div>
            </section>

            {/* Seção 4 – Variáveis do Ambiente (.env) */}
            <section className="mb-4">
              <h3 className="h4 text-dark mb-3">{t.envSectionTitle}</h3>
              <div className="row">
                {[
                  { label: 'VERIFY_TOKEN', name: 'verifyToken' },
                  { label: 'WHATSAPP_API_TOKEN', name: 'whatsappApiToken' },
                  { label: 'OPENAI_API_KEY', name: 'openaiApiKey' },
                  { label: 'MONGO_URI', name: 'mongoUri' },
                  { label: 'PHONE_NUMBER_ID', name: 'phoneNumberId' },
                  { label: 'EMAIL_USER', name: 'emailUser' },
                  { label: 'EMAIL_PASS', name: 'emailPass', type: 'password' },
                  { label: 'EMAIL_GESTOR', name: 'emailGestor' },
                ].map((field) => (
                  <div key={field.name} className="col-md-6 mb-3">
                    <label className="form-label">
                      {field.label}
                      <span
                        style={{ marginLeft: '8px', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => toggleEnvExplanation(field.name)}
                      >
                        ?
                      </span>
                    </label>
                    <input
                      type={field.type ? field.type : 'text'}
                      name={field.name}
                      placeholder={field.label}
                      value={empresa[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control"
                      required
                    />
                    {errors[field.name] && <div className="text-danger mt-1">{errors[field.name]}</div>}
                    {envExplanations[field.name] && (
                      <div className="alert alert-info mt-1" style={{ fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px' }}>
                        {envExplanationsTexts[field.name]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 5 – Instruções Personalizadas */}
            <section className="mb-4">
              <h3 className="h4 text-dark mb-3">{t.instrucoesPersonalizadas}</h3>
              <div className="row">
                {[
                  { label: t.regrasResposta, name: 'regrasResposta', placeholder: t.regrasRespostaPlaceholder },
                  { label: t.linkCalendly, name: 'linkCalendly', placeholder: t.linkCalendlyPlaceholder },
                  { label: t.linkSite, name: 'linkSite', placeholder: t.linkSitePlaceholder },
                  { label: t.exemplosAtendimento, name: 'exemplosAtendimento', placeholder: t.exemplosAtendimentoPlaceholder },
                ].map((field) => (
                  <div key={field.name} className="col-md-6 mb-3">
                    <label className="form-label">
                      {field.label}
                      <span
                        style={{ marginLeft: '8px', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => toggleInstExplanation(field.name)}
                      >
                        ?
                      </span>
                    </label>
                    {field.name === 'regrasResposta' || field.name === 'exemplosAtendimento' ? (
                      <textarea
                        name={field.name}
                        rows="5"
                        placeholder={field.placeholder}
                        value={empresa[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-control"
                        required
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        placeholder={field.placeholder}
                        value={empresa[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-control"
                        required
                      />
                    )}
                    {errors[field.name] && <div className="text-danger mt-1">{errors[field.name]}</div>}
                    {instExplanations[field.name] && (
                      <div className="alert alert-info mt-1" style={{ fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px' }}>
                        {field.name === 'regrasResposta'
                          ? instExplanationsTexts.regrasResposta
                          : field.name === 'linkCalendly'
                          ? instExplanationsTexts.linkCalendly
                          : field.name === 'linkSite'
                          ? instExplanationsTexts.linkSite
                          : instExplanationsTexts.exemplosAtendimento}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <button type="submit" className="btn btn-primary btn-lg w-100">
              {t.salvar}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-info text-white text-center py-3">
        &copy; 2025 BiVisualizer. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default ConfigEmpresa;

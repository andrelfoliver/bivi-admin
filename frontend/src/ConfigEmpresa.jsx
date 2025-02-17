import React, { useState, useRef } from 'react';

// Função para calcular a distância de Levenshtein entre duas strings
function levenshteinDistance(a, b) {
  const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
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
    // Novos textos para Instruções Personalizadas
    instrucoesPersonalizadas: "Instruções Personalizadas",
    regrasResposta: "Regras de Resposta",
    regrasRespostaPlaceholder: "Digite as regras de resposta para a assistente virtual",
    linkCalendly: "Link de Calendly",
    linkCalendlyPlaceholder: "Cole o link do Calendly aqui",
    linkSite: "Link do Site",
    linkSitePlaceholder: "Cole o link do site aqui",
    exemplosAtendimento: "Exemplos de Perguntas e Respostas",
    exemplosAtendimentoPlaceholder: "Digite exemplos de perguntas e respostas para o atendimento",
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
    logoDropZone:
      "Drag and drop the logo here or click to select (only PNG or JPEG files are accepted).",
    corPrimaria: "Primary Color",
    corSecundaria: "Secondary Color",
    corFundo: "Background Color",
    configuracaoAtendimento: "Service Flow Setup",
    saudacaoInicial: "Initial Greeting",
    saudacaoInicialPlaceholder:
      "E.g.: Hello, welcome to [company name]!",
    respostaPadrao: "Standard Response",
    respostaPadraoPlaceholder:
      "E.g.: We offer innovative data analysis solutions.",
    solicitacaoEmail: "E‑mail Request Message",
    solicitacaoEmailPlaceholder:
      "E.g.: Before we say goodbye, may I send more details via e‑mail? What is your e‑mail?",
    mensagemEncerramento: "Closing Message",
    mensagemEncerramentoPlaceholder:
      "E.g.: Thank you for contacting us! We're at your service.",
    listaProdutos: "Products/Services List",
    listaProdutosPlaceholder:
      "E.g.: - Interactive Dashboards\n- Virtual Assistance with AI\n- Integrated Solutions",
    salvar: "Save Configuration",
    logout: "Logout",
    languageLabel: "Language",
    successMessage: "Configuration saved successfully!",
    logoFormatError: "Only PNG or JPEG files are accepted.",
    envSectionTitle: ".env File Configuration",
    // New texts for Personalized Instructions
    instrucoesPersonalizadas: "Personalized Instructions",
    regrasResposta: "Response Rules",
    regrasRespostaPlaceholder: "Enter the response rules for the virtual assistant",
    linkCalendly: "Calendly Link",
    linkCalendlyPlaceholder: "Paste your Calendly link here",
    linkSite: "Site Link",
    linkSitePlaceholder: "Paste your site link here",
    exemplosAtendimento: "Examples of Q&A",
    exemplosAtendimentoPlaceholder: "Enter examples of common Q&A for customer service",
  },
};

function ConfigEmpresa() {
  const [language, setLanguage] = useState('pt');
  const t = translations[language];

  // Estado que armazena as configurações da empresa
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
    // Variáveis do .env
    verifyToken: '',
    whatsappApiToken: '',
    openaiApiKey: '',
    mongoUri: '',
    phoneNumberId: '',
    emailUser: '',
    emailPass: '',
    emailGestor: '',
    // Instruções Personalizadas
    regrasResposta: '',
    linkCalendly: '',
    linkSite: '',
    exemplosAtendimento: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const logoInputRef = useRef(null);

  // Estados para as explicações (tooltips)
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

  const explanationIconStyle = {
    marginLeft: '8px',
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const explanationTextStyle = {
    display: 'block',
    fontSize: '0.8rem',
    color: '#555',
    marginTop: '0.5rem',
    backgroundColor: '#f1f1f1',
    padding: '0.5rem',
    borderRadius: '4px',
  };

  const toggleEnvExplanation = (field) => {
    setEnvExplanations((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleInstExplanation = (field) => {
    setInstExplanations((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Função de envio do formulário atualizada para chamar a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit acionado"); // teste
    if (!validateForm()){
      console.log("Validação falhou", errors); 
      return;
    console.log("Dados da empresa:", empresa);
    }
    try {
      const response = await fetch('/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa),
      });
      const data = await response.json();
      console.log("Resposta do servidor:", data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
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
      // Validação dos campos do .env
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
      // Validação dos novos campos de Instruções Personalizadas
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
    // Validação dos campos do .env
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
    // Validação dos novos campos de Instruções Personalizadas
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#272631',
          color: 'white',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="logo.png" alt="BiVisualizer Logo" style={{ height: '60px' }} />
          <h1 style={{ marginLeft: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            BiVisualizer
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem' }}>{t.languageLabel}:</label>
          <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333', marginRight: '0.5rem' }} value={language} onChange={handleLanguageChange}>
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
          <button
            style={{
              backgroundColor: '#e3342f',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              marginLeft: '1rem',
            }}
          >
            {t.logout}
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ flexGrow: 1, backgroundColor: '#f5fafd', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', color: '#272631' }}>
            {t.pageTitle}
          </h2>
          {success && (
            <div style={{ backgroundColor: '#5de5d9', color: 'white', textAlign: 'center', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              {t.successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Seção 1 – Dados Básicos */}
            <section>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#272631', marginBottom: '1rem' }}>
                {t.dadosBasicos}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#272631' }}>{t.nomeEmpresa}</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder={t.nomePlaceholder}
                    value={empresa.nome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  />
                  {errors.nome && <span style={errorStyle}>{errors.nome}</span>}
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={labelStyle}>{t.apiKey}</label>
                  <input
                    type="text"
                    name="apiKey"
                    placeholder={t.apiPlaceholder}
                    value={empresa.apiKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  />
                  {errors.apiKey && <span style={errorStyle}>{errors.apiKey}</span>}
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={labelStyle}>{t.telefone}</label>
                  <input
                    type="text"
                    name="telefone"
                    placeholder={t.telefonePlaceholder}
                    value={empresa.telefone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  />
                  {errors.telefone && <span style={errorStyle}>{errors.telefone}</span>}
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={labelStyle}>{t.email}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.emailPlaceholder}
                    value={empresa.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  />
                  {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.saudacao}</label>
                  <input
                    type="text"
                    name="saudacao"
                    placeholder={t.saudacaoPlaceholder}
                    value={empresa.saudacao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  />
                  {errors.saudacao && <span style={errorStyle}>{errors.saudacao}</span>}
                </div>
              </div>
            </section>

            {/* Seção 2 – Identidade Visual */}
            <section>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#272631', marginBottom: '1rem' }}>
                {t.identidadeVisual}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.logotipo}</label>
                  <div
                    style={dropZoneStyle}
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
                  {errors.logo && <span style={errorStyle}>{errors.logo}</span>}
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={labelStyle}>{t.corPrimaria}</label>
                  <input
                    type="color"
                    name="primaryColor"
                    value={empresa.primaryColor}
                    onChange={handleChange}
                    style={{ width: '100%', height: '3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={labelStyle}>{t.corSecundaria}</label>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={empresa.secondaryColor}
                    onChange={handleChange}
                    style={{ width: '100%', height: '3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={labelStyle}>{t.corFundo}</label>
                  <input
                    type="color"
                    name="backgroundColor"
                    value={empresa.backgroundColor}
                    onChange={handleChange}
                    style={{ width: '100%', height: '3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </section>

            {/* Seção 3 – Fluxo de Atendimento */}
            <section>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#272631', marginBottom: '1rem' }}>
                {t.configuracaoAtendimento}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.saudacaoInicial}</label>
                  <textarea
                    name="saudacaoInicial"
                    rows="2"
                    placeholder={t.saudacaoInicialPlaceholder}
                    value={empresa.saudacaoInicial}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  ></textarea>
                  {errors.saudacaoInicial && <span style={errorStyle}>{errors.saudacaoInicial}</span>}
                </div>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.respostaPadrao}</label>
                  <textarea
                    name="respostaPadrao"
                    rows="2"
                    placeholder={t.respostaPadraoPlaceholder}
                    value={empresa.respostaPadrao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  ></textarea>
                  {errors.respostaPadrao && <span style={errorStyle}>{errors.respostaPadrao}</span>}
                </div>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.solicitacaoEmail}</label>
                  <textarea
                    name="solicitacaoEmail"
                    rows="2"
                    placeholder={t.solicitacaoEmailPlaceholder}
                    value={empresa.solicitacaoEmail}
                    onChange={handleChange}
                    style={inputStyle}
                  ></textarea>
                </div>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.mensagemEncerramento}</label>
                  <textarea
                    name="mensagemEncerramento"
                    rows="2"
                    placeholder={t.mensagemEncerramentoPlaceholder}
                    value={empresa.mensagemEncerramento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  ></textarea>
                  {errors.mensagemEncerramento && <span style={errorStyle}>{errors.mensagemEncerramento}</span>}
                </div>
                <div style={{ flex: '1 1 100%' }}>
                  <label style={labelStyle}>{t.listaProdutos}</label>
                  <textarea
                    name="listaProdutos"
                    rows="3"
                    placeholder={t.listaProdutosPlaceholder}
                    value={empresa.listaProdutos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ ...inputStyle, whiteSpace: 'pre-wrap' }}
                    required
                  ></textarea>
                  {errors.listaProdutos && <span style={errorStyle}>{errors.listaProdutos}</span>}
                </div>
              </div>
            </section>

            {/* Seção 4 – Variáveis do Ambiente (.env) */}
            <section>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#272631', marginBottom: '1rem' }}>
                {t.envSectionTitle}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  <div key={field.name} style={{ flex: '1 1 100%' }}>
                    <label style={labelStyle}>
                      {field.label}
                      <span style={explanationIconStyle} onClick={() => toggleEnvExplanation(field.name)}>
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
                      style={inputStyle}
                      required
                    />
                    {errors[field.name] && <span style={errorStyle}>{errors[field.name]}</span>}
                    {envExplanations[field.name] && (
                      <span style={explanationTextStyle}>
                        {envExplanationsTexts[field.name]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 5 – Instruções Personalizadas */}
            <section>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#272631', marginBottom: '1rem' }}>
                {t.instrucoesPersonalizadas}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: t.regrasResposta, name: 'regrasResposta', placeholder: t.regrasRespostaPlaceholder },
                  { label: t.linkCalendly, name: 'linkCalendly', placeholder: t.linkCalendlyPlaceholder },
                  { label: t.linkSite, name: 'linkSite', placeholder: t.linkSitePlaceholder },
                  { label: t.exemplosAtendimento, name: 'exemplosAtendimento', placeholder: t.exemplosAtendimentoPlaceholder },
                ].map((field) => (
                  <div key={field.name} style={{ flex: '1 1 100%' }}>
                    <label style={labelStyle}>
                      {field.label}
                      <span style={explanationIconStyle} onClick={() => toggleInstExplanation(field.name)}>
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
                        style={inputStyle}
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
                        style={inputStyle}
                        required
                      />
                    )}
                    {errors[field.name] && <span style={errorStyle}>{errors[field.name]}</span>}
                    {instExplanations[field.name] && (
                      <span style={explanationTextStyle}>
                        {field.name === 'regrasResposta'
                          ? instExplanationsTexts.regrasResposta
                          : field.name === 'linkCalendly'
                          ? instExplanationsTexts.linkCalendly
                          : field.name === 'linkSite'
                          ? instExplanationsTexts.linkSite
                          : instExplanationsTexts.exemplosAtendimento}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Botão de Envio */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#272631',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                {t.salvar}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#4cc9c0',
          color: 'white',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        &copy; 2025 BiVisualizer. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default ConfigEmpresa;

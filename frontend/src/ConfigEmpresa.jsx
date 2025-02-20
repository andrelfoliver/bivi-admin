import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
    apiKeyError: "API Key inválida. Deve começar com 'sk-' e ter no mínimo 50 caracteres.",
    telefone: "Telefone",
    telefonePlaceholder: "Digite o telefone",
    email: "E‑mail para Contato",
    emailPlaceholder: "Digite o e‑mail",
    saudacao: "Saudação",
    saudacaoPlaceholder: "Mensagem de saudação",
    identidadeVisual: "Identidade Visual",
    logotipo: "Logotipo",
    logoDropZone: "Arraste e solte o logo aqui ou clique para selecionar (somente PNG ou JPEG).",
    corPrimaria: "Cor Primária",
    corSecundaria: "Cor Secundária",
    corFundo: "Cor de Fundo",
    configuracaoAtendimento: "Configuração do Atendimento",
    saudacaoInicial: "Saudação Inicial",
    saudacaoInicialPlaceholder: "Ex.: Olá, seja bem-vindo à [nome da empresa]!",
    respostaPadrao: "Resposta Padrão",
    respostaPadraoPlaceholder: "Ex.: Oferecemos soluções inovadoras em análise de dados.",
    solicitacaoEmail: "Mensagem para Solicitar E‑mail",
    solicitacaoEmailPlaceholder: "Ex.: Antes de nos despedirmos, posso enviar mais detalhes por e‑mail. Qual é o seu e‑mail?",
    mensagemEncerramento: "Mensagem de Encerramento",
    mensagemEncerramentoPlaceholder: "Ex.: Obrigado pelo contato! Estamos à disposição.",
    listaProdutos: "Lista de Produtos/Serviços",
    listaProdutosPlaceholder: "Ex.: - Dashboards Interativos\n- Atendimento Virtual com IA\n- Soluções Integradas",
    salvar: "Salvar Configuração",
    logout: "Sair",
    languageLabel: "Idioma",
    successMessage: "Cadastro da assistente virtual realizado com sucesso! Você pode editar e salvar as alterações.",
    logoFormatError: "Apenas arquivos PNG ou JPEG são aceitos.",
    envSectionTitle: "Variáveis de Ambiente",
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
    // Traduções em inglês (se necessário)
  },
};

function ConfigEmpresa({ user, onLogout }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('pt');
  const t = translations[language];

  // Estado inicial do formulário
  const initialState = {
    nome: '',
    apiKey: '',
    telefone: '',
    email: '',
    saudacao: '',
    logo: null,
    logoFileName: null,
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
  };

  const [empresa, setEmpresa] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const logoInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('dadosBasicos');

  // Tooltips para explicações
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
    verifyToken: "Token utilizado para verificar a autenticidade das requisições, garantindo a segurança da integração.",
    whatsappApiToken: "Token da API do WhatsApp, necessário para autenticar as requisições à API do WhatsApp Business.",
    openaiApiKey: "Chave de API da OpenAI para acessar serviços de inteligência artificial.",
    mongoUri: "URI de conexão do MongoDB utilizada para conectar a aplicação ao banco de dados.",
    phoneNumberId: "Identificador do número de telefone do WhatsApp Business.",
    emailUser: "Endereço de e‑mail utilizado para enviar notificações automáticas.",
    emailPass: "Senha associada ao EMAIL_USER para autenticação de e‑mail.",
    emailGestor: "E‑mail do gestor da aplicação que receberá notificações e relatórios.",
  };

  const instExplanationsTexts = {
    regrasResposta: "Digite as regras de resposta para a assistente virtual.",
    linkCalendly: "Cole o link do Calendly aqui.",
    linkSite: "Cole o link do site aqui.",
    exemplosAtendimento: "Digite exemplos de perguntas e respostas para o atendimento.",
  };

  const toggleEnvExplanation = (field) => {
    setEnvExplanations(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleInstExplanation = (field) => {
    setInstExplanations(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Ao carregar, busca a configuração existente (se houver) via GET em /api/company
  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch('/api/company', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.company) {
            setEmpresa(data.company);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar configuração da empresa:", error);
      }
    }
    fetchCompany();
  }, []);

  // Função de logout (não modificada)
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Erro ao encerrar a sessão:', error);
    } finally {
      localStorage.removeItem('authToken');
      onLogout();
      navigate('/login', { replace: true });
    }
  };

  // Validação: todos os campos obrigatórios (exceto logo) devem estar preenchidos
  const validateForm = () => {
    let newErrors = {};
    if (!empresa.nome.trim())
      newErrors.nome = t.nomeEmpresa + " é obrigatório.";
    if (!empresa.apiKey.trim() || !/^sk-(proj-)?[A-Za-z0-9_-]+$/.test(empresa.apiKey) || empresa.apiKey.length < 50)
      newErrors.apiKey = t.apiKeyError;
    const phoneDigits = empresa.telefone.replace(/\D/g, '');
    if (!empresa.telefone.trim() || phoneDigits.length < 10 || phoneDigits.length > 15)
      newErrors.telefone = "Telefone inválido. Insira entre 10 e 15 dígitos.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!empresa.email.trim() || !emailRegex.test(empresa.email))
      newErrors.email = "E‑mail inválido.";
    if (!empresa.saudacao.trim())
      newErrors.saudacao = "Saudação é obrigatória.";
    if (!empresa.saudacaoInicial.trim())
      newErrors.saudacaoInicial = "Saudação Inicial é obrigatória.";
    if (!empresa.respostaPadrao.trim())
      newErrors.respostaPadrao = "Resposta Padrão é obrigatória.";
    if (!empresa.mensagemEncerramento.trim())
      newErrors.mensagemEncerramento = "Mensagem de Encerramento é obrigatória.";
    if (!empresa.listaProdutos.trim())
      newErrors.listaProdutos = "Lista de Produtos/Serviços é obrigatória.";
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
      if (!empresa[field] || !empresa[field].trim()) {
        newErrors[field] = field.toUpperCase() + " é obrigatório.";
      }
    });
    if (!empresa.regrasResposta.trim()) {
      newErrors.regrasResposta = "Regras de Resposta são obrigatórias.";
    }
    if (!empresa.linkCalendly.trim()) {
      newErrors.linkCalendly = "Link de Calendly é obrigatório.";
    }
    if (!empresa.linkSite.trim()) {
      newErrors.linkSite = "Link do Site é obrigatório.";
    }
    if (!empresa.exemplosAtendimento.trim()) {
      newErrors.exemplosAtendimento = "Exemplos de Perguntas e Respostas são obrigatórios.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!validateForm()) return;

    try {
      let response;
      if (empresa._id) {
        // Atualiza a configuração existente via PUT
        response = await fetch('/api/company', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(empresa),
        });
      } else {
        // Cria a configuração via POST
        response = await fetch('/register-company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(empresa),
        });
      }
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.error || "Erro ao salvar configuração.");
        setSuccess(false);
      } else {
        setSuccess(true);
        setSubmitError(null);
        // Atualiza o estado com os dados retornados para futuras edições
        setEmpresa(data.company || empresa);
      }
    } catch (error) {
      setSubmitError("Erro ao enviar dados: " + error.message);
      setSuccess(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEmpresa(prev => ({
            ...prev,
            logo: reader.result,
            logoFileName: file.name,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setErrors(prev => ({ ...prev, logo: t.logoFormatError }));
        setEmpresa(prev => ({ ...prev, logo: '', logoFileName: null }));
      }
    } else {
      setEmpresa(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEmpresa(prev => ({
            ...prev,
            logo: reader.result,
            logoFileName: file.name,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setErrors(prev => ({ ...prev, logo: t.logoFormatError }));
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
          error = t.nomeEmpresa + " é obrigatório.";
        break;
      case 'apiKey':
        if (!value.trim() || !/^sk-(proj-)?[A-Za-z0-9_-]+$/.test(value) || value.length < 50)
          error = t.apiKeyError;
        break;
      case 'telefone': {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15)
          error = "Telefone inválido. Insira entre 10 e 15 dígitos.";
        break;
      }
      case 'email': {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value.trim() || !emailRegex.test(value))
          error = "E‑mail inválido.";
        break;
      }
      case 'saudacao':
        if (!value.trim())
          error = "Saudação é obrigatória.";
        break;
      case 'saudacaoInicial':
        if (!value.trim())
          error = "Saudação Inicial é obrigatória.";
        break;
      case 'respostaPadrao':
        if (!value.trim())
          error = "Resposta Padrão é obrigatória.";
        break;
      case 'mensagemEncerramento':
        if (!value.trim())
          error = "Mensagem de Encerramento é obrigatória.";
        break;
      case 'listaProdutos':
        if (!value.trim())
          error = "Lista de Produtos/Serviços é obrigatória.";
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
          error = name.toUpperCase() + " é obrigatório.";
        break;
      case 'regrasResposta':
        if (!value.trim())
          error = "Regras de Resposta são obrigatórias.";
        break;
      case 'linkCalendly':
        if (!value.trim())
          error = "Link de Calendly é obrigatório.";
        break;
      case 'linkSite':
        if (!value.trim())
          error = "Link do Site é obrigatório.";
        break;
      case 'exemplosAtendimento':
        if (!value.trim())
          error = "Exemplos de Perguntas e Respostas são obrigatórios.";
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <div>
      <style>
        {`
          .nav-tabs .nav-link.active {
            background-color: #5de5d9 !important;
            color: white !important;
            border-color: #4cc9c0 !important;
            font-weight: bold;
          }
        `}
      </style>

      {/* Apenas os Tabs, sem header ou footer extra */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="dadosBasicos" title={t.dadosBasicos}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>{t.nomeEmpresa}</label>
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
        </Tab>
        <Tab eventKey="identidadeVisual" title={t.identidadeVisual}>
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
              {empresa.logoFileName && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontStyle: 'italic' }}>Arquivo selecionado: {empresa.logoFileName}</p>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e3342f',
                      cursor: 'pointer',
                    }}
                  >
                    Remover
                  </button>
                </div>
              )}
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
        </Tab>
        <Tab eventKey="fluxoAtendimento" title={t.configuracaoAtendimento}>
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
        </Tab>
        <Tab eventKey="envVars" title={t.envSectionTitle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'VERIFY_TOKEN', name: 'verifyToken' },
              { label: 'WHATSAPP_API_TOKEN', name: 'whatsappApiToken' },
              { label: 'MONGO_URI', name: 'mongoUri' },
              { label: 'PHONE_NUMBER_ID', name: 'phoneNumberId' },
              { label: 'EMAIL_USER', name: 'emailUser' },
              { label: 'EMAIL_PASS', name: 'emailPass', type: 'text' },
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
        </Tab>
        <Tab eventKey="instrucao" title={t.instrucoesPersonalizadas}>
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
          <button
            type="submit"
            style={{
              backgroundColor: '#5de5d9',
              border: 'none',
              padding: '1rem',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              marginTop: '1rem'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4cc9c0')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5de5d9')}
            onClick={handleSubmit}
          >
            {t.salvar}
          </button>
        </Tab>
      </Tabs>
      {submitError && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#842029',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        >
          {submitError}
        </div>
      )}
      {success && (
        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#5de5d9', marginTop: '1rem' }}>
          {t.successMessage}
        </div>
      )}
    </div>
  );
}

export default ConfigEmpresa;

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Tab, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
    assistenteVirtualNome: "Nome da Assistente Virtual",
    assistenteVirtualPlaceholder: "Digite o nome da assistente virtual",
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
    successMessage: "Assistente virtual cadastrada com sucesso! Você pode editar e salvar as alterações.",
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
    fillAllFields: "Por favor, preencha todos os campos obrigatórios antes de salvar as alterações."
  },
  en: {
    // Traduções em inglês (se necessário)
  },
};

function ConfigEmpresa({ user, onLogout }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('pt');
  const t = translations[language];

  // Estilos básicos (sugestão: extrair para um arquivo CSS)
  const labelStyle = { display: 'block', marginBottom: '0.5rem', color: '#272631' };
  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' };
  const errorStyle = { color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' };
  const dropZoneStyle = { border: '2px dashed #ccc', borderRadius: '4px', padding: '1rem', textAlign: 'center', cursor: 'pointer', position: 'relative' };
  const explanationIconStyle = { marginLeft: '8px', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' };
  const explanationTextStyle = { display: 'block', fontSize: '0.8rem', color: '#555', marginTop: '0.5rem', backgroundColor: '#f1f1f1', padding: '0.5rem', borderRadius: '4px' };

  const initialState = {
    nome: '',
    nomeAssistenteVirtual: '',
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
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const logoInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('dadosBasicos');

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

  useEffect(() => {
    if (user && user.role === 'client') {
      fetch('/api/company', { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (data.company) {
            setEmpresa(prev => ({ ...prev, ...data.company }));
          }
        })
        .catch((err) => console.error("Erro ao buscar empresa:", err));
    }
  }, [user]);

  const validateForm = () => {
    let newErrors = {};
    // Campos obrigatórios comuns a todas as abas
    const requiredFields = [
      { key: 'nome', msg: language === 'pt' ? 'Nome é obrigatório.' : 'Name is required.' },
      { key: 'nomeAssistenteVirtual', msg: language === 'pt' ? 'Nome da Assistente Virtual é obrigatório.' : 'Virtual Assistant Name is required.' },
      { key: 'apiKey', msg: t.apiKeyError, validator: (value) => value.trim() && /^sk-(proj-)?[A-Za-z0-9_-]+$/.test(value) && value.length >= 50 },
      {
        key: 'telefone',
        msg: language === 'pt' ? 'Telefone inválido. Insira entre 10 e 15 dígitos.' : 'Invalid phone. Enter between 10 and 15 digits.',
        validator: (value) => {
          const digits = value.replace(/\D/g, '');
          return value.trim() && digits.length >= 10 && digits.length <= 15;
        }
      },
      { key: 'email', msg: language === 'pt' ? 'E‑mail inválido.' : 'Invalid e‑mail.', validator: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) },
      { key: 'saudacao', msg: language === 'pt' ? 'Saudação é obrigatória.' : 'Greeting is required.' },
      { key: 'saudacaoInicial', msg: language === 'pt' ? 'Saudação Inicial é obrigatória.' : 'Initial Greeting is required.' },
      { key: 'respostaPadrao', msg: language === 'pt' ? 'Resposta Padrão é obrigatória.' : 'Standard Response is required.' },
      { key: 'mensagemEncerramento', msg: language === 'pt' ? 'Mensagem de Encerramento é obrigatória.' : 'Closing Message is required.' },
      { key: 'listaProdutos', msg: language === 'pt' ? 'Lista de Produtos/Serviços é obrigatória.' : 'Products/Services List is required.' },
    ];

    // Agora, sempre exigimos também os campos das abas Variáveis de Ambiente e Instruções Personalizadas
    const additionalFields = [
      { key: 'verifyToken', msg: language === 'pt' ? 'VERIFY_TOKEN é obrigatório.' : 'VERIFY_TOKEN is required.' },
      { key: 'whatsappApiToken', msg: language === 'pt' ? 'WHATSAPP_API_TOKEN é obrigatório.' : 'WHATSAPP_API_TOKEN is required.' },
      { key: 'openaiApiKey', msg: language === 'pt' ? 'OPENAI_API_KEY é obrigatório.' : 'OPENAI_API_KEY is required.' },
      { key: 'mongoUri', msg: language === 'pt' ? 'MONGO_URI é obrigatório.' : 'MONGO_URI is required.' },
      { key: 'phoneNumberId', msg: language === 'pt' ? 'PHONE_NUMBER_ID é obrigatório.' : 'PHONE_NUMBER_ID is required.' },
      { key: 'emailUser', msg: language === 'pt' ? 'EMAIL_USER é obrigatório.' : 'EMAIL_USER is required.' },
      { key: 'emailPass', msg: language === 'pt' ? 'EMAIL_PASS é obrigatório.' : 'EMAIL_PASS is required.' },
      { key: 'emailGestor', msg: language === 'pt' ? 'EMAIL_GESTOR é obrigatório.' : 'EMAIL_GESTOR is required.' },
      { key: 'regrasResposta', msg: language === 'pt' ? 'Regras de Resposta são obrigatórias.' : 'Response rules are required.' },
      { key: 'linkCalendly', msg: language === 'pt' ? 'Link de Calendly é obrigatório.' : 'Calendly link is required.' },
      { key: 'linkSite', msg: language === 'pt' ? 'Link do Site é obrigatório.' : 'Site link is required.' },
      { key: 'exemplosAtendimento', msg: language === 'pt' ? 'Exemplos de Perguntas e Respostas são obrigatórios.' : 'Examples of Q&A are required.' },
    ];

    requiredFields.push(...additionalFields);

    // Validação de cada campo da lista
    requiredFields.forEach((field) => {
      const value = empresa[field.key] || "";
      if (field.validator) {
        if (!field.validator(value)) {
          newErrors[field.key] = field.msg;
        }
      } else {
        if (!value.trim()) {
          newErrors[field.key] = field.msg;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const submitData = async () => {
    try {
      let response;
      if (empresa._id) {
        response = await fetch('/api/company', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(empresa),
        });
      } else {
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
      } else {
        setSuccess(true);
        setSubmitError(null);
        if (data.company) {
          setEmpresa(prev => ({ ...prev, ...data.company }));
        }
        setIsEditable(false);
      }
    } catch (error) {
      setSubmitError("Erro ao enviar dados: " + error.message);
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowErrorModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    submitData();
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleCancelEdit = () => {
    setIsEditable(false);
    fetch('/api/company', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.company) {
          setEmpresa(prev => ({ ...prev, ...data.company }));
        }
      })
      .catch((err) => console.error("Erro ao recarregar dados:", err));
  };

  // Função para remover logo
  const handleRemoveLogo = () => {
    setEmpresa(prev => ({ ...prev, logo: null, logoFileName: null }));
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
          error = language === 'pt' ? 'Nome é obrigatório.' : 'Name is required.';
        break;
      case 'nomeAssistenteVirtual':
        if (!value.trim())
          error = language === 'pt'
            ? 'Nome da Assistente Virtual é obrigatório.'
            : 'Virtual Assistant Name is required.';
        break;
      case 'apiKey':
        if (
          !value.trim() ||
          !/^sk-(proj-)?[A-Za-z0-9_-]+$/.test(value) ||
          value.length < 50
        )
          error = t.apiKeyError;
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
        if (!value.trim() || !emailRegex.test(value))
          error = language === 'pt' ? 'E‑mail inválido.' : 'Invalid e‑mail.';
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
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <div>
      <style>{`
        .nav-tabs .nav-link.active {
          background-color: #5de5d9 !important;
          color: white !important;
          border-color: #4cc9c0 !important;
          font-weight: bold;
        }
      `}</style>

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
                disabled={!isEditable}
              />
              {errors.nome && <span style={errorStyle}>{errors.nome}</span>}
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>{t.assistenteVirtualNome}</label>
              <input
                type="text"
                name="nomeAssistenteVirtual"
                placeholder={t.assistenteVirtualPlaceholder}
                value={empresa.nomeAssistenteVirtual}
                onChange={handleChange}
                onBlur={handleBlur}
                style={inputStyle}
                required
                disabled={!isEditable}
              />
              {errors.nomeAssistenteVirtual && <span style={errorStyle}>{errors.nomeAssistenteVirtual}</span>}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
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
                disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>
              {empresa.logoFileName && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontStyle: 'italic' }}>Arquivo selecionado: {empresa.logoFileName}</p>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      style={{ background: 'none', border: 'none', color: '#e3342f', cursor: 'pointer' }}
                    >
                      Remover
                    </button>
                  )}
                </div>
              )}
              {errors.logo && <span style={errorStyle}>{errors.logo}</span>}
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>{t.corPrimaria}</label>
              <input type="color" name="primaryColor" value={empresa.primaryColor} onChange={handleChange} style={{ width: '100%', height: '3rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={!isEditable} />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>{t.corSecundaria}</label>
              <input type="color" name="secondaryColor" value={empresa.secondaryColor} onChange={handleChange} style={{ width: '100%', height: '3rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={!isEditable} />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>{t.corFundo}</label>
              <input type="color" name="backgroundColor" value={empresa.backgroundColor} onChange={handleChange} style={{ width: '100%', height: '3rem', border: '1px solid #ccc', borderRadius: '4px' }} disabled={!isEditable} />
            </div>
          </div>
        </Tab>
        <Tab eventKey="fluxoAtendimento" title={t.configuracaoAtendimento}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: '1 1 100%' }}>
              <label style={labelStyle}>{t.saudacaoInicial}</label>
              <textarea name="saudacaoInicial" rows="2" placeholder={t.saudacaoInicialPlaceholder} value={empresa.saudacaoInicial} onChange={handleChange} onBlur={handleBlur} style={inputStyle} required disabled={!isEditable}></textarea>
              {errors.saudacaoInicial && <span style={errorStyle}>{errors.saudacaoInicial}</span>}
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={labelStyle}>{t.respostaPadrao}</label>
              <textarea name="respostaPadrao" rows="2" placeholder={t.respostaPadraoPlaceholder} value={empresa.respostaPadrao} onChange={handleChange} onBlur={handleBlur} style={inputStyle} required disabled={!isEditable}></textarea>
              {errors.respostaPadrao && <span style={errorStyle}>{errors.respostaPadrao}</span>}
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={labelStyle}>{t.solicitacaoEmail}</label>
              <textarea name="solicitacaoEmail" rows="2" placeholder={t.solicitacaoEmailPlaceholder} value={empresa.solicitacaoEmail} onChange={handleChange} style={inputStyle} disabled={!isEditable}></textarea>
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={labelStyle}>{t.mensagemEncerramento}</label>
              <textarea name="mensagemEncerramento" rows="2" placeholder={t.mensagemEncerramentoPlaceholder} value={empresa.mensagemEncerramento} onChange={handleChange} onBlur={handleBlur} style={inputStyle} required disabled={!isEditable}></textarea>
              {errors.mensagemEncerramento && <span style={errorStyle}>{errors.mensagemEncerramento}</span>}
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={labelStyle}>{t.listaProdutos}</label>
              <textarea name="listaProdutos" rows="3" placeholder={t.listaProdutosPlaceholder} value={empresa.listaProdutos} onChange={handleChange} onBlur={handleBlur} style={{ ...inputStyle, whiteSpace: 'pre-wrap' }} required disabled={!isEditable}></textarea>
              {errors.listaProdutos && <span style={errorStyle}>{errors.listaProdutos}</span>}
            </div>
          </div>
        </Tab>
        <Tab eventKey="envVars" title={t.envSectionTitle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'VERIFY_TOKEN', name: 'verifyToken' },
              { label: 'WHATSAPP_API_TOKEN', name: 'whatsappApiToken' },
              { label: 'OPENAI_API_KEY', name: 'openaiApiKey' }, // campo adicionado
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
                  disabled={!isEditable}
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
                    disabled={!isEditable}
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
                    disabled={!isEditable}
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
          {/* O botão de salvar foi removido deste local para evitar duplicidade */}
        </Tab>
      </Tabs>

      {/* Botões de controle de edição centralizados na parte inferior */}
      {!isEditable && (
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <button
            onClick={() => setIsEditable(true)}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#5de5d9', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
          >
            Editar
          </button>
        </div>
      )}
      {isEditable && (
        <div style={{ margin: '1rem 0', textAlign: 'center' }}>
          <button
            onClick={handleSaveClick}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#5de5d9', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', marginRight: '0.5rem' }}
          >
            Salvar
          </button>
          <button
            onClick={handleCancelEdit}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', color: '#000', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      )}

      {submitError && (
        <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {submitError}
        </div>
      )}
      {success && (
        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#5de5d9', marginTop: '1rem' }}>
          {t.successMessage}
        </div>
      )}

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Alterações</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Deseja realmente salvar as alterações?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleErrorModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Campos Obrigatórios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Por favor, preencha os seguintes campos obrigatórios:</p>
          <ul>
            {Object.keys(errors).map((fieldKey, index) => (
              <li key={index}>{errors[fieldKey]}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleErrorModalClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default ConfigEmpresa;

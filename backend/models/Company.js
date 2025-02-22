import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  banco: { type: String, required: true }, // Adicionado para garantir que o nome do banco seja salvo
  nomeAssistenteVirtual: { type: String }, // novo campo adicionado
  apiKey: { type: String },
  telefone: { type: String },
  email: { type: String },
  saudacao: { type: String },
  logo: { type: String }, // pode ser uma URL ou path do arquivo
  primaryColor: { type: String },
  secondaryColor: { type: String },
  backgroundColor: { type: String },
  saudacaoInicial: { type: String },
  respostaPadrao: { type: String },
  solicitacaoEmail: { type: String },
  mensagemEncerramento: { type: String },
  listaProdutos: { type: String },
  // Variáveis do .env
  verifyToken: { type: String },
  whatsappApiToken: { type: String },
  mongoUri: { type: String },
  phoneNumberId: { type: String },
  emailUser: { type: String },
  emailPass: { type: String },
  emailGestor: { type: String },
  // Instruções Personalizadas
  regrasResposta: { type: String },
  linkCalendly: { type: String },
  linkSite: { type: String },
  exemplosAtendimento: { type: String },
}, { timestamps: true });

export default mongoose.model('Company', companySchema, 'companies');

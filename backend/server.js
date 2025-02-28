import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Company from './models/Company.js';
import Message from './models/Message.js'; // Certifique‑se de criar esse modelo conforme instruído
import { MongoClient } from 'mongodb';
import webhookRouter from './routes/webhook.js'; // ajuste o caminho se necessário

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Monta o router do webhook em uma rota pública, por exemplo, /webhook
app.use('/webhook', webhookRouter);

// Indica que o Express deve confiar no proxy (necessário para ambientes como o Heroku)
app.set('trust proxy', 1);

// Middlewares para interpretar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conecta ao MongoDB utilizando a connection string definida na variável de ambiente
mongoose
  .connect(process.env.MONGO_URI_EMPRESAS)
  .then(() => console.log("Conectado ao MongoDB (banco principal)"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Configuração da sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true se estiver em produção (HTTPS)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Inicializa o Passport e a sessão
app.use(passport.initialize());
app.use(passport.session());

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

// Estratégia do Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://app.bivisualizer.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Apenas permite contas Gmail
        if (!profile.emails[0].value.endsWith('@gmail.com')) {
          return done(null, false, { message: 'Apenas contas Gmail são permitidas.' });
        }

        // Procura primeiro pelo googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Se não encontrar, verifica se já existe um usuário com esse e-mail
        const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
        if (existingEmailUser) {
          // Atualiza o usuário existente para incluir o googleId e mudar o provider
          existingEmailUser.googleId = profile.id;
          existingEmailUser.provider = 'google';
          if (profile.photos && profile.photos[0]) {
            existingEmailUser.picture = profile.photos[0].value;
          }
          await existingEmailUser.save();
          return done(null, existingEmailUser);
        }

        // Caso não exista nenhum usuário com esse e-mail, cria um novo
        const newUser = await new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          provider: 'google',
          role: 'client'
        }).save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Rota para iniciar o fluxo de login com Google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account consent'
  })
);

// Callback após autenticação com Google
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Endpoint para registro manual de usuário
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({ error: "Campos obrigatórios não preenchidos." });
  }
  const existingUser = await User.findOne({ username, provider: 'local' });
  if (existingUser) {
    return res.status(400).send({ error: "Usuário já existe." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name: name || username,
      provider: 'local',
      role: 'client'
    });
    const savedUser = await newUser.save();
    res.status(201).send({ message: "Usuário registrado com sucesso!", user: savedUser });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Endpoint para login manual de usuário
app.post('/api/auth/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (req.isAuthenticated()) {
      await new Promise((resolve, reject) => {
        req.logout((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    const user = await User.findOne({ username, provider: 'local' });
    if (!user) return res.status(401).send({ error: "Credenciais inválidas." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ error: "Credenciais inválidas." });

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.login(user, (err) => {
        if (err) return next(err);
        res.send({ message: "Login efetuado com sucesso!", user });
      });
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Endpoint para verificar se o usuário está autenticado
app.get('/api/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Middleware para checar se o usuário é admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: "Acesso negado. Somente administradores têm acesso." });
}

// Endpoint para buscar todos os usuários (apenas para admin)
app.get('/api/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários: " + err.message });
  }
});

// Endpoint para buscar todas as empresas (apenas para admin)
app.get('/api/companies', isAdmin, async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar empresas: " + err.message });
  }
});

// Endpoint para promover um usuário a admin (somente para admin)
app.put('/api/users/:id/promote', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== "admin") {
      return res.status(400).json({ error: "Role inválida. Apenas 'admin' é permitido." });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário promovido com sucesso!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Erro ao promover usuário: " + err.message });
  }
});

// Endpoint para cadastro de empresas (multi‑tenant)
app.post('/register-company', async (req, res) => {
  console.log("Requisição recebida em /register-company:", req.body);

  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  if (req.user.company) {
    return res.status(400).json({ error: "Empresa já cadastrada. Utilize o endpoint de atualização." });
  }

  try {
    // Cria o documento da empresa com os dados recebidos
    const newCompany = new Company(req.body);

    // Gera um nome para o banco do tenant com base no nome da empresa
    const dbName = "empresa_" + newCompany.nome.toLowerCase().trim().replace(/\s+/g, '_');
    newCompany.banco = dbName; // Armazena o nome do banco no documento

    // Salva a empresa no banco principal
    const savedCompany = await newCompany.save();
    console.log("Empresa cadastrada:", savedCompany);

    // Cria a conexão para o tenant usando a variável MONGO_URI_TEMPLATE
    if (!process.env.MONGO_URI_TEMPLATE) {
      throw new Error("MONGO_URI_TEMPLATE não definido no ambiente.");
    }
    const tenantUri = process.env.MONGO_URI_TEMPLATE.replace('{DB_NAME}', dbName);
    const tenantConnection = mongoose.createConnection(tenantUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Inicializa a coleção de mensagens no banco do tenant
    const TenantMessage = tenantConnection.model('Message', Message.schema);
    await TenantMessage.create({
      sender: "system",
      message: "Bem vindo à sua nova instância de mensagens!",
      timestamp: new Date(),
      name: "Sistema"
    });

    // Atualiza o usuário com o _id da nova empresa cadastrada
    await User.findByIdAndUpdate(req.user._id, { company: savedCompany._id });

    // Fecha a conexão do tenant
    tenantConnection.close();

    res.status(201).send({ message: "Empresa cadastrada com sucesso!", company: savedCompany });
  } catch (err) {
    console.error("Erro ao cadastrar empresa:", err);
    res.status(500).send({ error: "Erro ao cadastrar empresa: " + err.message });
  }
});

// Endpoint para que o cliente obtenha os dados da sua empresa
app.get('/api/company', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  if (!req.user.company) {
    return res.json({ company: null });
  }
  try {
    const company = await Company.findById(req.user.company);
    res.json({ company });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar empresa: " + err.message });
  }
});

// Endpoint para que o cliente atualize os dados da sua empresa
app.put('/api/company', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  if (!req.user.company) {
    return res.status(400).json({ error: "Nenhuma empresa cadastrada para este usuário." });
  }
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.user.company,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }
    res.json({ message: "Empresa atualizada com sucesso!", company: updatedCompany });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar empresa: " + err.message });
  }
});

// Endpoint para logout – destrói a sessão e limpa o cookie
app.post('/api/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid', { path: '/' });
      return res.send({ message: "Logout successful" });
    });
  });
});

// Rota protegida para servir o frontend (página de configuração da empresa)
app.get('/company-registration', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para demover um usuário (tornar cliente)
app.put('/api/users/:id/demote', isAdmin, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: "Você não pode se demover." });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'client' },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário demovido com sucesso!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Erro ao demover usuário: " + err.message });
  }
});

// Endpoint para excluir um usuário
app.delete('/api/users/:id', isAdmin, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: "Você não pode se excluir." });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário excluído com sucesso!", user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuário: " + err.message });
  }
});

// Endpoint para excluir uma empresa (apenas para admin) e dropar o banco do tenant
app.delete('/api/companies/:id', isAdmin, async (req, res) => {
  try {
    // Exclui a empresa do banco principal
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }

    // Tenta excluir o banco do tenant, se definido
    if (deletedCompany.banco) {
      if (!process.env.MONGO_URI_TEMPLATE) {
        throw new Error("MONGO_URI_TEMPLATE não definido no ambiente.");
      }
      const tenantUri = process.env.MONGO_URI_TEMPLATE.replace('{DB_NAME}', deletedCompany.banco);
      console.log("[DROP_DB] Conectando ao banco tenant:", tenantUri);
      console.log("[DROP_DB] Nome do banco a ser droppado:", deletedCompany.banco);
      const client = new MongoClient(tenantUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      const db = client.db(deletedCompany.banco);
      const dropResult = await db.dropDatabase();
      console.log("[DROP_DB] Resultado do dropDatabase:", dropResult);
      await client.close();
      console.log("[DROP_DB] Banco do tenant", deletedCompany.banco, "excluído com sucesso.");

    }

    res.json({ message: "Empresa e banco do tenant excluídos com sucesso!", company: deletedCompany });
  } catch (err) {
    console.error("Erro ao excluir empresa:", err);
    res.status(500).json({ error: "Erro ao excluir empresa: " + err.message });
  }
});



// Endpoint para alteração de senha do usuário (manual)
app.put('/api/user/password', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "A nova senha e a confirmação não conferem." });
  }
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha atual incorreta." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar senha: " + err.message });
  }
});

// Endpoint para alteração de senha (alternativa)
app.put('/api/user/change-password', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha atual incorreta." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Senha alterada com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao alterar senha: " + err.message });
  }
});

// Endpoint para atualizar dados do usuário
app.put('/api/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  const { name, email, company, telefone } = req.body;
  if (email) {
    const emailExists = await User.findOne({
      email,
      _id: { $ne: req.user._id }
    });
    if (emailExists) {
      return res.status(400).json({ error: "Este email já está em uso." });
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, company, telefone },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ message: "Usuário atualizado com sucesso!", user: updatedUser });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro ao atualizar usuário: " + err.message });
  }
});

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota curinga para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
